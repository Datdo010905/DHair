
// 1. KHAI BÁO INTERFACES (KIỂU DỮ LIỆU)

export interface ITaiKhoan {
  MATK: string;
  PASS: string;
  PHANQUYEN: number;
  TRANGTHAI: "Hoạt động" | "Khoá";
}

export interface IChiNhanh {
  MACHINHANH: string;
  TENCHINHANH: string;
  DIACHI: string;
  SDT: string;
}

export interface IKhachHang {
  MAKH: string;
  HOTEN: string;
  SDT: string;
  MATK: string;
}

export interface INhanVien {
  MANV: string;
  HOTEN: string;
  CHUCVU: "Quản lý" | "Admin" | "Lễ tân" | "Stylist" | "Thu ngân";
  SDT: string;
  DIACHI: string;
  MACHINHANH: string;
  MATK: string;
  NGAYSINH: string;
}

export interface IDichVu {
  MADV: string;
  TENDV: string;
  MOTA: string;
  THOIGIAN: number;
  GIADV: number;
  TRANGTHAI: "Đang cung cấp" | "Ngừng cung cấp";
  ANH: string;
  QUYTRINH: string;
}

export interface IKhuyenMai {
  MAKM: string;
  TENKM: string;
  MOTA: string;
  NGAYBD: string;
  NGAYKT: string;
  GIATRI: number;
  TRANGTHAI: "Đang áp dụng" | "Hết hạn";
}

export interface ILichHen {
  MALICH: string;
  NGAYHEN: string; // Định dạng YYYY-MM-DD
  GIOHEN: string;  // Định dạng HH:mm
  TRANGTHAI: "Đã đặt" | "Hoàn thành" | "Đã huỷ";
  MANV: string;
  MACHINHANH: string;
  MAKH: string;
}

export interface IChiTietLichHen {
  MALICH: string;
  MADV: string;
  SOLUONG: number;
  GHICHU: string;
}

export interface IHoaDon {
  MAHD: string;
  MAKM: string;
  TONGTIEN: number;
  HINHTHUCTHANHTOAN: "Tiền mặt" | "Chuyển khoản/Online" | "Thẻ";
  MANV: string;
  MALICH: string;
  TRANGTHAI: "Đã thanh toán" | "Đang xử lý" | "Đã huỷ";
}

// 2. DỮ LIỆU ĐÃ ĐƯỢC GẮN KIỂU (TYPED DATA)

// BẢNG TÀI KHOẢN
export const TAIKHOAN: ITaiKhoan[] = [
  { MATK: "admin", PASS: "1", PHANQUYEN: 1, TRANGTHAI: "Hoạt động" },
  { MATK: "quanly", PASS: "1", PHANQUYEN: 2, TRANGTHAI: "Hoạt động" },
  { MATK: "nhanvien1", PASS: "1", PHANQUYEN: 3, TRANGTHAI: "Hoạt động" },
  { MATK: "nhanvien2", PASS: "1", PHANQUYEN: 3, TRANGTHAI: "Hoạt động" },
  { MATK: "thungan", PASS: "1", PHANQUYEN: 4, TRANGTHAI: "Hoạt động" },
  { MATK: "0352512556", PASS: "1", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "0912345678", PASS: "1", PHANQUYEN: 0, TRANGTHAI: "Khoá" },
  { MATK: "0987654322", PASS: "1", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "0352512557", PASS: "1", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "thungan2", PASS: "1", PHANQUYEN: 4, TRANGTHAI: "Hoạt động" },
  { MATK: "0352512558", PASS: "0352512558", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "testdangki", PASS: "12345678", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "0987654321", PASS: "12345678", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "0987654323", PASS: "12345678", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "0987654324", PASS: "12345678", PHANQUYEN: 0, TRANGTHAI: "Hoạt động" },
  { MATK: "thungan3", PASS: "1", PHANQUYEN: 4, TRANGTHAI: "Hoạt động" },
  { MATK: "thungan4", PASS: "1", PHANQUYEN: 4, TRANGTHAI: "Hoạt động" },
  { MATK: "nhanvien3", PASS: "1", PHANQUYEN: 3, TRANGTHAI: "Hoạt động" },
  { MATK: "letan", PASS: "1", PHANQUYEN: 5, TRANGTHAI: "Hoạt động" },
  { MATK: "letan1", PASS: "1", PHANQUYEN: 5, TRANGTHAI: "Hoạt động" },
  { MATK: "letan2", PASS: "1", PHANQUYEN: 5, TRANGTHAI: "Hoạt động" },
  { MATK: "letan3", PASS: "1", PHANQUYEN: 5, TRANGTHAI: "Hoạt động" }
];

// BẢNG CHI NHÁNH
export const CHINHANH: IChiNhanh[] = [
  { MACHINHANH: "CN001", TENCHINHANH: "30Shine - Nguyễn Trãi", DIACHI: "123 Nguyễn Trãi, Hà Nội", SDT: "0911001100" },
  { MACHINHANH: "CN002", TENCHINHANH: "30Shine - Cầu Giấy", DIACHI: "45 Cầu Giấy, Hà Nội", SDT: "0911222333" },
  { MACHINHANH: "CN003", TENCHINHANH: "30Shine - Tân Bình", DIACHI: "56 Trường Chinh, TP.HCM", SDT: "0911444555" },
  { MACHINHANH: "CN004", TENCHINHANH: "30Shine - Đà Nẵng", DIACHI: "12 Nguyễn Văn Linh, Đà Nẵng", SDT: "0911666777" },
];

// BẢNG KHÁCH HÀNG
export const KHACHHANG: IKhachHang[] = [
  { MAKH: "KH001", HOTEN: "Nguyễn Văn An", SDT: "0912345678", MATK: "0912345678" },
  { MAKH: "KH003", HOTEN: "Lê Văn Cường", SDT: "0909123456", MATK: "0909123456" },
  { MAKH: "KH004", HOTEN: "Phạm Thị Dung", SDT: "0911987654", MATK: "0911987654" },
  { MAKH: "KH005", HOTEN: "Đỗ Hữu Phúc", SDT: "0978123456", MATK: "0978123456" },
  { MAKH: "KH006", HOTEN: "Trần Tùng Anh", SDT: "0352512556", MATK: "0352512556" },
  { MAKH: "KH007", HOTEN: "Đỗ Tiến Đạt", SDT: "0352512557", MATK: "0352512557" },
  { MAKH: "KH1763889818387", HOTEN: "Trần Tùng Anh", SDT: "0352512558", MATK: "0352512558" },
  { MAKH: "KH1764776091284", HOTEN: "Test Nguyễn Văn", SDT: "0987654321", MATK: "0987654321" },
  { MAKH: "KH1764777846389", HOTEN: "Test Nguyễn Văn 3", SDT: "0987654324", MATK: "0987654324" }
];

// BẢNG NHÂN VIÊN
export const NHANVIEN: INhanVien[] = [
  { MANV: "NV007", HOTEN: "Đõ Hữu Quốc Ánh", CHUCVU: "Quản lý", SDT: "0911111111", DIACHI: "Hà Nội", MACHINHANH: "CN001", MATK: "quanly", NGAYSINH: "1985-06-10" },
  { MANV: "NV001", HOTEN: "Đỗ Tiến Đạt", CHUCVU: "Admin", SDT: "0352512556", DIACHI: "Hưng Yên", MACHINHANH: "CN001", MATK: "admin", NGAYSINH: "2005-09-01" },
  { MANV: "NV002", HOTEN: "Lê Thị Mai", CHUCVU: "Lễ tân", SDT: "0911222333", DIACHI: "Hưng Yên", MACHINHANH: "CN001", MATK: "letan", NGAYSINH: "1997-09-25" },
  { MANV: "NV003", HOTEN: "Nguyễn Văn Dũng", CHUCVU: "Lễ tân", SDT: "0912333444", DIACHI: "Hải Dương", MACHINHANH: "CN002", MATK: "letan1", NGAYSINH: "1995-01-15" },
  { MANV: "NV004", HOTEN: "Đỗ Thành Đạt", CHUCVU: "Stylist", SDT: "0913444555", DIACHI: "Hà Nam", MACHINHANH: "CN003", MATK: "nhanvien2", NGAYSINH: "1996-08-30" },
  { MANV: "NV005", HOTEN: "Nguyễn Tiến Đạt", CHUCVU: "Thu ngân", SDT: "0914555666", DIACHI: "Hà Nội", MACHINHANH: "CN004", MATK: "thungan", NGAYSINH: "1998-04-12" },
  { MANV: "NV006", HOTEN: "Lê Quỳnh Anh", CHUCVU: "Thu ngân", SDT: "0352512256", DIACHI: "Thái Nguyên", MACHINHANH: "CN003", MATK: "thungan2", NGAYSINH: "2000-09-13" },
  { MANV: "NV008", HOTEN: "Trần Minh Tâm", CHUCVU: "Thu ngân", SDT: "0987656789", DIACHI: "Hưng Yên", MACHINHANH: "CN002", MATK: "thungan3", NGAYSINH: "2005-12-04" },
  { MANV: "NV009", HOTEN: "Lê Minh Anh", CHUCVU: "Thu ngân", SDT: "0987656788", DIACHI: "Hà Nội", MACHINHANH: "CN001", MATK: "thungan4", NGAYSINH: "2005-12-04" },
  { MANV: "NV010", HOTEN: "Lê Quỳnh Chi", CHUCVU: "Stylist", SDT: "0352512251", DIACHI: "Thái Bình", MACHINHANH: "CN001", MATK: "nhanvien3", NGAYSINH: "2000-12-04" },
  { MANV: "NV011", HOTEN: "Nguyễn Văn Đức", CHUCVU: "Stylist", SDT: "0352512252", DIACHI: "Thái Nguyên", MACHINHANH: "CN002", MATK: "nhanvien1", NGAYSINH: "2001-11-11" },
  { MANV: "NV012", HOTEN: "Hoàng Văn Phúc", CHUCVU: "Stylist", SDT: "0352512253", DIACHI: "Hoà Bình", MACHINHANH: "CN004", MATK: "nhanvien", NGAYSINH: "2003-12-04" }, // Chú ý: MATK nhanvien ở file gốc chưa có trong bảng TAIKHOAN
  { MANV: "NV013", HOTEN: "Hoàng Minh Tân", CHUCVU: "Lễ tân", SDT: "0352512254", DIACHI: "Cao Bằng", MACHINHANH: "CN003", MATK: "letan2", NGAYSINH: "1999-12-04" },
  { MANV: "NV014", HOTEN: "Độ Mích Xi", CHUCVU: "Lễ tân", SDT: "0311111222", DIACHI: "Cao Bằng", MACHINHANH: "CN004", MATK: "letan3", NGAYSINH: "1989-12-23" }
];

// BẢNG DỊCH VỤ TÓC
export const DICHVU: IDichVu[] = [
  { MADV: "DV001", TENDV: "Cắt gội combo 1", MOTA: "Gói cắt tóc tiêu chuẩn 10 bước, Kết hợp gội đầu thư giãn, Làm sạch sâu và massage cơ bản.", THOIGIAN: 45, GIADV: 122000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/cat-goi-combo-1-1.jpg', QUYTRINH: "Tư vấn kiểu tóc-Cắt tóc tạo kiểu-Gội đầu làm sạch-Massage thư giãn vùng đầu-Rửa mặt-Xả tóc-Sấy khô-Vuốt sáp tạo kiểu" },
  { MADV: "DV002", TENDV: "Cắt gội combo 2", MOTA: "Gói dịch vụ nâng cao bao gồm cắt tạo kiểu, Gội đầu thảo dược và thêm bước chăm sóc da mặt, Hút mụn.", THOIGIAN: 55, GIADV: 199000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/cat-goi-combo-2.png', QUYTRINH: "Tư vấn kiểu tóc-Cắt tóc-Rửa mặt & Tẩy tế bào chết-Hút mụn cám-Gội đầu thảo dược-Massage đầu-Xả tóc-Sấy khô-Tạo kiểu" },
  { MADV: "DV003", TENDV: "Cắt gội combo 3", MOTA: "Gói dịch vụ cao cấp nhất, Kết hợp cắt tạo kiểu, Gội dưỡng sinh chuyên sâu và massage cổ vai gáy.", THOIGIAN: 65, GIADV: 299000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/cat-goi-combo-3.png', QUYTRINH: "Tư vấn kiểu tóc-Cắt tóc-Gội đầu dưỡng sinh-Bấm huyệt đầu-Massage chuyên sâu cổ vai gáy-Đắp mặt nạ-Xả tóc-Sấy khô-Tạo kiểu cao cấp" },
  { MADV: "DV004", TENDV: "Cắt xả tạo kiểu", MOTA: "Dịch vụ cắt tóc nhanh gọn, Xả sạch tóc con và sấy khô, Tạo kiểu cơ bản. Phù hợp cho người bận rộn.", THOIGIAN: 30, GIADV: 80000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/cat-xa-tao-kieu.png', QUYTRINH: "Tư vấn kiểu tóc-Cắt tóc-Xả nhanh (không gội)-Sấy khô-Tạo kiểu bằng sáp/gôm" },
];

// BẢNG DỊCH VỤ THƯ GIÃN VÀ CHĂM SÓC DA
// Lưu ý: CHAMSOCDA và DICHVU có cấu trúc giống nhau nên có thể dùng chung interface IDichVu
export const CHAMSOCDA: IDichVu[] = [
  { MADV: "CSD001", TENDV: "Chăm sóc da cơ bản", MOTA: "Gói chăm sóc da mặt tiêu chuẩn, Giúp làm sạch sâu, Cấp ẩm và thư giãn da mặt.", THOIGIAN: 50, GIADV: 250000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/goi-thu-gian-3.png', QUYTRINH: "Tẩy trang-Rửa mặt-Tẩy tế bào chết-Xông hơi-Hút bã nhờn-Massage mặt-Đắp mặt nạ-Thoa kem dưỡng" },
  { MADV: "CSD002", TENDV: "Lấy mụn chuyên sâu", MOTA: "Dịch vụ làm sạch mụn ẩn, Mụn viêm bằng dụng cụ vô trùng, Kết hợp mặt nạ làm dịu da, giảm sưng.", THOIGIAN: 70, GIADV: 350000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/goi-thu-gian-2.png', QUYTRINH: "Tẩy trang-Rửa mặt-Xông hơi-Lấy mụn-Sát khuẩn-Điện tím-Đắp mặt nạ-Chiếu đèn sinh học-Thoa thuốc" },
  { MADV: "CSD003", TENDV: "Massage body tinh dầu", MOTA: "Liệu pháp massage toàn thân với tinh dầu thiên nhiên, Giúp giảm căng cơ, Xả stress và cải thiện lưu thông máu.", THOIGIAN: 60, GIADV: 300000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/goi-thu-gian.png', QUYTRINH: "Khởi động-Ấn huyệt lưng-Massage chân-Massage tay-Massage lưng vai gáy-Massage đầu-Lau khăn nóng" },
  { MADV: "CSD004", TENDV: "Gội đầu dưỡng sinh", MOTA: "Gội đầu kết hợp massage, Bấm huyệt vùng đầu - cổ - vai gáy giúp thư giãn, Giảm đau nhức và ngủ ngon.", THOIGIAN: 60, GIADV: 200000, TRANGTHAI: "Đang cung cấp", ANH: 'img/product/goi-thu-gian-1.png', QUYTRINH: "Rửa mặt-Massage mặt-Gội đầu lần 1-Bấm huyệt đầu-Massage cổ vai gáy-Gội đầu lần 2-Xả tóc-Sấy khô" }
];

// BẢNG KHUYẾN MÃI
export const KHUYENMAI: IKhuyenMai[] = [
  { MAKM: "KM001", TENKM: "Giảm giá khai trương", MOTA: "Giảm 20% tất cả dịch vụ", NGAYBD: "2025-01-01", NGAYKT: "2025-02-01", GIATRI: 0.2, TRANGTHAI: "Hết hạn" },
  { MAKM: "KM002", TENKM: "Thứ 4 vui vẻ", MOTA: "Giảm 15% dịch vụ cắt tóc", NGAYBD: "2025-03-01", NGAYKT: "2025-12-31", GIATRI: 0.15, TRANGTHAI: "Đang áp dụng" },
  { MAKM: "KM003", TENKM: "Sinh nhật khách hàng", MOTA: "Giảm 30% cho khách", NGAYBD: "2025-01-01", NGAYKT: "2025-12-31", GIATRI: 0.3, TRANGTHAI: "Đang áp dụng" },
  { MAKM: "KM004", TENKM: "Mùa hè sôi động", MOTA: "Combo cắt + gội chỉ 150k", NGAYBD: "2025-05-01", NGAYKT: "2025-08-31", GIATRI: 0.25, TRANGTHAI: "Hết hạn" },
  { MAKM: "KM005", TENKM: "Khách hàng thân thiết", MOTA: "Giảm 10% tổng hóa đơn", NGAYBD: "2025-01-01", NGAYKT: "2025-12-31", GIATRI: 0.1, TRANGTHAI: "Đang áp dụng" },
];

// BẢNG LỊCH HẸN
export const LICHHEN: ILichHen[] = [
  { MALICH: "LH002", NGAYHEN: "2025-10-06", GIOHEN: "14:00", TRANGTHAI: "Hoàn thành", MANV: "NV004", MACHINHANH: "CN003", MAKH: "KH001" },
  { MALICH: "LH003", NGAYHEN: "2025-10-07", GIOHEN: "10:30", TRANGTHAI: "Hoàn thành", MANV: "NV003", MACHINHANH: "CN002", MAKH: "KH003" },
  { MALICH: "LH004", NGAYHEN: "2025-10-08", GIOHEN: "16:00", TRANGTHAI: "Đã huỷ", MANV: "NV004", MACHINHANH: "CN003", MAKH: "KH004" },
  { MALICH: "LH005", NGAYHEN: "2025-10-09", GIOHEN: "13:00", TRANGTHAI: "Hoàn thành", MANV: "NV002", MACHINHANH: "CN001", MAKH: "KH005" },
  { MALICH: "LH006", NGAYHEN: "2025-10-09", GIOHEN: "13:00", TRANGTHAI: "Hoàn thành", MANV: "NV002", MACHINHANH: "CN001", MAKH: "KH006" },
  { MALICH: "LH007", NGAYHEN: "2025-10-09", GIOHEN: "13:00", TRANGTHAI: "Hoàn thành", MANV: "NV003", MACHINHANH: "CN002", MAKH: "KH006" },
  { MALICH: "LH008", NGAYHEN: "2025-10-08", GIOHEN: "13:00", TRANGTHAI: "Hoàn thành", MANV: "NV004", MACHINHANH: "CN003", MAKH: "KH006" },
  { MALICH: "LH009", NGAYHEN: "2025-10-07", GIOHEN: "13:00", TRANGTHAI: "Hoàn thành", MANV: "NV005", MACHINHANH: "CN004", MAKH: "KH006" },
  { MALICH: "LH010", NGAYHEN: "2025-10-06", GIOHEN: "13:00", TRANGTHAI: "Đã huỷ", MANV: "NV005", MACHINHANH: "CN004", MAKH: "KH006" },
  { MALICH: "LH1764602810851", NGAYHEN: "2025-12-02", GIOHEN: "08:00", TRANGTHAI: "Hoàn thành", MANV: "NV003", MACHINHANH: "CN002", MAKH: "KH1763889818387" },
  { MALICH: "LH1764777094223", NGAYHEN: "2025-12-04", GIOHEN: "08:00", TRANGTHAI: "Đã đặt", MANV: "NV005", MACHINHANH: "CN004", MAKH: "KH1764776091284" },
  { MALICH: "LH1764778285968", NGAYHEN: "2025-12-04", GIOHEN: "08:00", TRANGTHAI: "Đã đặt", MANV: "NV004", MACHINHANH: "CN003", MAKH: "KH1764777846389" },
  { MALICH: "LH1764778372188", NGAYHEN: "2025-12-04", GIOHEN: "08:00", TRANGTHAI: "Đã đặt", MANV: "NV001", MACHINHANH: "CN001", MAKH: "KH1764777846389" }
];

// BẢNG CHI TIẾT LỊCH HẸN
export const CHITIETLICHHEN: IChiTietLichHen[] = [
  { MALICH: "LH002", MADV: "DV004", SOLUONG: 1, GHICHU: "Uốn nhẹ phần mái" },
  { MALICH: "LH003", MADV: "DV003", SOLUONG: 1, GHICHU: "Nhuộm highlight xanh" },
  { MALICH: "LH005", MADV: "DV001", SOLUONG: 1, GHICHU: "Tóc ngắn nam" },
  { MALICH: "LH006", MADV: "DV001", SOLUONG: 2, GHICHU: "Tóc ngắn nam" },
  { MALICH: "LH007", MADV: "DV002", SOLUONG: 4, GHICHU: "Không" },
  { MALICH: "LH008", MADV: "CSD003", SOLUONG: 3, GHICHU: "Không" },
  { MALICH: "LH009", MADV: "CSD004", SOLUONG: 1, GHICHU: "Không" },
  { MALICH: "LH1764602810851", MADV: "DV002", SOLUONG: 1, GHICHU: "Không" },
  { MALICH: "LH1764777094223", MADV: "CSD002", SOLUONG: 1, GHICHU: "Không" },
  { MALICH: "LH1764778285968", MADV: "CSD002", SOLUONG: 1, GHICHU: "Không" },
  { MALICH: "LH1764778372188", MADV: "CSD002", SOLUONG: 1, GHICHU: "Không" }
];

// BẢNG HÓA ĐƠN
export const HOADON: IHoaDon[] = [
  { MAHD: "HD001", MAKM: "KM002", TONGTIEN: 170000, HINHTHUCTHANHTOAN: "Tiền mặt", MANV: "NV005", MALICH: "LH001", TRANGTHAI: "Đã thanh toán" },
  { MAHD: "HD002", MAKM: "KM004", TONGTIEN: 350000, HINHTHUCTHANHTOAN: "Chuyển khoản/Online", MANV: "NV005", MALICH: "LH002", TRANGTHAI: "Đã thanh toán" },
  { MAHD: "HD005", MAKM: "KM005", TONGTIEN: 72000, HINHTHUCTHANHTOAN: "Chuyển khoản/Online", MANV: "NV005", MALICH: "LH005", TRANGTHAI: "Đã thanh toán" },
  { MAHD: "HD0011", MAKM: "KM002", TONGTIEN: 170000, HINHTHUCTHANHTOAN: "Thẻ", MANV: "NV005", MALICH: "LH009", TRANGTHAI: "Đã thanh toán" },
  { MAHD: "HD00111", MAKM: "KM003", TONGTIEN: 139300, HINHTHUCTHANHTOAN: "Chuyển khoản/Online", MANV: "NV006", MALICH: "LH1764602810851", TRANGTHAI: "Đã huỷ" },
  { MAHD: "HD003", MAKM: "KM005", TONGTIEN: 269100, HINHTHUCTHANHTOAN: "Chuyển khoản/Online", MANV: "NV006", MALICH: "LH003", TRANGTHAI: "Đã thanh toán" },
  { MAHD: "HD004", MAKM: "KM002", TONGTIEN: 207400, HINHTHUCTHANHTOAN: "Tiền mặt", MANV: "NV006", MALICH: "LH006", TRANGTHAI: "Đang xử lý" },
  { MAHD: "HD006", MAKM: "KM005", TONGTIEN: 716400, HINHTHUCTHANHTOAN: "Tiền mặt", MANV: "NV006", MALICH: "LH007", TRANGTHAI: "Đã thanh toán" },
  { MAHD: "HD007", MAKM: "KM005", TONGTIEN: 810000, HINHTHUCTHANHTOAN: "Chuyển khoản/Online", MANV: "NV006", MALICH: "LH008", TRANGTHAI: "Đã thanh toán" }
];