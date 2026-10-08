import axiosClient from './axiosClient';

const ThongKeAPI = {
  thongKeDT() {
    return axiosClient.get('/api/baocao/thongke/doanh-thu');
  },

  // Thống kê số lịch theo trạng thái trong khoảng ngày để theo dõi tình hình xử lý lịch hẹn.
  getThongKeTrangThai(ngaybd: string, ngaykt: string) {
    return axiosClient.get(`/api/baocao/thongke/trang-thai-lich?ngaybd=${ngaybd}&ngaykt=${ngaykt}`);
  },
  // Thống kê lượt hẹn theo khung giờ trong khoảng ngày, hỗ trợ theo dõi giờ đông khách.
  getThongKeGio(ngaybd: string, ngaykt: string) {
    return axiosClient.get(`/api/baocao/thongke/khung-gio?ngaybd=${ngaybd}&ngaykt=${ngaykt}`);
  },
};

export default ThongKeAPI;
