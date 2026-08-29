import { NextResponse } from 'next/server';
import { requireRole, isAuthError, adminDb, type AppUser } from '@/lib/firebase-admin';

/**
 * GET /api/auth/users
 * Returns all registered users. Requires super_admin role.
 */
export async function GET(request: Request) {
  const result = await requireRole(request, 'super_admin');
  if (isAuthError(result)) return result;

  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const snapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('[/api/auth/users GET] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/auth/users
 * Creates or updates a user record with role assignment.
 * Requires super_admin role.
 * Body: { email, role, displayName?, businessSlugs? }
 */
export async function POST(request: Request) {
  const result = await requireRole(request, 'super_admin');
  if (isAuthError(result)) return result;

  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

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

    // If uid provided, update existing user
    if (uid) {
      await adminDb.collection('users').doc(uid).set(
        {
          email: email.toLowerCase().trim(),
          role,
          displayName: displayName || email.split('@')[0],
          businessSlugs: businessSlugs || [],
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return NextResponse.json({
        success: true,
        message: 'המשתמש עודכן בהצלחה',
      });
    }

    // Create a pre-registered user entry keyed by email
    // When this user logs in via Firebase Auth, verifyAuth will match them
    const preRegId = `pre_${email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
    
    await adminDb.collection('users').doc(preRegId).set({
      email: email.toLowerCase().trim(),
      role,
      displayName: displayName || email.split('@')[0],
      businessSlugs: businessSlugs || [],
      createdAt: new Date().toISOString(),
      preRegistered: true, // Flag: will be migrated to real UID on first login
    });

    return NextResponse.json({
      success: true,
      message: `משתמש ${email} נרשם בהצלחה כ-${role === 'super_admin' ? 'מנהל-על' : 'מנהל עסק'}`,
      userId: preRegId,
    });
  } catch (error: any) {
    console.error('[/api/auth/users POST] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/users?uid=...
 * Deletes a user record. Requires super_admin role.
 * Cannot delete yourself.
 */
export async function DELETE(request: Request) {
  const result = await requireRole(request, 'super_admin');
  if (isAuthError(result)) return result;

  const currentUser = result as AppUser;

  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

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

    await adminDb.collection('users').doc(uid).delete();

    return NextResponse.json({
      success: true,
      message: 'המשתמש הוסר בהצלחה',
    });
  } catch (error: any) {
    console.error('[/api/auth/users DELETE] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
