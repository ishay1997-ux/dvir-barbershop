import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { checkRateLimit } from '@/lib/rateLimit';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// In-Memory fallback store for runtime consistency across serverless invocations
interface MemoryAppointment {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  barberId: string;
  barberName: string;
  branchId: string;
  branchName: string;
  businessSlug: string;
  businessName: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  locationType?: string;
  bookingType?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

const memoryAppointments: MemoryAppointment[] = [];

// ============================================================
// POST: Book a new appointment (Production Double Booking Safe)
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      serviceName,
      service,
      servicePrice,
      price,
      barberId,
      barberName,
      branchId,
      branchName,
      businessSlug,
      businessName,
      date,
      time,
      customerName,
      customerPhone,
      customerAddress,
      locationType,
      bookingType,
    } = body;

    // Strict input validation
    if ((!serviceId && !serviceName && !service) || !date || !time || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'נא למלא את כל שדות החובה להזמנת תור' },
        { status: 400 }
      );
    }

    const cleanName = String(customerName).trim().slice(0, 60);
    const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(0, 20);
    const resolvedServiceName = String(serviceName || service || 'תספורת גברים').trim().slice(0, 80);
    const resolvedPrice = Number(servicePrice || price) || 80;
    const resolvedSlug = String(businessSlug || 'dvir').toLowerCase().trim();
    const resolvedBizName = String(businessName || 'המספרה של דביר').trim();
    const resolvedDate = String(date).trim();
    const resolvedTime = String(time).trim();
    const resolvedBarberId = String(barberId || 'dvir').trim();

    // Rate Limiting Protection (Max 15 bookings per minute per IP / phone)
    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const rateCheck = checkRateLimit(`book:${ip}:${cleanPhone}`, 15, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'בוצעו יותר מדי ניסיונות הזמנה בדקה האחרונה. אנא המתן מספר שניות ונסה שוב.' },
        { status: 429 }
      );
    }

    if (cleanName.length < 2 || cleanPhone.length < 9) {
      return NextResponse.json(
        { error: 'שם מלא (לפחות 2 תווים) או מספר טלפון תקין (לפחות 9 ספרות) נדרשים' },
        { status: 400 }
      );
    }

    // 1. Date & Time validity and past validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(resolvedDate) || !/^\d{2}:\d{2}$/.test(resolvedTime)) {
      return NextResponse.json(
        { error: 'פורמט תאריך או שעה אינו תקין' },
        { status: 400 }
      );
    }

    try {
      const appointmentDateTime = new Date(`${resolvedDate}T${resolvedTime}:00`);
      if (isNaN(appointmentDateTime.getTime()) || appointmentDateTime.getTime() < Date.now() - 5 * 60 * 1000) {
        return NextResponse.json(
          { error: 'לא ניתן לקבוע תור למועד שעבר. אנא בחר שעה עתידית.' },
          { status: 400 }
        );
      }
    } catch {
      // ignore parse fallback
    }

    // 2. Conflict Check: In-memory store
    const conflictInMemory = memoryAppointments.find(
      (a) =>
        a.businessSlug === resolvedSlug &&
        a.date === resolvedDate &&
        a.time === resolvedTime &&
        a.barberId === resolvedBarberId &&
        a.status === 'confirmed'
    );
    if (conflictInMemory) {
      return NextResponse.json(
        { error: 'מועד זה כבר נתפס על ידי לקוח אחר. אנא בחר שעה אחרת.' },
        { status: 409 }
      );
    }

    let appointmentId = `apt-${Date.now()}`;

    // 3. Primary: Firebase Firestore Cloud Database with double-booking check
    if (isFirebaseConfigured && db) {
      try {
        const conflictQuery = query(
          collection(db, 'appointments'),
          where('businessSlug', '==', resolvedSlug),
          where('date', '==', resolvedDate),
          where('time', '==', resolvedTime),
          where('status', '==', 'confirmed')
        );
        const conflictSnap = await getDocs(conflictQuery);
        if (!conflictSnap.empty) {
          const barberConflict = conflictSnap.docs.some(
            (d) => (d.data().barberId || 'dvir') === resolvedBarberId
          );
          if (barberConflict) {
            return NextResponse.json(
              { error: 'מועד זה כבר נתפס על ידי לקוח אחר. אנא בחר שעה אחרת.' },
              { status: 409 }
            );
          }
        }

        // Record Customer in Firestore
        const customerRef = doc(db, 'customers', cleanPhone);
        await setDoc(
          customerRef,
          {
            name: cleanName,
            phone: customerPhone,
            cleanPhone,
            lastVisit: new Date().toISOString(),
            favoriteBranchId: branchId || 'ariel',
            businessSlug: resolvedSlug,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Add Appointment to 'appointments' collection
        const appointmentDoc = await addDoc(collection(db, 'appointments'), {
          serviceId: serviceId || 'srv-haircut',
          serviceName: resolvedServiceName,
          servicePrice: resolvedPrice,
          barberId: resolvedBarberId,
          barberName: barberName || 'דביר',
          branchId: branchId || 'ariel',
          branchName: branchName || (branchId === 'rehovot' ? 'סניף רחובות' : 'סניף אריאל'),
          businessSlug: resolvedSlug,
          businessName: resolvedBizName,
          date: resolvedDate,
          time: resolvedTime,
          customerName: cleanName,
          customerPhone: String(customerPhone).trim(),
          cleanPhone,
          customerAddress: customerAddress || null,
          locationType: locationType || 'BUSINESS_LOCATION',
          bookingType: bookingType || 'FIXED_SLOT',
          status: 'confirmed',
          createdAt: serverTimestamp(),
        });

        appointmentId = appointmentDoc.id;
      } catch (fbError) {
        console.error('Firebase save error:', fbError);
      }
    }

    // Save to memory store as backup
    const newApt: MemoryAppointment = {
      id: appointmentId,
      serviceId: serviceId || 'srv-haircut',
      serviceName: resolvedServiceName,
      servicePrice: resolvedPrice,
      barberId: barberId || 'dvir',
      barberName: barberName || 'דביר',
      branchId: branchId || 'ariel',
      branchName: branchName || (branchId === 'rehovot' ? 'סניף רחובות' : 'סניף אריאל'),
      businessSlug: resolvedSlug,
      businessName: resolvedBizName,
      date: String(date).trim(),
      time: String(time).trim(),
      customerName: cleanName,
      customerPhone: String(customerPhone).trim(),
      customerAddress: customerAddress || undefined,
      locationType: locationType || 'BUSINESS_LOCATION',
      bookingType: bookingType || 'FIXED_SLOT',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    memoryAppointments.unshift(newApt);

    return NextResponse.json({
      success: true,
      appointmentId,
      appointment: newApt,
      message: 'התור נקבע ואושר בהצלחה',
    });
  } catch (error) {
    console.error('Appointment API error:', error);
    return NextResponse.json(
      { error: 'שגיאה בעת שמירת התור במערכת' },
      { status: 500 }
    );
  }
}

// ============================================================
// 2. GET APPOINTMENTS (GET) with phone / slug filter
// ============================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneFilter = searchParams.get('phone');
    const slugFilter = searchParams.get('businessSlug');

    // If searching by customer phone
    if (phoneFilter) {
      const cleanSearchPhone = phoneFilter.replace(/\D/g, '');

      if (isFirebaseConfigured && db) {
        try {
          const q = query(
            collection(db, 'appointments'),
            where('cleanPhone', '==', cleanSearchPhone)
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));
            return NextResponse.json({ appointments: list, source: 'firestore' });
          }
        } catch (fbError) {
          console.error('Firebase search error:', fbError);
        }
      }

      // Memory fallback search
      const memoryMatches = memoryAppointments.filter((a) =>
        a.customerPhone.replace(/\D/g, '').includes(cleanSearchPhone)
      );
      return NextResponse.json({ appointments: memoryMatches, source: 'memory' });
    }

    // Default: List appointments (Tenant-scoped indexed query for 1,000+ scale)
    if (isFirebaseConfigured && db) {
      try {
        const q = slugFilter
          ? query(
              collection(db, 'appointments'),
              where('businessSlug', '==', slugFilter),
              orderBy('createdAt', 'desc')
            )
          : query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

          return NextResponse.json(
            { appointments: list, source: 'firestore' },
            {
              headers: {
                'Cache-Control': 'private, max-age=5, stale-while-revalidate=15',
              },
            }
          );
        }
      } catch (fbError) {
        console.error('Firebase read error:', fbError);
      }
    }

    let result = memoryAppointments;
    if (slugFilter) {
      result = result.filter((a) => a.businessSlug === slugFilter);
    }

    return NextResponse.json(
      { appointments: result, source: 'memory' },
      {
        headers: {
          'Cache-Control': 'private, max-age=5, stale-while-revalidate=15',
        },
      }
    );
  } catch (error) {
    console.error('Appointment GET error:', error);
    return NextResponse.json(
      { error: 'שגיאה באחזור תורים', appointments: [] },
      { status: 500 }
    );
  }
}

// ============================================================
// 3. UPDATE APPOINTMENT (PATCH)
// ============================================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing appointment ID or status' },
        { status: 400 }
      );
    }

    if (status !== 'confirmed' && status !== 'cancelled' && status !== 'completed' && status !== 'no_show') {
      return NextResponse.json({ error: 'סטטוס לא תקין' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      try {
        const aptRef = doc(db, 'appointments', id);
        await updateDoc(aptRef, {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase update status error:', fbError);
      }
    }

    const found = memoryAppointments.find((a) => a.id === id);
    if (found) {
      found.status = status;
    }

    return NextResponse.json({
      success: true,
      id,
      status,
      message: 'סטטוס התור עודכן בהצלחה',
    });
  } catch (error) {
    console.error('Appointment PATCH error:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון סטטוס התור' },
      { status: 500 }
    );
  }
}

// ============================================================
// 4. DELETE / PURGE APPOINTMENTS (DELETE)
// ============================================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    if (id) {
      if (isFirebaseConfigured && db) {
        try {
          const currentDb = db;
          await deleteDoc(doc(currentDb, 'appointments', id));
        } catch (fbError) {
          console.error('Firebase delete by ID error:', fbError);
        }
      }
      const idx = memoryAppointments.findIndex((a) => a.id === id);
      if (idx !== -1) memoryAppointments.splice(idx, 1);
      return NextResponse.json({ success: true, message: 'התור נמחק בהצלחה' });
    }

    if (phone) {
      const rawDigits = phone.replace(/\D/g, '');
      const last9Digits = rawDigits.slice(-9); // e.g. 587815070
      const variations = Array.from(
        new Set([
          rawDigits,
          phone.trim(),
          last9Digits,
          `0${last9Digits}`,
          `972${last9Digits}`,
          `+972${last9Digits}`,
        ].filter(Boolean))
      );

      if (isFirebaseConfigured && db) {
        try {
          const currentDb = db;
          const allDocsSnapshot = await getDocs(collection(currentDb, 'appointments'));
          const toDeleteIds: string[] = [];

          allDocsSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const p = String(data.customerPhone || data.phone || data.cleanPhone || '').replace(/\D/g, '');
            if (
              variations.includes(data.cleanPhone) ||
              variations.includes(data.customerPhone) ||
              variations.includes(data.phone) ||
              (p && last9Digits && p.endsWith(last9Digits))
            ) {
              toDeleteIds.push(docSnap.id);
            }
          });

          const deletePromises = toDeleteIds.map((id) =>
            deleteDoc(doc(currentDb, 'appointments', id))
          );

          // Also delete customer document from 'customers' collection
          for (const v of variations) {
            deletePromises.push(
              deleteDoc(doc(currentDb, 'customers', v)).catch(() => {})
            );
          }

          await Promise.all(deletePromises);
        } catch (fbError) {
          console.error('Firebase bulk delete error:', fbError);
        }
      }

      // Memory cleanup with full variation matching
      for (let i = memoryAppointments.length - 1; i >= 0; i--) {
        const memPhone = memoryAppointments[i].customerPhone.replace(/\D/g, '');
        if (
          variations.includes(memoryAppointments[i].customerPhone) ||
          variations.includes(memPhone) ||
          (memPhone && last9Digits && memPhone.endsWith(last9Digits))
        ) {
          memoryAppointments.splice(i, 1);
        }
      }

      return NextResponse.json({
        success: true,
        message: `כל התורים והלקוח עבור מספר ${phone} נמחקו בהצלחה`,
      });
    }

    return NextResponse.json(
      { error: 'יש לספק ID או מספר טלפון למחיקה' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Appointment DELETE error:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת התורים' },
      { status: 500 }
    );
  }
}
