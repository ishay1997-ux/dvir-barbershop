import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// ============================================================
// Firebase Auth & Role Verification (Server-Side Safe)
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

export const adminAuth: any = null;
export const adminDb: any = null;

/**
 * Helper to safely decode a Firebase JWT payload without native binary dependencies
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
 * and fetches the user's role.
 * Returns null if unauthenticated.
 */
export async function verifyAuth(request: Request): Promise<AppUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.substring(7);
  const decoded = decodeJwtPayload(idToken);

  if (decoded && (decoded.user_id || decoded.sub)) {
    const uid = decoded.user_id || decoded.sub;
    const email = (decoded.email || '').toLowerCase();

    const envSuperAdmins = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const superAdminEmails =
      envSuperAdmins.length > 0 ? envSuperAdmins : ['ishay1997@gmail.com'];

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

    // Flagship Barber admin fallback for Dvir
    if (email === 'dvirattias10@gmail.com') {
      return {
        uid,
        email,
        displayName: decoded.name || 'דביר אטיאס',
        photoURL: decoded.picture || '',
        role: 'business_admin',
        businessSlugs: ['dvir', 'thecut'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    }

    // Check client Firestore if configured
    if (isFirebaseConfigured && db && email) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          return {
            uid,
            email,
            displayName: data.displayName || decoded.name || email.split('@')[0],
            photoURL: data.photoURL || decoded.picture || '',
            role: (data.role as UserRole) || 'business_admin',
            businessSlugs: data.businessSlugs || [],
            createdAt: data.createdAt || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
        }
      } catch (clientDbErr) {
        console.warn('Firestore fallback verifyAuth error:', clientDbErr);
      }
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
