import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface BugReportPayload {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  category: string;
  message: string;
  businessName: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

const memoryBugReports: BugReportPayload[] = [];

// 1. CREATE BUG REPORT (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, category, message, businessName } = body;

    if (!fullName || !phone || !message) {
      return NextResponse.json(
        { error: 'נא למלא את כל שדות החובה (שם, טלפון ותוכן ההודעה)' },
        { status: 400 }
      );
    }

    const reportId = `report-${Date.now()}`;
    const reportData: BugReportPayload = {
      id: reportId,
      fullName,
      phone,
      email: email || '',
      category: category || 'תקלה (באג)',
      message,
      businessName: businessName || 'המספרה של דביר',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Firebase Firestore
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'bug_reports'), {
          ...reportData,
          serverCreatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase bug report save error:', fbError);
      }
    }

    // Memory store
    memoryBugReports.unshift(reportData);

    return NextResponse.json({
      success: true,
      message: 'הדיווח התקבל בהצלחה ויועבר לטיפול מנהל המערכת',
      report: reportData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. GET ALL BUG REPORTS (GET)
export async function GET() {
  try {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'bug_reports'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const reports = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          return NextResponse.json({ reports, count: reports.length, provider: 'firebase' });
        }
      } catch (fbError) {
        console.error('Firebase bug report fetch error:', fbError);
      }
    }

    return NextResponse.json({
      reports: memoryBugReports,
      count: memoryBugReports.length,
      provider: 'memory',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, reports: [] }, { status: 500 });
  }
}

// 3. UPDATE STATUS (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing report id or status' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'bug_reports', id), {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase update error:', fbError);
      }
    }

    const found = memoryBugReports.find((r) => r.id === id);
    if (found) {
      found.status = status;
    }

    return NextResponse.json({
      success: true,
      id,
      status,
      message: 'סטטוס הטיפול עודכן בהצלחה',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. DELETE REPORT (DELETE)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'bug_reports', id));
      } catch (fbError) {
        console.error('Firebase delete error:', fbError);
      }
    }

    const idx = memoryBugReports.findIndex((r) => r.id === id);
    if (idx !== -1) {
      memoryBugReports.splice(idx, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'הדיווח נמחק בהצלחה',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
