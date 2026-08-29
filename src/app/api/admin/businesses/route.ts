import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'pro' | 'starter' | 'enterprise';
  createdAt: string;
}

const defaultBusinesses: BusinessItem[] = [
  {
    id: 'biz-dvir',
    name: 'המספרה של דביר',
    slug: 'dvir',
    ownerName: 'דביר',
    phone: '052-123-4567',
    city: 'אריאל & רחובות',
    branchesCount: 2,
    status: 'active',
    plan: 'pro',
    createdAt: '2025-01-01',
  },
];

// GET /api/admin/businesses
export async function GET() {
  try {
    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, 'businesses'));
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          return NextResponse.json({ businesses: list });
        }
      } catch (fbError) {
        console.error('Firebase businesses fetch error:', fbError);
      }
    }

    return NextResponse.json({ businesses: defaultBusinesses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, businesses: defaultBusinesses }, { status: 500 });
  }
}

// POST /api/admin/businesses (Add New Business)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, ownerName, phone, city, plan } = body;

    if (!name || !slug || !phone) {
      return NextResponse.json({ error: 'שם העסק, מזהה קישור (slug) וטלפון הם שדות חובה' }, { status: 400 });
    }

    const newBiz: BusinessItem = {
      id: `biz-${Date.now()}`,
      name,
      slug: slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, ''),
      ownerName: ownerName || name,
      phone,
      city: city || 'ישראל',
      branchesCount: 1,
      status: 'active',
      plan: plan || 'starter',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'businesses'), {
          ...newBiz,
          serverCreatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase business save error:', fbError);
      }
    }

    defaultBusinesses.unshift(newBiz);

    return NextResponse.json({
      success: true,
      message: 'העסק החדש הוקם בהצלחה במערכת',
      business: newBiz,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
