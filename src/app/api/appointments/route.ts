import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
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
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

const memoryAppointments: MemoryAppointment[] = [];

// ============================================================
// 1. CREATE APPOINTMENT (POST)
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

    if (cleanName.length < 2 || cleanPhone.length < 8) {
      return NextResponse.json(
        { error: 'שם מלא או מספר טלפון אינם תקינים' },
        { status: 400 }
      );
    }

    let appointmentId = `apt-${Date.now()}`;

    // 1. Primary: Firebase Firestore Cloud Database
    if (isFirebaseConfigured && db) {
      try {
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
          cleanPhone,
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

    // Default: List all appointments
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          let list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

          if (slugFilter) {
            list = list.filter((a: any) => a.businessSlug === slugFilter);
          }

          return NextResponse.json({ appointments: list, source: 'firestore' });
        }
      } catch (fbError) {
        console.error('Firebase read error:', fbError);
      }
    }

    let result = memoryAppointments;
    if (slugFilter) {
      result = result.filter((a) => a.businessSlug === slugFilter);
    }

    return NextResponse.json({ appointments: result, source: 'memory' });
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
      const cleanPhone = phone.replace(/\D/g, '');
      if (isFirebaseConfigured && db) {
        try {
          const q = query(
            collection(db, 'appointments'),
            where('cleanPhone', '==', cleanPhone)
          );
          const snapshot = await getDocs(q);
          const currentDb = db;
          const deletePromises = snapshot.docs.map((docSnap) =>
            deleteDoc(doc(currentDb, 'appointments', docSnap.id))
          );
          await Promise.all(deletePromises);
        } catch (fbError) {
          console.error('Firebase bulk delete error:', fbError);
        }
      }

      for (let i = memoryAppointments.length - 1; i >= 0; i--) {
        if (memoryAppointments[i].customerPhone.replace(/\D/g, '') === cleanPhone) {
          memoryAppointments.splice(i, 1);
        }
      }

      return NextResponse.json({
        success: true,
        message: `כל התורים עבור מספר ${phone} נמחקו בהצלחה`,
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
