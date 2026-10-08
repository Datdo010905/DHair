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
  // Lấy danh mục lý do hủy dùng chung để form gửi đúng giá trị backend chấp nhận.
  getCancellationReasons() {
    return axiosClient.get<{ success: boolean; data: string[] }>(
      '/api/lichhen/cancellation-reasons',
    );
  },
  // Lấy lịch sử của khách hàng được xác định từ phiên đăng nhập.
  getCustomerHistory() {
    return axiosClient.get<{ success: boolean; data: { cancellationReasons: string[] } }>(
      '/api/lichhen/history',
    );
  },
  // Gửi yêu cầu khách hủy lịch cùng lý do chọn sẵn và nội dung lý do khác.
  cancelAppointment(id: string, reason: string, otherReason: string) {
    return axiosClient.post(`/api/lichhen/${encodeURIComponent(id)}/cancel`, {
      reason,
      otherReason,
    });
  },
  // Tra giờ trống theo chi nhánh, stylist, dịch vụ, ngày và số lượng; hỗ trợ hủy yêu cầu cũ.
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
  // Lấy lịch đã lọc/phân trang cùng bộ đếm và danh mục; bóc lớp phản hồi cho BookingPage.
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
  // Lấy toàn bộ bản ghi lịch; màn hình quản trị có bộ lọc dùng getAdminList.
  getAll() {
    return axiosClient.get('/api/lichhen/get-all-lichhen');
  },

  // Tra thông tin chung của một lịch bằng MALICH.
  getById(id: string) {
    return axiosClient.get(`/api/lichhen/get-byId-lichhen/${id}`);
  },

  // Tra các lịch thuộc mã khách hàng được truyền vào.
  getAllByIdKH(id: string) {
    return axiosClient.get(`/api/lichhen/get-byIdKH-lichhen/${id}`);
  },
  // Endpoint nhận mã tài khoản để tìm nhân viên và các phần việc được phân công.
  getAllByIdNV(id: string) {
    return axiosClient.get(`/api/lichhen/get-byIdNV-lichhen/${id}`);
  },

  // Tạo riêng thông tin lịch; dùng createFull khi cần lưu đồng thời dịch vụ.
  create(data: Booking) {
    return axiosClient.post('/api/lichhen/insert-lichhen', data);
  },

  // Đổi trạng thái; backend kiểm tra quy trình và ghi nhận lý do nếu hủy lịch.
  update(id: string, trangthai: string, reason?: string) {
    return axiosClient.put(`/api/lichhen/update-lichhen/${id}`, {
      TRANGTHAI: trangthai,
      reason,
    });
  },

  // Gọi endpoint xóa bản ghi lịch riêng lẻ.
  delete(id: string) {
    return axiosClient.delete(`/api/lichhen/delete-lichhen/${id}`);
  },
  // Tra lịch trong khoảng từ ngày bắt đầu đến hết ngày kết thúc.
  getByNgay(ngaybd: string, ngaykt: string) {
    const url = `/api/lichhen/get-all-lichhenTheoNgay?ngaybd=${ngaybd}&ngaykt=${ngaykt}`;
    return axiosClient.get(url);
  },
  // ===== CHI TIẾT LỊCH HẸN =====
  // Lấy toàn bộ các dòng dịch vụ của lịch hẹn.
  getAllCT() {
    return axiosClient.get('/api/lichhen/get-all-CTlichhen');
  },

  // id là mã lịch; kết quả gồm tất cả dịch vụ thuộc lịch đó.
  getByIdCT(id: string) {
    return axiosClient.get(`/api/lichhen/get-byId-CTlichhen/${id}`);
  },

  // Thêm dịch vụ vào lịch hiện có qua endpoint kiểm tra quyền nhân viên.
  createCT(data: BookingDetails) {
    return axiosClient.post('/api/lichhen/insert-CTlichhen', data);
  },
  // Cập nhật cùng một ghi chú cho tất cả chi tiết của mã lịch.
  updateCT(id: string, ghichu: string) {
    return axiosClient.put(`/api/lichhen/update-CTlichhen/${id}`, { GHICHU: ghichu });
  },
  // Xóa các chi tiết dịch vụ theo mã lịch.
  deleteCT(id: string) {
    return axiosClient.delete(`/api/lichhen/delete-CTlichhen/${id}`);
  },

  // Gửi lịch và dịch vụ ban đầu để backend xử lý tạo đầy đủ trong transaction.
  createFull: (data: { booking: Booking; details: BookingDetails }) => {
    return axiosClient.post('/api/lichhen/create-full', data);
  },

  // Yêu cầu xóa lịch cùng chi tiết bằng luồng transaction của backend.
  deleteFull: (id: string) => {
    return axiosClient.delete(`/api/lichhen/delete-full/${id}`);
  },
};
export default BookingApi;
