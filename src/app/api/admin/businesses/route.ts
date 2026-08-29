import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, doc, query, where, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
    announcement: '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מראש!',
    themeColor: '#C9A84C',
    branchesCount: 2,
    status: 'active',
    plan: 'enterprise',
    createdAt: '2025-01-01',
    branches: [
      { name: 'סניף אריאל (אוניברסיטת אריאל)', address: 'קמפוס אוניברסיטת אריאל (מרכז הסטודנט)', wazeLink: 'https://waze.com/ul?q=Ariel%20University' },
      { name: 'סניף רחובות (מרכז העיר)', address: 'הרצל 180, רחובות (ליד מכון ויצמן)', wazeLink: 'https://waze.com/ul?q=Herzl%20180%20Rehovot' },
    ],
    services: [
      { name: 'תספורת גברים פרימיום', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20 },
      { name: 'חבילת VIP משולבת (תספורת + זקן)', price: 110, duration: 45 },
      { name: 'תספורת ילדים ונוער', price: 70, duration: 30 },
    ],
  },
  {
    id: 'biz-sharon',
    name: 'שרון עיצוב שיער',
    slug: 'sharon',
    ownerName: 'שרון',
    phone: '050-765-4321',
    city: 'תל אביב',
    slogan: 'עיצוב שיער נשים וגברים, החלקות אורגניות, בלונד וגוונים',
    announcement: '✨ 10% הנחה על כל טיפולי השיער וההחלקות בימי שלישי!',
    themeColor: '#DFCA85',
    branchesCount: 1,
    status: 'active',
    plan: 'pro',
    createdAt: '2025-02-01',
    branches: [
      { name: 'סניף תל אביב', address: 'דיזנגוף 120, תל אביב', wazeLink: 'https://waze.com/ul?q=Dizengoff%20120%20Tel%20Aviv' },
    ],
    services: [
      { name: 'תספורת נשים / גברים', price: 90, duration: 30 },
      { name: 'החלקה אורגנית פרימיום', price: 450, duration: 90 },
      { name: 'גוונים / בליאז׳', price: 350, duration: 60 },
      { name: 'פן ועיצוב תסרוקת', price: 70, duration: 25 },
    ],
  },
];

// GET /api/admin/businesses?slug=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug')?.toLowerCase().trim();

    // 1. Fetch single business by slug
    if (slug) {
      let firestoreBiz: BusinessItem | null = null;

      if (isFirebaseConfigured && db) {
        try {
          const q = query(collection(db, 'businesses'), where('slug', '==', slug));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            firestoreBiz = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BusinessItem;
          }
        } catch (fbError) {
          console.error('Firebase business slug fetch error:', fbError);
        }
      }

      const defaultMatch = defaultBusinesses.find((b) => b.slug === slug || (slug === 'thecut' && b.slug === 'dvir'));

      if (firestoreBiz && defaultMatch) {
        return NextResponse.json({
          business: {
            ...defaultMatch,
            ...firestoreBiz,
            branches: firestoreBiz.branches?.length ? firestoreBiz.branches : defaultMatch.branches,
            services: firestoreBiz.services?.length ? firestoreBiz.services : defaultMatch.services,
          },
        });
      }

      if (firestoreBiz) {
        return NextResponse.json({ business: firestoreBiz });
      }

      if (defaultMatch) {
        return NextResponse.json({ business: defaultMatch });
      }

      if (slug === 'dvir' || slug === 'thecut') {
        return NextResponse.json({ business: defaultBusinesses[0] });
      }

      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // 2. Fetch ALL businesses for Super Admin Dashboard
    let firestoreList: BusinessItem[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, 'businesses'));
        if (!snapshot.empty) {
          firestoreList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BusinessItem));
        }
      } catch (fbError) {
        console.error('Firebase businesses fetch error:', fbError);
      }
    }

    // Build unified list: guaranteed to include Dvir (flagship) and default businesses
    const mergedMap = new Map<string, BusinessItem>();

    // Add default businesses first
    for (const defBiz of defaultBusinesses) {
      mergedMap.set(defBiz.slug, defBiz);
    }

    // Overlay firestore businesses (keeping custom edits and custom businesses)
    for (const fBiz of firestoreList) {
      const existing = mergedMap.get(fBiz.slug);
      if (existing) {
        mergedMap.set(fBiz.slug, {
          ...existing,
          ...fBiz,
          branches: fBiz.branches?.length ? fBiz.branches : existing.branches,
          services: fBiz.services?.length ? fBiz.services : existing.services,
        });
      } else {
        mergedMap.set(fBiz.slug || fBiz.id, fBiz);
      }
    }

    const allBusinesses = Array.from(mergedMap.values());

    // Sort to always place Dvir at the top (index 0)
    allBusinesses.sort((a, b) => {
      if (a.slug === 'dvir') return -1;
      if (b.slug === 'dvir') return 1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return NextResponse.json({ businesses: allBusinesses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, businesses: defaultBusinesses }, { status: 500 });
  }
}

// POST /api/admin/businesses (Add New Business with Archetype & Rich Tailoring)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      ownerName,
      phone,
      city,
      plan,
      slogan,
      announcement,
      themeColor,
      archetypeId,
      instagramHandle,
      branches,
      services,
      testimonials,
      faqs,
    } = body;

    if (!name || !slug || !phone) {
      return NextResponse.json({ error: 'שם העסק, מזהה קישור (slug) וטלפון הם שדות חובה' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
    const docId = `biz-${cleanSlug}`;

    const { generateTailoredBusinessConfig } = await import('@/lib/archetypes');

    const generated = generateTailoredBusinessConfig({
      name,
      slug: cleanSlug,
      ownerName: ownerName || name,
      phone,
      city: city || 'ישראל',
      archetypeId: archetypeId || 'mens-barbershop',
      themeColor: themeColor || '#C9A84C',
      plan: plan || 'pro',
      instagramHandle,
      branches,
      services,
    });

    const newBiz: BusinessItem = {
      ...generated,
      id: docId,
      slogan: slogan || generated.slogan,
      announcement: announcement || generated.announcement,
      themeColor: themeColor || generated.themeColor,
      createdAt: new Date().toISOString().split('T')[0],
      ...(testimonials && testimonials.length > 0 ? { testimonials } : {}),
      ...(faqs && faqs.length > 0 ? { faqs } : {}),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'businesses', docId), {
          ...newBiz,
          serverCreatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (fbError) {
        console.error('Firebase business save error:', fbError);
      }
    }

    const existingIdx = defaultBusinesses.findIndex((b) => b.slug === cleanSlug);
    if (existingIdx !== -1) {
      defaultBusinesses[existingIdx] = newBiz;
    } else {
      defaultBusinesses.unshift(newBiz);
    }

    return NextResponse.json({
      success: true,
      message: 'העסק החדש הוקם בהצלחה במערכת עם התאמה אישית מלאה',
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

    const targetSlug = slug?.toLowerCase().trim();
    const targetDocId = id || (targetSlug ? `biz-${targetSlug}` : `biz-${Date.now()}`);

    if (isFirebaseConfigured && db) {
      try {
        if (id) {
          await setDoc(
            doc(db, 'businesses', id),
            {
              id,
              ...(targetSlug ? { slug: targetSlug } : {}),
              ...updates,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else if (targetSlug) {
          const q = query(collection(db, 'businesses'), where('slug', '==', targetSlug));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const existingId = snapshot.docs[0].id;
            await setDoc(
              doc(db, 'businesses', existingId),
              {
                id: existingId,
                slug: targetSlug,
                ...updates,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } else {
            await setDoc(
              doc(db, 'businesses', targetDocId),
              {
                id: targetDocId,
                slug: targetSlug,
                ...updates,
                serverCreatedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
      } catch (fbError) {
        console.error('Firebase business update error:', fbError);
      }
    }

    // Update in-memory store
    const found = defaultBusinesses.find((b) => (targetSlug && b.slug === targetSlug) || (id && b.id === id));
    if (found) {
      Object.assign(found, updates);
      if (updates.branches) {
        found.branchesCount = updates.branches.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'הגדרות העסק עודכנו בהצלחה',
      business: found || { id: targetDocId, slug: targetSlug, ...updates },
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

    if (slug === 'dvir' || id === 'biz-dvir') {
      return NextResponse.json({ error: 'לא ניתן למחוק את עסק הדגל של דביר' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        if (id) {
          await deleteDoc(doc(db, 'businesses', id));
        }
        if (slug) {
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
    if (idx !== -1 && defaultBusinesses[idx].slug !== 'dvir') {
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

