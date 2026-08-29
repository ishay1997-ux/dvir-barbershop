import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase-admin';

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile and role.
 * Used by the client after Firebase Auth login to determine authorization.
 */
export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'לא מאומת או אין הרשאה' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        businessSlugs: user.businessSlugs,
      },
    });
  } catch (error: any) {
    console.error('[/api/auth/me] Error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'שגיאה באימות' },
      { status: 500 }
    );
  }
}
