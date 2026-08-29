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
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
      } else {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (projectId && clientEmail && privateKey) {
          adminApp = initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
            projectId,
          });
        } else if (projectId) {
          adminApp = initializeApp({ projectId });
        }
      }
    }

    if (adminApp) {
      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
    }
  } catch (error) {
    console.error('[firebase-admin] Initialization error:', error);
  }
}

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
  businessSlugs: string[];
  createdAt: string;
  lastLogin?: string;
}

/**
 * Helper to safely decode a Firebase JWT payload
 */
function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Verifies the Firebase ID token from the Authorization header
 * and fetches the user's role from Firestore.
 * Returns null if unauthenticated.
 */
export async function verifyAuth(request: Request): Promise<AppUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.substring(7);

  // 1. If Admin SDK is initialized, use verifyIdToken
  if (adminAuth && adminDb) {
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = decoded.email || '';

      const userDoc = await adminDb.collection('users').doc(uid).get();

      if (userDoc.exists) {
        const data = userDoc.data()!;
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

          const migratedUser: Omit<AppUser, 'uid'> = {
            email: preRegData.email,
            displayName: decoded.name || preRegData.displayName || email.split('@')[0],
            photoURL: decoded.picture || '',
            role: preRegData.role as UserRole,
            businessSlugs: preRegData.businessSlugs || [],
            createdAt: preRegData.createdAt || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };

          await adminDb.collection('users').doc(uid).set(migratedUser);
          await adminDb.collection('users').doc(preRegDoc.id).delete();
          return { uid, ...migratedUser };
        }
      }

      return null;
    } catch (adminErr) {
      console.error('[verifyAuth] Admin SDK verification error:', adminErr);
    }
  }

  // 2. Graceful Fallback: decode JWT payload when Admin SDK keys are not in env vars
  const decoded = decodeJwtPayload(idToken);
  if (decoded && (decoded.user_id || decoded.sub)) {
    const uid = decoded.user_id || decoded.sub;
    const email = (decoded.email || '').toLowerCase();

    const envSuperAdmins = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    const superAdminEmails = envSuperAdmins.length > 0 
      ? envSuperAdmins 
      : ['ishay1997@gmail.com'];

    if (superAdminEmails.includes(email)) {
      return {
        uid,
        email,
        displayName: decoded.name || email.split('@')[0],
        photoURL: decoded.picture || '',
        role: 'super_admin',
        businessSlugs: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    }
  }

  return null;
}

/**
 * Middleware helper for API routes: checks if caller has required role.
 * Returns NextResponse error if unauthorized, or the AppUser if authorized.
 */
export async function requireRole(
  request: Request,
  allowedRoles: UserRole[] = ['super_admin']
): Promise<AppUser | NextResponse> {
  const user = await verifyAuth(request);

  if (!user) {
    return NextResponse.json(
      { error: 'אימות נכשל. יש להתחבר למערכת' },
      { status: 401 }
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'אין לך הרשאה לבצע פעולה זו' },
      { status: 403 }
    );
  }

  return user;
}
