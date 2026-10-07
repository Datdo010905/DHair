import axiosClient from './axiosClient';

export interface Booking {
  MALICH: string;
  NGAYHEN: string;
  GIOHEN: string;
  TRANGTHAI: string;
  MACHINHANH: string;
  MAKH: string;
  LOAILICH?: string;
  THOIGIANDEN?: string | null;
  BATDAUTHUCTE?: string | null;
  KETTHUCDUKIEN?: string | null;
  KETTHUCTHUCTE?: string | null;
  LYDOHUY?: string | null;
}
export interface BookingDetails {
  MALICH: string;
  MADV: string;
  MANV: string;
  SOLUONG: number;
  GIA_DUKIEN: number;
  GHICHU: string;
  PHATSINH?: boolean;
  THOILUONG?: number | null;
}

export interface AdminBooking extends Booking {
  KHACHHANG: { HOTEN: string; SDT: string } | null;
  CHINHANH: { TENCHINHANH: string | null } | null;
  CHITIETLICHHEN: (BookingDetails & {
    DICHVU: { TENDV: string } | null;
    NHANVIEN: { HOTEN: string } | null;
  })[];
}
export interface AdminBookingQuery {
  mode: 'days' | 'archive';
  start: string;
  end: string;
  status: string;
  branchId: string;
  staffId: string;
  search: string;
  page: number;
  pageSize: number;
}
export interface AdminBookingResult {
  items: AdminBooking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  today: string;
  lastDay: string;
  start: string;
  end: string;
  days: { date: string; count: number }[];
  statusCounts: Record<string, number>;
  branches: { MACHINHANH: string; TENCHINHANH: string | null }[];
  stylists: { MANV: string; HOTEN: string; MACHINHANH: string | null }[];
}

const BookingApi = {
  getCancellationReasons() {
    return axiosClient.get<{ success: boolean; data: string[] }>(
      '/api/lichhen/cancellation-reasons',
    );
  },
  getCustomerHistory() {
    return axiosClient.get<{ success: boolean; data: { cancellationReasons: string[] } }>(
      '/api/lichhen/history',
    );
  },
  cancelAppointment(id: string, reason: string, otherReason: string) {
    return axiosClient.post(`/api/lichhen/${encodeURIComponent(id)}/cancel`, {
      reason,
      otherReason,
    });
  },
  availability(
    params: {
      branchId: string;
      staffId: string;
      serviceId: string;
      date: string;
      quantity: number;
    },
    signal?: AbortSignal,
  ) {
    return axiosClient.get('/api/lichhen/availability', { params, signal });
  },
  async getAdminList(params: AdminBookingQuery, signal?: AbortSignal) {
    const response = await axiosClient.get<{
      success: boolean;
      data: AdminBookingResult;
      message?: string;
    }>('/api/lichhen/admin-list', { params, signal });
    if (!response.data.success) throw new Error(response.data.message || 'Không thể tải lịch hẹn.');
    return response.data.data;
  },
  // ===== LỊCH HẸN =====
  getAll() {
    return axiosClient.get('/api/lichhen/get-all-lichhen');
  },

  getById(id: string) {
    return axiosClient.get(`/api/lichhen/get-byId-lichhen/${id}`);
  },

  getAllByIdKH(id: string) {
    return axiosClient.get(`/api/lichhen/get-byIdKH-lichhen/${id}`);
  },
  getAllByIdNV(id: string) {
    return axiosClient.get(`/api/lichhen/get-byIdNV-lichhen/${id}`);
  },

  create(data: Booking) {
    return axiosClient.post('/api/lichhen/insert-lichhen', data);
  },

  update(id: string, trangthai: string, reason?: string) {
    return axiosClient.put(`/api/lichhen/update-lichhen/${id}`, {
      TRANGTHAI: trangthai,
      reason,
    });
  },

  delete(id: string) {
    return axiosClient.delete(`/api/lichhen/delete-lichhen/${id}`);
  },
  getByNgay(ngaybd: string, ngaykt: string) {
    const url = `/api/lichhen/get-all-lichhenTheoNgay?ngaybd=${ngaybd}&ngaykt=${ngaykt}`;
    return axiosClient.get(url);
  },
  // ===== CHI TIẾT LỊCH HẸN =====
  getAllCT() {
    return axiosClient.get('/api/lichhen/get-all-CTlichhen');
  },

  getByIdCT(id: string) {
    return axiosClient.get(`/api/lichhen/get-byId-CTlichhen/${id}`);
  },

  createCT(data: BookingDetails) {
    return axiosClient.post('/api/lichhen/insert-CTlichhen', data);
  },
  updateCT(id: string, ghichu: string) {
    return axiosClient.put(`/api/lichhen/update-CTlichhen/${id}`, { GHICHU: ghichu });
  },
  deleteCT(id: string) {
    return axiosClient.delete(`/api/lichhen/delete-CTlichhen/${id}`);
  },

  createFull: (data: { booking: Booking; details: BookingDetails }) => {
    return axiosClient.post('/api/lichhen/create-full', data);
  },

  deleteFull: (id: string) => {
    return axiosClient.delete(`/api/lichhen/delete-full/${id}`);
  },
};
export default BookingApi;
