import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, query, where, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  slogan?: string;
  announcement?: string;
  themeColor?: string;
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'pro' | 'starter' | 'enterprise';
  createdAt: string;
  services?: Array<{ name: string; price: number; duration: number }>;
  branches?: Array<{ name: string; address: string; wazeLink?: string }>;
}

const defaultBusinesses: BusinessItem[] = [
  {
    id: 'biz-dvir',
    name: 'המספרה של דביר',
    slug: 'dvir',
    ownerName: 'דביר',
    phone: '052-123-4567',
    city: 'אריאל & רחובות',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר בישראל',
    announcement: '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7',
    themeColor: '#C9A84C',
    branchesCount: 2,
    status: 'active',
    plan: 'pro',
    createdAt: '2025-01-01',
    branches: [
      { name: 'סניף אריאל', address: 'מתחם האוניברסיטה, אריאל' },
      { name: 'סניף רחובות', address: 'רחוב הרצל 45, רחובות' },
    ],
    services: [
      { name: 'תספורת גברים / פייד', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן', price: 40, duration: 15 },
      { name: 'תספורת + זקן VIP', price: 110, duration: 45 },
      { name: 'טיפול פנים מפנק', price: 60, duration: 25 },
    ],
  },
];

// GET /api/admin/businesses?slug=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug')?.toLowerCase().trim();

    if (slug) {
      if (isFirebaseConfigured && db) {
        try {
          const q = query(collection(db, 'businesses'), where('slug', '==', slug));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const bizData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            return NextResponse.json({ business: bizData });
          }
        } catch (fbError) {
          console.error('Firebase business slug fetch error:', fbError);
        }
      }

      const match = defaultBusinesses.find((b) => b.slug === slug);
      if (match) {
        return NextResponse.json({ business: match });
      }

      if (slug === 'dvir' || slug === 'thecut') {
        return NextResponse.json({ business: defaultBusinesses[0] });
      }

      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

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
    const { name, slug, ownerName, phone, city, plan, slogan, announcement, themeColor, branches, services } = body;

    if (!name || !slug || !phone) {
      return NextResponse.json({ error: 'שם העסק, מזהה קישור (slug) וטלפון הם שדות חובה' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');

    const newBiz: BusinessItem = {
      id: `biz-${Date.now()}`,
      name,
      slug: cleanSlug,
      ownerName: ownerName || name,
      phone,
      city: city || 'ישראל',
      slogan: slogan || 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר',
      announcement: announcement || '🌟 קביעת תורים מהירה אונליין 24/7',
      themeColor: themeColor || '#C9A84C',
      branchesCount: branches?.length || 1,
      status: 'active',
      plan: plan || 'starter',
      createdAt: new Date().toISOString().split('T')[0],
      branches: branches || [{ name: `סניף ראשי ${city || ''}`, address: city || 'כתובת העסק' }],
      services: services || [
        { name: 'תספורת גברים / פייד', price: 80, duration: 30 },
        { name: 'עיצוב ופיסול זקן', price: 40, duration: 15 },
        { name: 'תספורת + זקן VIP', price: 110, duration: 45 },
      ],
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

// PATCH /api/admin/businesses (Update Business Customization & Settings)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, id, ...updates } = body;

    if (!slug && !id) {
      return NextResponse.json({ error: 'Missing business slug or id' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        if (id) {
          await updateDoc(doc(db, 'businesses', id), {
            ...updates,
            updatedAt: serverTimestamp(),
          });
        } else if (slug) {
          const q = query(collection(db, 'businesses'), where('slug', '==', slug));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            await updateDoc(doc(db, 'businesses', snapshot.docs[0].id), {
              ...updates,
              updatedAt: serverTimestamp(),
            });
          }
        }
      } catch (fbError) {
        console.error('Firebase business update error:', fbError);
      }
    }

    // Update memory store
    const found = defaultBusinesses.find((b) => (slug && b.slug === slug) || (id && b.id === id));
    if (found) {
      Object.assign(found, updates);
      if (updates.branches) {
        found.branchesCount = updates.branches.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'הגדרות העסק עודכנו בהצלחה',
      business: found || updates,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/businesses?id=...&slug=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug')?.toLowerCase().trim();

    if (!id && !slug) {
      return NextResponse.json({ error: 'Missing id or slug' }, { status: 400 });
    }

    if (slug === 'dvir') {
      return NextResponse.json({ error: 'לא ניתן למחוק את עסק הדגל של דביר' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        if (id) {
          await deleteDoc(doc(db, 'businesses', id));
        } else if (slug) {
          const q = query(collection(db, 'businesses'), where('slug', '==', slug));
          const snapshot = await getDocs(q);
          const deletePromises = snapshot.docs.map((d) => deleteDoc(doc(db!, 'businesses', d.id)));
          await Promise.all(deletePromises);
        }
      } catch (fbError) {
        console.error('Firebase business delete error:', fbError);
      }
    }

    const idx = defaultBusinesses.findIndex((b) => (id && b.id === id) || (slug && b.slug === slug));
    if (idx !== -1) {
      defaultBusinesses.splice(idx, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'המספרה נמחקה בהצלחה מהמערכת',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
