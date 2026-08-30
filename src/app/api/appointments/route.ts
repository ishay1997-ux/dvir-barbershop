import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { checkRateLimit } from '@/lib/rateLimit';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  MemoryAppointment,
  validateAppointmentPayload,
  checkMemoryConflict,
  getPhoneVariations,
  createMemoryAppointment,
} from '@/lib/appointment-helpers';

// In-Memory fallback store for runtime consistency across serverless invocations
const memoryAppointments: MemoryAppointment[] = [];

// ============================================================
// 1. POST: Book a new appointment (Production Double Booking Safe)
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateAppointmentPayload(body);

    if (!validation.isValid || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { data } = validation;

    // Rate Limiting Protection (Max 15 bookings per minute per IP / phone)
    const ip = request.headers.get('x-forwarded-for') || 'anon';
    const rateCheck = checkRateLimit(`book:${ip}:${data.cleanPhone}`, 15, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'בוצעו יותר מדי ניסיונות הזמנה בדקה האחרונה. אנא המתן מספר שניות ונסה שוב.' },
        { status: 429 }
      );
    }

    // In-memory conflict check
    if (checkMemoryConflict(memoryAppointments, data.resolvedSlug, data.resolvedDate, data.resolvedTime, data.resolvedBarberId)) {
      return NextResponse.json(
        { error: 'מועד זה כבר נתפס על ידי לקוח אחר. אנא בחר שעה אחרת.' },
        { status: 409 }
      );
    }

    let appointmentId = `apt-${Date.now()}`;

    // Firebase Firestore Cloud Database with double-booking check
    if (isFirebaseConfigured && db) {
      try {
        const conflictQuery = query(
          collection(db, 'appointments'),
          where('businessSlug', '==', data.resolvedSlug),
          where('date', '==', data.resolvedDate),
          where('time', '==', data.resolvedTime),
          where('status', '==', 'confirmed')
        );
        const conflictSnap = await getDocs(conflictQuery);
        if (!conflictSnap.empty) {
          const barberConflict = conflictSnap.docs.some(
            (d) => (d.data().barberId || 'dvir') === data.resolvedBarberId
          );
          if (barberConflict) {
            return NextResponse.json(
              { error: 'מועד זה כבר נתפס על ידי לקוח אחר. אנא בחר שעה אחרת.' },
              { status: 409 }
            );
          }
        }

        // Record Customer in Firestore
        const customerRef = doc(db, 'customers', data.cleanPhone);
        await setDoc(
          customerRef,
          {
            name: data.cleanName,
            phone: data.customerPhone,
            cleanPhone: data.cleanPhone,
            lastVisit: new Date().toISOString(),
            favoriteBranchId: data.branchId || 'ariel',
            businessSlug: data.resolvedSlug,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Add Appointment to 'appointments' collection
        const appointmentDoc = await addDoc(collection(db, 'appointments'), {
          serviceId: data.serviceId,
          serviceName: data.resolvedServiceName,
          servicePrice: data.resolvedPrice,
          barberId: data.resolvedBarberId,
          barberName: data.barberName,
          branchId: data.branchId,
          branchName: data.branchName,
          businessSlug: data.resolvedSlug,
          businessName: data.resolvedBizName,
          date: data.resolvedDate,
          time: data.resolvedTime,
          customerName: data.cleanName,
          customerPhone: data.customerPhone,
          cleanPhone: data.cleanPhone,
          customerAddress: data.customerAddress || null,
          locationType: data.locationType,
          bookingType: data.bookingType,
          status: 'confirmed',
          createdAt: serverTimestamp(),
        });

        appointmentId = appointmentDoc.id;
      } catch (fbError) {
        console.error('Firebase save error:', fbError);
      }
    }

    // Save to memory store as backup
    const newApt = createMemoryAppointment(appointmentId, data);
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
// 2. GET: List or Search Appointments
// ============================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneFilter = searchParams.get('phone');
    const slugFilter = searchParams.get('businessSlug');

    // Search by customer phone
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

      const memoryMatches = memoryAppointments.filter((a) =>
        a.customerPhone.replace(/\D/g, '').includes(cleanSearchPhone)
      );
      return NextResponse.json({ appointments: memoryMatches, source: 'memory' });
    }

    // Tenant-scoped indexed query
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
            { headers: { 'Cache-Control': 'private, max-age=5, stale-while-revalidate=15' } }
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
      { headers: { 'Cache-Control': 'private, max-age=5, stale-while-revalidate=15' } }
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
// 3. PATCH: Update appointment status
// ============================================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing appointment ID or status' }, { status: 400 });
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
// 4. DELETE: Purge appointments by ID or Phone
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
      const { last9Digits, variations } = getPhoneVariations(phone);

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

          const deletePromises = toDeleteIds.map((delId) =>
            deleteDoc(doc(currentDb, 'appointments', delId))
          );

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
