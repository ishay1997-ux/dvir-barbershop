export interface AdminAppointment {
  id: string;
  date: Date;
  time: string;
  customerName: string;
  phone: string;
  service: string;
  branchId: 'ariel' | 'rehovot';
  branchName: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show';
  price: number;
}
