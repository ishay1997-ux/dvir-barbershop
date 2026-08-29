import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    if (isFirebaseConfigured && db) {
      const snapshot = await getDocs(collection(db, 'schedule_overrides'));
      const overrides: Record<string, any> = {};
      snapshot.forEach((doc) => {
        overrides[doc.id] = { id: doc.id, ...doc.data() };
      });
      return NextResponse.json({ overrides, provider: 'firebase' });
    }

    return NextResponse.json({ overrides: {}, provider: 'local' });
  } catch (error: any) {
    console.error('Schedule GET API error:', error);
    return NextResponse.json({ error: error.message, overrides: {} }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, branchId, isOpen, startTime, endTime, note } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'schedule_overrides', date);
      await setDoc(
        docRef,
        {
          date,
          branchId: branchId || 'closed',
          isOpen: Boolean(isOpen),
          startTime: startTime || '09:00',
          endTime: endTime || '20:00',
          note: note || '',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      return NextResponse.json({
        success: true,
        provider: 'firebase',
        message: 'Shift override saved to Firebase',
      });
    }

    return NextResponse.json({
      success: true,
      provider: 'local',
      message: 'Shift override received (Local Mode)',
    });
  } catch (error: any) {
    console.error('Schedule POST API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
