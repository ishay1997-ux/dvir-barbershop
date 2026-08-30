import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface LeadPayload {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  industry: string;
  plan: 'starter' | 'pro' | 'team' | 'enterprise';
  city?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
  createdAt: string;
}

const memoryLeads: LeadPayload[] = [
  {
    id: 'lead-demo-1',
    businessName: 'סטודיו מיה לציפורניים',
    ownerName: 'מיה כהן',
    phone: '054-1234567',
    email: 'maya@nails.co.il',
    industry: 'קוסמטיקה & ציפורניים',
    plan: 'pro',
    city: 'ראשון לציון',
    notes: 'מעוניינת לחבר דומיין אישי ולהעלות גלריית תמונות',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'lead-demo-2',
    businessName: 'אביב מיזוג אוויר וחשמל',
    ownerName: 'אביב לוי',
    phone: '052-9876543',
    industry: 'אינסטלציה & שירותי בית',
    plan: 'starter',
    city: 'חולון',
    notes: 'רוצה לבדוק התאמה לחלונות הגעה של שעתיים',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// 1. CREATE LEAD (POST) - Public from marketing website
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, ownerName, phone, email, industry, plan, city, notes } = body;

    if (!businessName || !ownerName || !phone) {
      return NextResponse.json(
        { error: 'נא למלא את כל שדות החובה (שם העסק, שם איש הקשר וטלפון נייד)' },
        { status: 400 }
      );
    }

    const leadId = `lead-${Date.now()}`;
    const leadData: LeadPayload = {
      id: leadId,
      businessName,
      ownerName,
      phone,
      email: email || '',
      industry: industry || 'מספרה / טיפוח',
      plan: plan || 'starter',
      city: city || '',
      notes: notes || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'leads'), {
          ...leadData,
          serverCreatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase leads save error:', fbError);
      }
    }

    // Save in memory
    memoryLeads.unshift(leadData);

    return NextResponse.json(
      {
        success: true,
        message: 'הבקשה התקבלה בהצלחה! צוות המערכת ייצור עמך קשר תוך דקות.',
        lead: leadData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'שגיאה בקליטת הבקשה', details: error.message },
      { status: 500 }
    );
  }
}

// 2. GET ALL LEADS (GET) - For Super Admin
export async function GET() {
  try {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'leads'), orderBy('serverCreatedAt', 'desc'));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const list: LeadPayload[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              businessName: data.businessName || '',
              ownerName: data.ownerName || '',
              phone: data.phone || '',
              email: data.email || '',
              industry: data.industry || 'כללי',
              plan: data.plan || 'starter',
              city: data.city || '',
              notes: data.notes || '',
              status: data.status || 'new',
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          return NextResponse.json(list);
        }
      } catch (fbErr) {
        console.warn('Firestore leads fetch fallback:', fbErr);
      }
    }

    return NextResponse.json(memoryLeads);
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(memoryLeads);
  }
}

// 3. UPDATE LEAD STATUS (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'חסר מזהה פנייה או סטטוס' }, { status: 400 });
    }

    // Memory update
    const memIdx = memoryLeads.findIndex((l) => l.id === id);
    if (memIdx !== -1) {
      memoryLeads[memIdx].status = status;
    }

    // Firebase update
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'leads', id);
        await updateDoc(docRef, { status });
      } catch (fbErr) {
        console.error('Firebase lead update error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    return NextResponse.json({ error: 'שגיאה בעדכון הפנייה' }, { status: 500 });
  }
}

// 4. DELETE LEAD (DELETE)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'חסר מזהה פנייה' }, { status: 400 });
    }

    const memIdx = memoryLeads.findIndex((l) => l.id === id);
    if (memIdx !== -1) {
      memoryLeads.splice(memIdx, 1);
    }

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'leads', id));
      } catch (fbErr) {
        console.error('Firebase lead delete error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: 'שגיאה במחיקת הפנייה' }, { status: 500 });
  }
}
