import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface BugReportPayload {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  category: string;
  message: string;
  businessName?: string;
  createdAt: string;
}

const memoryBugReports: BugReportPayload[] = [];

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

    const reportData: BugReportPayload = {
      id: `report-${Date.now()}`,
      fullName,
      phone,
      email: email || '',
      category: category || 'תקלה (באג)',
      message,
      businessName: businessName || 'המספרה של דביר',
      createdAt: new Date().toISOString(),
    };

    // 1. Firebase Firestore
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'bug_reports'), {
          ...reportData,
          serverCreatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase bug report error:', fbError);
      }
    }

    // 2. Memory store
    memoryBugReports.unshift(reportData);

    return NextResponse.json({
      success: true,
      message: 'הדיווח התקבל בהצלחה ויועבר לטיפול צוות הפיתוח',
      report: reportData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    reports: memoryBugReports,
    count: memoryBugReports.length,
  });
}
