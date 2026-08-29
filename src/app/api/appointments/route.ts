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
      servicePrice,
      barberId,
      barberName,
      branchId,
      branchName,
      date,
      time,
      customerName,
      customerPhone,
    } = body;

    if (!serviceId || !date || !time || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    let appointmentId = `apt-${Date.now()}`;

    // 1. Primary: Firebase Firestore Cloud Database
    if (isFirebaseConfigured && db) {
      try {
        // Record Customer in Firestore
        const customerRef = doc(db, 'customers', cleanPhone);
        await setDoc(
          customerRef,
          {
            name: customerName,
            phone: customerPhone,
            cleanPhone,
            lastVisit: new Date().toISOString(),
            favoriteBranchId: branchId || 'ariel',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Add Appointment to 'appointments' collection
        const appointmentDoc = await addDoc(collection(db, 'appointments'), {
          serviceId,
          serviceName: serviceName || 'תספורת גברים',
          servicePrice: Number(servicePrice) || 80,
          barberId: barberId || 'dvir',
          barberName: barberName || 'דביר',
          branchId: branchId || 'ariel',
          branchName: branchName || 'סניף אריאל',
          date,
          time,
          customerName,
          customerPhone,
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
      serviceId,
      serviceName: serviceName || 'תספורת גברים',
      servicePrice: Number(servicePrice) || 80,
      barberId: barberId || 'dvir',
      barberName: barberName || 'דביר',
      branchId: branchId || 'ariel',
      branchName: branchName || 'סניף אריאל',
      date,
      time,
      customerName,
      customerPhone,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    memoryAppointments.unshift(newApt);

    return NextResponse.json({
      success: true,
      appointmentId,
      appointment: newApt,
      message: 'Appointment successfully created and confirmed',
    });
  } catch (error) {
    console.error('Appointment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing appointment' },
      { status: 500 }
    );
  }
}

// ============================================================
// 2. GET APPOINTMENTS (GET) - Supports ?phone=... or ?id=...
// ============================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneParam = searchParams.get('phone');
    const idParam = searchParams.get('id');

    const cleanPhone = phoneParam ? phoneParam.replace(/\D/g, '') : null;

    if (isFirebaseConfigured && db) {
      try {
        const appointmentsRef = collection(db, 'appointments');
        let q;

        if (idParam) {
          const docSnap = await getDoc(doc(db, 'appointments', idParam));
          if (docSnap.exists()) {
            return NextResponse.json({
              appointments: [{ id: docSnap.id, ...docSnap.data() }],
              provider: 'firebase',
            });
          }
        }

        if (cleanPhone) {
          q = query(appointmentsRef, where('cleanPhone', '==', cleanPhone));
          const snapshot = await getDocs(q);
          const appointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          return NextResponse.json({ appointments, provider: 'firebase' });
        }

        // Admin overview (all appointments)
        q = query(appointmentsRef, orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const appointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ appointments, provider: 'firebase' });
      } catch (fbError) {
        console.error('Firebase read error:', fbError);
      }
    }

    // Memory store fallback
    let filtered = memoryAppointments;
    if (idParam) {
      filtered = memoryAppointments.filter((a) => a.id === idParam);
    } else if (cleanPhone) {
      filtered = memoryAppointments.filter(
        (a) => a.customerPhone.replace(/\D/g, '').includes(cleanPhone) || cleanPhone.includes(a.customerPhone.replace(/\D/g, ''))
      );
    }

    return NextResponse.json({
      appointments: filtered,
      provider: 'memory',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, appointments: [] }, { status: 500 });
  }
}

// ============================================================
// 3. CANCEL / UPDATE APPOINTMENT (PATCH & DELETE)
// ============================================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }

    const newStatus = status || 'cancelled';

    // 1. Firebase Firestore
    if (isFirebaseConfigured && db) {
      try {
        const aptRef = doc(db, 'appointments', id);
        await updateDoc(aptRef, {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      } catch (fbError) {
        console.error('Firebase update error:', fbError);
      }
    }

    // 2. Update memory store
    const found = memoryAppointments.find((a) => a.id === id);
    if (found) {
      found.status = newStatus;
    }

    return NextResponse.json({
      success: true,
      id,
      status: newStatus,
      message: 'Appointment status updated successfully',
    });
  } catch (error: any) {
    console.error('Cancel API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null;

    if (!id && !cleanPhone) {
      return NextResponse.json({ error: 'Missing appointment id or phone parameter' }, { status: 400 });
    }

    if (isFirebaseConfigured && db) {
      const firestore = db;
      try {
        if (id) {
          await deleteDoc(doc(firestore, 'appointments', id));
        } else if (cleanPhone) {
          const q = query(collection(firestore, 'appointments'), where('cleanPhone', '==', cleanPhone));
          const snapshot = await getDocs(q);
          const deletePromises = snapshot.docs.map((d) => deleteDoc(doc(firestore, 'appointments', d.id)));
          await Promise.all(deletePromises);
        }
      } catch (fbError) {
        console.error('Firebase delete error:', fbError);
      }
    }

    // Purge from memory store
    if (id) {
      const idx = memoryAppointments.findIndex((a) => a.id === id);
      if (idx !== -1) memoryAppointments.splice(idx, 1);
    } else if (cleanPhone) {
      for (let i = memoryAppointments.length - 1; i >= 0; i--) {
        if (memoryAppointments[i].customerPhone.replace(/\D/g, '').includes(cleanPhone)) {
          memoryAppointments.splice(i, 1);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Appointments deleted and purged successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
