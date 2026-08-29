import { NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { collection, addDoc, doc, setDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

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

    // 1. Primary: Firebase Firestore Cloud Database
    if (isFirebaseConfigured && db) {
      try {
        // Upsert / Record Customer in Firestore
        const customerRef = doc(db, 'customers', customerPhone.replace(/\D/g, ''));
        await setDoc(
          customerRef,
          {
            name: customerName,
            phone: customerPhone,
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
          status: 'confirmed',
          createdAt: serverTimestamp(),
        });

        return NextResponse.json({
          success: true,
          appointmentId: appointmentDoc.id,
          provider: 'firebase',
          message: 'Appointment successfully saved to Google Firebase Firestore',
        });
      } catch (fbError) {
        console.error('Firebase save error:', fbError);
      }
    }

    // 2. Secondary: Supabase (if configured)
    if (isSupabaseConfigured && supabase) {
      const startTime = new Date(`${date}T${time}:00`);
      const endTime = new Date(startTime.getTime() + 45 * 60000);

      const { data: customerData } = await supabase
        .from('customers')
        .upsert(
          { name: customerName, phone: customerPhone, last_visit: new Date().toISOString() },
          { onConflict: 'phone' }
        )
        .select()
        .single();

      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          barber_id: barberId === 'any' ? null : barberId,
          service_id: serviceId,
          customer_id: customerData?.id || null,
          customer_name: customerName,
          customer_phone: customerPhone,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'confirmed',
        })
        .select()
        .single();

      if (!appointmentError && appointmentData) {
        return NextResponse.json({
          success: true,
          appointmentId: appointmentData.id,
          provider: 'supabase',
          message: 'Appointment successfully created in Supabase database',
        });
      }
    }

    // 3. Fallback mode (Mock mode for instant offline / local testing)
    return NextResponse.json({
      success: true,
      appointmentId: `mock-${Date.now()}`,
      provider: 'mock',
      message: 'Appointment received (Mock Mode)',
    });
  } catch (error) {
    console.error('Appointment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing appointment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'appointments'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const appointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ appointments, provider: 'firebase' });
    } catch (fbError: any) {
      return NextResponse.json({ error: fbError.message }, { status: 500 });
    }
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, barbers(name), services(name, price)')
      .order('start_time', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ appointments: data, provider: 'supabase' });
  }

  return NextResponse.json({
    message: 'Using local mock state.',
    configured: false,
  });
}
