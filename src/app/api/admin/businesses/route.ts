import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { requireRole } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

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
  instagramHandle?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  wazeUrl?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
  branchesCount: number;
  status: 'active' | 'pending' | 'suspended';
  plan: 'starter' | 'pro' | 'team' | 'enterprise';
  createdAt: string;
  services?: Array<{ name: string; price: number; duration: number }>;
  branches?: Array<{ name: string; address: string; wazeLink?: string }>;
}

const memoryBusinesses: BusinessItem[] = [];

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val).trim().toLowerCase();
  } catch {
    return val.trim().toLowerCase();
  }
}

// GET /api/admin/businesses?slug=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSlugParam = searchParams.get('slug');

    // 1. Fetch single business by slug
    if (rawSlugParam) {
      const decodedSlug = safeDecode(rawSlugParam);
      const rawSlug = rawSlugParam.trim().toLowerCase();

      let firestoreBiz: BusinessItem | null = null;

      if (isFirebaseConfigured && db) {
        try {
          // Check by direct doc ID
          const docId1 = `biz-${decodedSlug}`;
          const snap1 = await getDoc(doc(db, 'businesses', docId1));
          if (snap1.exists()) {
            firestoreBiz = { id: snap1.id, ...snap1.data() } as BusinessItem;
          }

          // Check by slug field queries
          if (!firestoreBiz) {
            const qDecoded = query(collection(db, 'businesses'), where('slug', '==', decodedSlug));
            const snapDecoded = await getDocs(qDecoded);
            if (!snapDecoded.empty) {
              firestoreBiz = {
                id: snapDecoded.docs[0].id,
                ...snapDecoded.docs[0].data(),
              } as BusinessItem;
            }
          }

          if (!firestoreBiz && rawSlug !== decodedSlug) {
            const qRaw = query(collection(db, 'businesses'), where('slug', '==', rawSlug));
            const snapRaw = await getDocs(qRaw);
            if (!snapRaw.empty) {
              firestoreBiz = {
                id: snapRaw.docs[0].id,
                ...snapRaw.docs[0].data(),
              } as BusinessItem;
            }
          }
        } catch (fbError) {
          console.error('Firebase business slug fetch error:', fbError);
        }
      }

      if (firestoreBiz) {
        return NextResponse.json({ business: firestoreBiz });
      }

      const memMatch = memoryBusinesses.find(
        (b) =>
          safeDecode(b.slug) === decodedSlug ||
          b.slug === rawSlug ||
          b.id === `biz-${decodedSlug}`
      );
      if (memMatch) {
        return NextResponse.json({ business: memMatch });
      }

      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // 2. Fetch ALL registered businesses for Super Admin Dashboard
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const firestoreList: BusinessItem[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await getDocs(collection(db, 'businesses'));
        if (!snapshot.empty) {
          snapshot.forEach((d) => {
            const data = d.data();
            firestoreList.push({
              id: d.id,
              ...data,
            } as BusinessItem);
          });
        }
      } catch (fbError) {
        console.error('Firebase businesses fetch error:', fbError);
      }
    }

    // Merge with memory businesses
    const mergedMap = new Map<string, BusinessItem>();

    for (const mem of memoryBusinesses) {
      mergedMap.set(mem.id || mem.slug, mem);
    }

    for (const fBiz of firestoreList) {
      mergedMap.set(fBiz.id || fBiz.slug, fBiz);
    }

    const allBusinesses = Array.from(mergedMap.values());
    allBusinesses.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    return NextResponse.json({ businesses: allBusinesses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, businesses: memoryBusinesses }, { status: 500 });
  }
}

// POST /api/admin/businesses (Add New Business)
export async function POST(request: Request) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

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
      instagramHandle,
      branches,
      services,
      testimonials,
      faqs,
    } = body;

    if (!name || !slug || !phone) {
      return NextResponse.json(
        { error: 'שם העסק, מזהה קישור (slug) וטלפון הם שדות חובה' },
        { status: 400 }
      );
    }

    const cleanSlug = safeDecode(slug).replace(/[^a-zA-Z0-9\u0590-\u05FF-_]/g, '-');
    if (!cleanSlug || cleanSlug.length < 2) {
      return NextResponse.json(
        { error: 'מזהה הקישור (slug) חייב להכיל לפחות 2 תווים' },
        { status: 400 }
      );
    }

    const docId = `biz-${cleanSlug}`;

    const newBusiness: BusinessItem = {
      id: docId,
      name: String(name).trim(),
      slug: cleanSlug,
      ownerName: String(ownerName || name).trim(),
      phone: String(phone).trim(),
      city: city || 'ישראל',
      plan: plan || 'starter',
      slogan: slogan || `${name} · שירות ואיכות ללא פשרות`,
      announcement: announcement || `🌟 ברוכים הבאים ל${name}! שריינו תור אונליין בקלות 24/7`,
      themeColor: themeColor || '#C9A84C',
      instagramHandle: instagramHandle || '',
      branchesCount: Array.isArray(branches) && branches.length > 0 ? branches.length : 1,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      branches: Array.isArray(branches) && branches.length > 0 ? branches : [{ name: 'סניף מרכזי', address: city || 'מרכז העיר' }],
      services: Array.isArray(services) && services.length > 0 ? services : [{ name: 'שירות פרימיום', price: 100, duration: 30 }],
    };

    // Save in Firestore
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'businesses', docId), {
          ...newBusiness,
          serverCreatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (fbErr) {
        console.error('Firebase save business error:', fbErr);
      }
    }

    // Save in memory
    const existingIdx = memoryBusinesses.findIndex((b) => b.slug === cleanSlug || b.id === docId);
    if (existingIdx !== -1) {
      memoryBusinesses[existingIdx] = newBusiness;
    } else {
      memoryBusinesses.unshift(newBusiness);
    }

    return NextResponse.json({
      success: true,
      message: 'העסק הוקם בהצלחה!',
      business: newBusiness,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/businesses (Update Business)
export async function PATCH(request: Request) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { id, slug, ...updates } = body;

    const targetSlug = slug ? safeDecode(slug) : '';
    const targetDocId = id || (targetSlug ? `biz-${targetSlug}` : `biz-${Date.now()}`);

    const sanitizedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        sanitizedUpdates[key] = value;
      }
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(
          doc(db, 'businesses', targetDocId),
          {
            id: targetDocId,
            ...(targetSlug ? { slug: targetSlug } : {}),
            ...sanitizedUpdates,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (fbError) {
        console.error('Firebase business update error:', fbError);
      }
    }

    // Update in memory
    const found = memoryBusinesses.find(
      (b) => (targetSlug && b.slug === targetSlug) || (id && b.id === id)
    );
    if (found) {
      Object.assign(found, sanitizedUpdates);
    }

    return NextResponse.json({
      success: true,
      message: 'הגדרות העסק עודכנו בהצלחה',
      business: found || { id: targetDocId, slug: targetSlug, ...sanitizedUpdates },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/businesses?id=...&slug=...
export async function DELETE(request: Request) {
  try {
    const authResult = await requireRole(request, ['super_admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();
    const rawSlug = searchParams.get('slug')?.trim();
    const decodedSlug = rawSlug ? safeDecode(rawSlug) : '';

    if (!id && !decodedSlug && !rawSlug) {
      return NextResponse.json({ error: 'Missing id or slug parameter' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        const deleteDocIds = new Set<string>();

        if (id) {
          deleteDocIds.add(id);
        }
        if (decodedSlug) {
          deleteDocIds.add(`biz-${decodedSlug}`);
        }
        if (rawSlug) {
          deleteDocIds.add(`biz-${rawSlug}`);
        }

        // Query by decoded slug
        if (decodedSlug) {
          const qDecoded = query(collection(db, 'businesses'), where('slug', '==', decodedSlug));
          const snapDecoded = await getDocs(qDecoded);
          snapDecoded.forEach((d) => deleteDocIds.add(d.id));
        }

        // Query by raw slug
        if (rawSlug && rawSlug !== decodedSlug) {
          const qRaw = query(collection(db, 'businesses'), where('slug', '==', rawSlug));
          const snapRaw = await getDocs(qRaw);
          snapRaw.forEach((d) => deleteDocIds.add(d.id));
        }

        // Execute deletions
        const deletePromises = Array.from(deleteDocIds).map((docId) =>
          deleteDoc(doc(db!, 'businesses', docId))
        );
        await Promise.all(deletePromises);
      } catch (fbError) {
        console.error('Firebase business delete error:', fbError);
      }
    }

    // Clean from memory store
    const filterFn = (b: BusinessItem) => {
      if (id && (b.id === id || b.id === `biz-${id}`)) return false;
      if (decodedSlug && (safeDecode(b.slug) === decodedSlug || b.id === `biz-${decodedSlug}`))
        return false;
      if (rawSlug && (b.slug === rawSlug || b.id === `biz-${rawSlug}`)) return false;
      return true;
    };

    const initialLen = memoryBusinesses.length;
    for (let i = memoryBusinesses.length - 1; i >= 0; i--) {
      if (!filterFn(memoryBusinesses[i])) {
        memoryBusinesses.splice(i, 1);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'העסק נמחק בהצלחה מהמערכת',
    });
  } catch (error: any) {
    console.error('DELETE business error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
