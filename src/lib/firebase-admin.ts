import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

// ============================================================
// Firebase Admin SDK — Server-Side Only
// ============================================================

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initAdmin() {
  if (adminApp) return;

  try {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      // Option 1: Service Account JSON from env var
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
      } else {
        // Option 2: Individual env vars
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (projectId && clientEmail && privateKey) {
          adminApp = initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
            projectId,
          });
        } else if (projectId) {
          // Fallback: Application Default Credentials (works on GCP / local emulator)
          adminApp = initializeApp({ projectId });
        } else {
          console.warn('[firebase-admin] No credentials configured. Server-side auth will be unavailable.');
          return;
        }
      }
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } catch (error) {
    console.error('[firebase-admin] Initialization error:', error);
  }
}

// Initialize on module load
initAdmin();

export { adminAuth, adminDb };

// ============================================================
// User Role Types
// ============================================================

export type UserRole = 'super_admin' | 'business_admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  businessSlugs: string[];  // empty = all businesses (for super_admin)
  createdAt: string;
  lastLogin?: string;
}

// ============================================================
// Token Verification & Role Check
// ============================================================

/**
 * Verifies the Firebase ID token from the Authorization header
 * and fetches the user's role from Firestore.
 * Returns null if unauthenticated.
 */
export async function verifyAuth(request: Request): Promise<AppUser | null> {
  if (!adminAuth || !adminDb) {
    console.warn('[verifyAuth] Firebase Admin not initialized');
    return null;
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.substring(7);

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || '';

    // Check Firestore users collection
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (userDoc.exists) {
      const data = userDoc.data()!;
      // Update last login
      adminDb.collection('users').doc(uid).update({ lastLogin: new Date().toISOString() }).catch(() => {});
      return {
        uid,
        email: data.email || email,
        displayName: data.displayName || decoded.name || '',
        photoURL: data.photoURL || decoded.picture || '',
        role: data.role as UserRole,
        businessSlugs: data.businessSlugs || [],
        createdAt: data.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    }

    // Auto-provision: check if email is in SUPER_ADMIN_EMAILS env var or default super admins
    const envSuperAdmins = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    const superAdminEmails = envSuperAdmins.length > 0 
      ? envSuperAdmins 
      : ['ishay1997@gmail.com'];

    if (superAdminEmails.includes(email.toLowerCase())) {
      const newUser: Omit<AppUser, 'uid'> = {
        email,
        displayName: decoded.name || email.split('@')[0],
        photoURL: decoded.picture || '',
        role: 'super_admin',
        businessSlugs: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await adminDb.collection('users').doc(uid).set(newUser);
      return { uid, ...newUser };
    }

    // Check for pre-registered user by email
    if (email) {
      const preRegQuery = await adminDb.collection('users')
        .where('email', '==', email.toLowerCase())
        .where('preRegistered', '==', true)
        .limit(1)
        .get();

      if (!preRegQuery.empty) {
        const preRegDoc = preRegQuery.docs[0];
        const preRegData = preRegDoc.data();

        // Migrate pre-registered user to real UID
        const migratedUser: Omit<AppUser, 'uid'> = {
          email: preRegData.email,
          displayName: decoded.name || preRegData.displayName || email.split('@')[0],
          photoURL: decoded.picture || '',
          role: preRegData.role as UserRole,
          businessSlugs: preRegData.businessSlugs || [],
          createdAt: preRegData.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Create real UID doc and delete pre-registration
        await adminDb.collection('users').doc(uid).set(migratedUser);
        await adminDb.collection('users').doc(preRegDoc.id).delete();

        return { uid, ...migratedUser };
      }
    }

    // Not authorized
    return null;
  } catch (error) {
    console.error('[verifyAuth] Token verification failed:', error);
    return null;
  }
}

/**
 * Requires a specific role. Returns the user if authorized,
 * or a NextResponse error if not.
 */
export async function requireRole(
  request: Request,
  requiredRole: UserRole | UserRole[]
): Promise<AppUser | NextResponse> {
  const user = await verifyAuth(request);

  if (!user) {
    return NextResponse.json(
      { error: 'לא מאומת. יש להתחבר למערכת.' },
      { status: 401 }
    );
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(user.role)) {
    return NextResponse.json(
      { error: 'אין הרשאה מתאימה לביצוע פעולה זו.' },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Helper: checks if a result from requireRole is an error response
 */
export function isAuthError(result: AppUser | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
