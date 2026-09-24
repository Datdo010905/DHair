export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  salon: string;
  address: string;
  stylist: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
}

// Dữ liệu minh họa cho giao diện, chưa phải lịch hẹn của tài khoản đăng nhập.
export function createSampleAppointments(): Appointment[] {
  function dateFromToday(offset: number) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  return [
    {
      id: 'DEMO-001', date: dateFromToday(2), time: '09:30',
      service: 'Cắt tóc & tạo kiểu', salon: 'DHair Nguyễn Trãi',
      address: 'Nguyễn Trãi, Thanh Xuân, Hà Nội', stylist: 'Minh Anh',
      duration: 45, price: 150000, status: 'upcoming',
    },
    {
      id: 'DEMO-002', date: dateFromToday(-7), time: '14:00',
      service: 'Gội đầu dưỡng sinh', salon: 'DHair Cầu Giấy',
      address: 'Cầu Giấy, Hà Nội', stylist: 'Hoàng Nam',
      duration: 60, price: 200000, status: 'completed',
    },
    {
      id: 'DEMO-003', date: dateFromToday(-20), time: '16:30',
      service: 'Cắt tóc nam', salon: 'DHair Nguyễn Trãi',
      address: 'Nguyễn Trãi, Thanh Xuân, Hà Nội', stylist: 'Salon sắp xếp',
      duration: 30, price: 100000, status: 'cancelled',
    },
  ];
}
