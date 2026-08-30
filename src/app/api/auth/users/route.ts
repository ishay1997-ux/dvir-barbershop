import { NextResponse } from 'next/server';
import { requireRole, adminDb, type AppUser } from '@/lib/firebase-admin';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// In-memory fallback cache for serverless lifecycle
let cachedUsers: Array<Record<string, any>> = [
  {
    uid: 'super-admin-ishay',
    email: 'ishay1997@gmail.com',
    displayName: 'ישי (מנהל-על)',
    role: 'super_admin',
    businessSlugs: [],
    createdAt: new Date().toISOString(),
  },
];

/**
 * GET /api/auth/users
 * Returns all registered users. Requires super_admin role.
 */
export async function GET(request: Request) {
  const result = await requireRole(request, ['super_admin']);
  if (result instanceof NextResponse) return result;

  try {
    // 1. Try Firebase Admin SDK
    if (adminDb) {
      const snapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
      const users = snapshot.docs.map((doc: any) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json({ users });
    }

    // 2. Try Client Firestore SDK
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'users'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const users = snapshot.docs.map(d => ({
            uid: d.id,
            ...d.data(),
          }));
          return NextResponse.json({ users });
        }
      } catch (clientDbErr) {
        console.warn('[GET /api/auth/users] Firestore read warning:', clientDbErr);
      }
    }

    // 3. In-memory fallback
    return NextResponse.json({ users: cachedUsers });
  } catch (error: any) {
    console.error('[/api/auth/users GET] Error:', error);
    return NextResponse.json({ users: cachedUsers });
  }
}

/**
 * POST /api/auth/users
 * Creates or updates a user record with role assignment.
 * Requires super_admin role.
 */
export async function POST(request: Request) {
  const result = await requireRole(request, ['super_admin']);
  if (result instanceof NextResponse) return result;

  try {
    const body = await request.json();
    const { email, role, displayName, businessSlugs, uid } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'אימייל ותפקיד הם שדות חובה' },
        { status: 400 }
      );
    }

    if (!['super_admin', 'business_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'תפקיד לא חוקי. אפשרויות: super_admin, business_admin' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const finalSlugs = Array.isArray(businessSlugs) && businessSlugs.length > 0
      ? businessSlugs
      : (role === 'business_admin' ? ['dvir'] : []);

    const userRecord = {
      email: cleanEmail,
      role,
      displayName: displayName || cleanEmail.split('@')[0],
      businessSlugs: finalSlugs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preRegistered: true,
    };

    const targetId = uid || `pre_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

    // 1. Save to Admin DB if available
    if (adminDb) {
      await adminDb.collection('users').doc(targetId).set(userRecord, { merge: true });
    }

    // 2. Save to Client Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', targetId), userRecord, { merge: true });
      } catch (fbErr) {
        console.warn('[POST /api/auth/users] Firestore write warning:', fbErr);
      }
    }

    // 3. Save to In-memory cache
    const existingIndex = cachedUsers.findIndex(u => u.email === cleanEmail || u.uid === targetId);
    if (existingIndex >= 0) {
      cachedUsers[existingIndex] = { uid: targetId, ...userRecord };
    } else {
      cachedUsers.unshift({ uid: targetId, ...userRecord });
    }

    return NextResponse.json({
      success: true,
      message: `משתמש ${cleanEmail} נרשם בהצלחה כ-${role === 'super_admin' ? 'מנהל-על' : 'מנהל עסק'}`,
      userId: targetId,
      user: { uid: targetId, ...userRecord },
    });
  } catch (error: any) {
    console.error('[/api/auth/users POST] Error:', error);
    return NextResponse.json({ error: error?.message || 'שגיאה בשמירת המשתמש' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/users?uid=...
 * Deletes a user record. Requires super_admin role.
 */
export async function DELETE(request: Request) {
  const result = await requireRole(request, ['super_admin']);
  if (result instanceof NextResponse) return result;

  const currentUser = result as AppUser;

  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'חסר מזהה משתמש' }, { status: 400 });
    }

    if (uid === currentUser.uid) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק את המשתמש שלך' },
        { status: 400 }
      );
    }

    // 1. Delete from Admin DB
    if (adminDb) {
      await adminDb.collection('users').doc(uid).delete();
    }

    // 2. Delete from Client Firestore
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (fbErr) {
        console.warn('[DELETE /api/auth/users] Firestore delete warning:', fbErr);
      }
    }

    // 3. Delete from In-memory cache
    cachedUsers = cachedUsers.filter(u => u.uid !== uid);

    return NextResponse.json({
      success: true,
      message: 'המשתמש הוסר בהצלחה',
    });
  } catch (error: any) {
    console.error('[/api/auth/users DELETE] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
