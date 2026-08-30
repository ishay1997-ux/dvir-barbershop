import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

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

// 1. CREATE LEAD / REGISTER WORKSPACE (POST) - Public from marketing website
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

    // 🔒 1 WORKSPACE PER USER CHECK: Verify if this email/phone already has an active business
    if (isFirebaseConfigured && db) {
      try {
        if (email && email.includes('@')) {
          const qEmail = query(
            collection(db, 'businesses'),
            where('email', '==', email.trim().toLowerCase())
          );
          const snapEmail = await getDocs(qEmail);
          if (!snapEmail.empty) {
            const existingBiz = snapEmail.docs[0].data() as any;
            return NextResponse.json({
              success: true,
              alreadyExists: true,
              message: `כבר קיים עסק רשום לחשבון זה (${existingBiz.name}). העברנו אותך למערכת הניהול.`,
              slug: existingBiz.slug,
              businessName: existingBiz.name,
              workspaceUrl: `/admin?slug=${existingBiz.slug}`,
              bookingUrl: `/${existingBiz.slug}`,
            });
          }
        }

        if (phone) {
          const qPhone = query(collection(db, 'businesses'), where('phone', '==', phone.trim()));
          const snapPhone = await getDocs(qPhone);
          if (!snapPhone.empty) {
            const existingBiz = snapPhone.docs[0].data() as any;
            return NextResponse.json({
              success: true,
              alreadyExists: true,
              message: `כבר קיים עסק רשום למספר טלפון זה (${existingBiz.name}).`,
              slug: existingBiz.slug,
              businessName: existingBiz.name,
              workspaceUrl: `/admin?slug=${existingBiz.slug}`,
              bookingUrl: `/${existingBiz.slug}`,
            });
          }
        }
      } catch (checkErr) {
        console.warn('Check existing business error:', checkErr);
      }
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

    // Generate a unique, url-safe slug
    const cleanName = businessName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const slug = cleanName.length > 2 ? `${cleanName}-${randomSuffix}` : `biz-${Date.now().toString().slice(-6)}`;

    // Industry Theme Color & Defaults
    let themeColor = '#C9A84C';
    let defaultServices = [
      { name: 'תספורת גברים פרימיום', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20 },
    ];

    if (industry?.includes('קוסמטיקה') || industry?.includes('ציפורניים')) {
      themeColor = '#EC4899';
      defaultServices = [
        { name: 'מבנה אנטומי & לק ג׳ל פרימיום', price: 160, duration: 60 },
        { name: 'הארכת ציפורניים בפוליג׳ל', price: 250, duration: 90 },
        { name: 'הרמת ריסים & בוטוקס', price: 220, duration: 50 },
      ];
    } else if (industry?.includes('ספא') || industry?.includes('מסאז') || industry?.includes('עיסוי')) {
      themeColor = '#14B8A6';
      defaultServices = [
        { name: 'עיסוי שוודי קלאסי משחרר', price: 280, duration: 60 },
        { name: 'עיסוי רקמות עמוק לספורטאים', price: 320, duration: 60 },
        { name: 'טיפול אבנים חמות הוליסטי', price: 360, duration: 75 },
      ];
    } else if (industry?.includes('כושר') || industry?.includes('מאמן')) {
      themeColor = '#10B981';
      defaultServices = [
        { name: 'אימון אישי 1-על-1 VIP', price: 200, duration: 60 },
        { name: 'כרטיסיית 10 אימונים אישיים', price: 1800, duration: 60 },
      ];
    } else if (industry?.includes('קליניק') || industry?.includes('אסתטיק') || industry?.includes('רופא')) {
      themeColor = '#0EA5E9';
      defaultServices = [
        { name: 'פגישת אבחון ותכנון טיפול', price: 200, duration: 30 },
        { name: 'הזרקת בוטוקס רפואי מדויק', price: 750, duration: 30 },
        { name: 'פיסול שפתיים חומצה היאלורונית', price: 1400, duration: 45 },
      ];
    } else if (industry?.includes('אינסטלציה') || industry?.includes('טכנאי') || industry?.includes('מיזוג') || industry?.includes('חשמל')) {
      themeColor = '#F59E0B';
      defaultServices = [
        { name: 'ביקור ובדיקת תקלה מקיפה', price: 250, duration: 45 },
        { name: 'מילוי גז ותיקון דליפות', price: 450, duration: 60 },
      ];
    }

    const newBusinessObj = {
      id: `biz-${slug}`,
      slug,
      name: businessName,
      ownerName,
      phone,
      email: email || '',
      city: city || 'ישראל',
      industry: industry || 'כללי',
      plan: plan || 'starter',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString(),
      themeColor,
      slogan: `${businessName} · שירות ואיכות ללא פשרות`,
      announcement: `🌟 ברוכים הבאים ל${businessName}! שריינו תור אונליין בקלות 24/7`,
      branchesCount: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      branches: [
        {
          name: 'סניף ראשי',
          address: city ? `מרכז העיר, ${city}` : 'מרכז העיר',
          wazeLink: 'https://waze.com',
        },
      ],
      services: defaultServices,
    };

    // Save Lead & Provision Business in Firestore
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'leads'), {
          ...leadData,
          provisionedSlug: slug,
          serverCreatedAt: serverTimestamp(),
        });

        // Create business document in 'businesses'
        await addDoc(collection(db, 'businesses'), {
          ...newBusinessObj,
          serverCreatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase leads/business save error:', fbError);
      }
    }

    // Save in memory
    memoryLeads.unshift(leadData);

    return NextResponse.json(
      {
        success: true,
        message: 'הבקשה התקבלה והעסק הוקם בהצלחה!',
        lead: leadData,
        slug,
        workspaceUrl: `/admin?slug=${slug}`,
        bookingUrl: `/${slug}`,
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
