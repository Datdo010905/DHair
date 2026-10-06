-- create database Dhair;
use dhair;
INSERT INTO `CHINHANH` (`MACHINHANH`, `TENCHINHANH`, `DIACHI`, `SDT`) VALUES ('CN001', 'DHair - Nguyễn Trãi', '123 Nguyễn Trãi, Hà Nội', '0911001100');
INSERT INTO `CHINHANH` (`MACHINHANH`, `TENCHINHANH`, `DIACHI`, `SDT`) VALUES ('CN002', 'DHair - Cầu Giấy', '45 Cầu Giấy, Hà Nội', '0911222333');
INSERT INTO `CHINHANH` (`MACHINHANH`, `TENCHINHANH`, `DIACHI`, `SDT`) VALUES ('CN003', 'DHair - Tân Bình', '56 Trường Chinh, TP.HCM', '0911444555');
INSERT INTO `CHINHANH` (`MACHINHANH`, `TENCHINHANH`, `DIACHI`, `SDT`) VALUES ('CN004', 'DHair - Đà Nẵng', '12 Nguyễn Văn Linh, Đà Nẵng', '0911666777');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('CSD001', 'CSD', 'Chăm sóc da cơ bản', 'Gói chăm sóc da mặt tiêu chuẩn, Giúp làm sạch sâu, Cấp ẩm và thư giãn da mặt.', 50, 250000, 'Đang cung cấp', '/img/product/goi-thu-gian-3.png', 'Tẩy trang-Rửa mặt-Tẩy tế bào chết-Xông hơi-Hút bã nhờn-Massage mặt-Đắp mặt nạ-Thoa kem dưỡng');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('CSD002', 'CSD', 'Lấy mụn chuyên sâu', 'Dịch vụ làm sạch mụn ẩn, Mụn viêm bằng dụng cụ vô trùng, Kết hợp mặt nạ làm dịu da, giảm sưng.', 70, 350000, 'Đang cung cấp', '/img/product/goi-thu-gian-2.png', 'Tẩy trang-Rửa mặt-Xông hơi-Lấy mụn-Sát khuẩn-Điện tím-Đắp mặt nạ-Chiếu đèn sinh học-Thoa thuốc');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('CSD003', 'CSD', 'Massage body tinh dầu', 'Liệu pháp massage toàn thân với tinh dầu thiên nhiên, Giúp giảm căng cơ, Xả stress và cải thiện lưu thông máu.', 60, 300000, 'Đang cung cấp', '/img/product/goi-thu-gian.png', 'Khởi động-Ấn huyệt lưng-Massage chân-Massage tay-Massage lưng vai gáy-Massage đầu-Lau khăn nóng');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('CSD004', 'CSD', 'Gội đầu dưỡng sinh', 'Gội đầu kết hợp massage, Bấm huyệt vùng đầu - cổ - vai gáy giúp thư giãn, Giảm đau nhức và ngủ ngon.', 60, 200000, 'Đang cung cấp', '/img/product/goi-thu-gian-1.png', 'Rửa mặt-Massage mặt-Gội đầu lần 1-Bấm huyệt đầu-Massage cổ vai gáy-Gội đầu lần 2-Xả tóc-Sấy khô');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DV001', 'CT', 'Cắt gội combo 1', 'Gói cắt tóc tiêu chuẩn 10 bước, Kết hợp gội đầu thư giãn, Làm sạch sâu và massage cơ bản.', 45, 122000, 'Đang cung cấp', '/img/product/cat-goi-combo-1-1.jpg', 'Tư vấn kiểu tóc-Cắt tóc tạo kiểu-Gội đầu làm sạch-Massage thư giãn vùng đầu-Rửa mặt-Xả tóc-Sấy khô-Vuốt sáp tạo kiểu');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DV00111', 'CT', 'Uốn Tiêu Chuẩn 2', 'Dịch vụ cắt tóc nhanh gọn, Xả sạch tóc con và sấy khô, Tạo kiểu cơ bản. Phù hợp cho người bận rộn.', 100, 999999, 'Đang cung cấp', '/img/product/uon-toc-con-sau.jpg', 'Tư vấn kiểu tóc-Cắt tóc tạo kiểu-Gội đầu làm sạch-Massage thư giãn vùng đầu-Rửa mặt-Xả tóc-Sấy khô-Vuốt sáp tạo kiểu');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DV0011111', 'CT', 'Uốn Tiêu Chuẩn 1', 'Dịch vụ cắt tóc nhanh gọn, Xả sạch tóc con và sấy khô, Tạo kiểu cơ bản. Phù hợp cho người bận rộn.', 55, 11111111, 'Đang cung cấp', '/img/product/cat-goi-combo-3-1.jpg', 'Tư vấn kiểu tóc-Cắt tóc tạo kiểu-Gội đầu làm sạch-Massage thư giãn vùng đầu-Rửa mặt-Xả tóc-Sấy khô-Vuốt sáp tạo kiểu');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DV002', 'CT', 'Cắt gội combo 2', 'Gói dịch vụ nâng cao bao gồm cắt tạo kiểu, Gội đầu thảo dược và thêm bước chăm sóc da mặt, Hút mụn.', 55, 199000, 'Đang cung cấp', '/img/product/cat-goi-combo-2.png', 'Tư vấn kiểu tóc-Cắt tóc-Rửa mặt & Tẩy tế bào chết-Hút mụn cám-Gội đầu thảo dược-Massage đầu-Xả tóc-Sấy khô-Tạo kiểu');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DV003', 'CT', 'Cắt gội combo 3', 'Gói dịch vụ cao cấp nhất, Kết hợp cắt tạo kiểu, Gội dưỡng sinh chuyên sâu và massage cổ vai gáy.', 65, 299000, 'Đang cung cấp', '/img/product/cat-goi-combo-3.png', 'Tư vấn kiểu tóc-Cắt tóc-Gội đầu dưỡng sinh-Bấm huyệt đầu-Massage chuyên sâu cổ vai gáy-Đắp mặt nạ-Xả tóc-Sấy khô-Tạo kiểu cao cấp');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DV004', 'CT', 'Cắt xả tạo kiểu', 'Dịch vụ cắt tóc nhanh gọn, Xả sạch tóc con và sấy khô, Tạo kiểu cơ bản. Phù hợp cho người bận rộn.', 30, 80000, 'Đang cung cấp', '/img/product/cat-xa-tao-kieu.png', 'Tư vấn kiểu tóc-Cắt tóc-Xả nhanh (không gội)-Sấy khô-Tạo kiểu bằng sáp/gôm');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('DVTest', 'CT', 'Cắt gội combo 1', 'Dịch vụ cắt tóc nhanh gọn, Xả sạch tóc con và sấy khô, Tạo kiểu cơ bản. Phù hợp cho người bận rộn.', 45, 122000, 'Đang cung cấp', '/img/product/uon-tieu-chuan.jpg', 'Tư vấn kiểu tóc-Cắt tóc tạo kiểu-Gội đầu làm sạch-Massage thư giãn vùng đầu-Rửa mặt-Xả tóc-Sấy khô-Vuốt sáp tạo kiểu');
INSERT INTO `DICHVU` (`MADV`, `LOAI`, `TENDV`, `MOTA`, `THOIGIAN`, `GIADV`, `TRANGTHAI`, `HINH`, `QUYTRINH`) VALUES ('test95', 'CSD', 'Uốn Tiêu Chuẩn 222', '1', 11, 1111, 'Ngừng cung cấp', '/img/product/shine-2.jpg', '1');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('KM001', 'Giảm giá khai trương', 'Giảm 20% tất cả dịch vụ', '2025-01-01 00:00:00', '2026-12-31 00:00:00', 20, 'Đang áp dụng');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('KM0011', 'Giảm giá khai trương', '1', '2026-03-17 00:00:00', '2026-03-23 00:00:00', 1, 'Hết hạn');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('KM002', 'Thứ 4 vui vẻ', 'Giảm 15% dịch vụ cắt tóc', '2025-03-01 00:00:00', '2026-12-31 00:00:00', 15, 'Đang áp dụng');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('KM003', 'Sinh nhật khách hàng', 'Giảm 30% cho khách', '2025-01-01 00:00:00', '2026-12-31 00:00:00', 30, 'Đang áp dụng');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('KM004', 'Mùa hè sôi động', 'Combo cắt + gội chỉ 150k', '2026-05-31 00:00:00', '2027-08-31 00:00:00', 25, 'Chưa áp dụng');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('KM005', 'Khách hàng thân thiết', 'Giảm 10% tổng hóa đơn', '2025-01-01 00:00:00', '2026-12-31 00:00:00', 10, 'Đang áp dụng');
INSERT INTO `KHUYENMAI` (`MAKM`, `TENKM`, `MOTA`, `NGAYBD`, `NGAYKT`, `GIATRI`, `TRANGTHAI`) VALUES ('tets05', 'Giảm giá khai trương', '12', '2026-05-09 00:00:00', '2026-05-10 00:00:00', 1, 'Đang áp dụng');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0352512556', '1', 0, 'Khoá');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0352512557', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0352512559', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0909090909', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0909123456', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0912345678', '1', 0, 'Khoá');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0978123456', '1', 0, 'Khoá');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0987654322', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('0987678989', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('1', '1', 3, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('1212121221', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('1231231234', '1', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('1234567811', '1234567811', 0, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('admin', '1', 1, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('letan', '1', 5, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('letan1', '1', 5, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('letan2', '1', 5, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('letan3', '1', 5, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('letan4', '1', 5, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('nhanvien1', '1', 3, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('nhanvien2', '1', 3, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('nhanvien3', '1', 3, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('quanly', '1', 2, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('test', 'test', 3, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('test95', '1231231234', 2, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('thungan', '1', 4, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('thungan2', '1', 4, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('thungan3', '1', 4, 'Hoạt động');
INSERT INTO `TAIKHOAN` (`MATK`, `PASS`, `PHANQUYEN`, `TRANGTHAI`) VALUES ('thungan4', '1', 4, 'Hoạt động');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('0352512559', 'Hoang Le', '0352512559', '0352512559', 'hoangle15012005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('0909090909', 'Nguyễn Test', '0909090909', '0909090909', '3dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('0987678989', 'Test Đỗ Đạt', '0987678989', '0987678989', 'dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('1212121221', 'Nguyễn Test 2', '1212121221', '1212121221', '4dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('1231231234', 'Chien Nguyen', '1231231234', '1231231234', 'chiendz1403@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('KH001', 'Nguyễn Văn An', '0912345678', '0912345678', '5dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('KH003', 'Lê Văn Cường', '0909123456', '0909123456', '6dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('KH004', 'Phạm Thị Dung', '0987654322', '0987654322', '7dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('KH005', 'Đỗ Hữu Phúc', '0978123456', '0978123456', '8dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('KH006', 'Trần Tùng Anh', '0352512556', '0352512556', '9dotiendat092005@gmail.com');
INSERT INTO `KHACHHANG` (`MAKH`, `HOTEN`, `SDT`, `MATK`, `EMAIL`) VALUES ('KH007', 'Đỗ Tiến Đạt', '0352512557', '0352512557', '1dotiendat092005@gmail.com');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH001', '2026-03-31', '09:00:00', 'Hoàn thành', 'CN001', 'KH001');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH0011', '2026-04-02', '08:00:00', 'Hoàn thành', 'CN002', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH00111', '2026-04-02', '15:00:00', 'Hoàn thành', 'CN001', 'KH001');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH002', '2026-03-31', '10:30:00', 'Hoàn thành', 'CN001', 'KH006');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH003', '2026-04-01', '14:00:00', 'Hoàn thành', 'CN001', 'KH003');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH004', '2026-04-01', '15:00:00', 'Hoàn thành', 'CN001', 'KH004');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH177609763468168', '2026-04-14', '11:00:00', 'Hoàn thành', 'CN003', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH177609774402739', '2026-04-14', '11:00:00', 'Hoàn thành', 'CN004', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1776097857446720', '2026-04-14', '11:30:00', 'Hoàn thành', 'CN003', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1777191396355962', '2026-04-26', '16:00:00', 'Đã huỷ', 'CN001', '1212121221');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1778117943255167', '2026-05-07', '13:00:00', 'Đang chờ', 'CN002', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1778252465695806', '2026-05-09', '16:00:00', 'Đã đặt', 'CN002', '0352512559');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1778290723977933', '2026-05-01', '16:30:00', 'Đã huỷ', 'CN003', '1231231234');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1778290774295369', '2026-05-09', '15:00:00', 'Đã huỷ', 'CN003', '1231231234');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1778291401801801', '2026-05-09', '09:30:00', 'Đã huỷ', 'CN003', '1231231234');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('LH1778300750195677', '2026-05-09', '15:00:00', 'Đã đặt', 'CN001', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('test', '2026-04-06', '15:30:00', 'Hoàn thành', 'CN002', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('test1', '2026-04-07', '15:00:00', 'Đã huỷ', 'CN004', '0987678989');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('test10_4', '2026-04-10', '18:00:00', 'Hoàn thành', 'CN003', '0909090909');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('test95', '2026-05-09', '10:00:00', 'Hoàn thành', 'CN003', '1231231234');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('test99', '2026-05-09', '14:30:00', 'Đã đặt', 'CN002', 'KH003');
INSERT INTO `LICHHEN` (`MALICH`, `NGAYHEN`, `GIOHEN`, `TRANGTHAI`, `MACHINHANH`, `MAKH`) VALUES ('testLichSu', '2026-04-13', '17:30:00', 'Đã huỷ', 'CN003', '0987678989');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV001', 'Đỗ Tiến Đạt', 'Admin', '0352512556', 'Hưng Yên', 'CN001', '2005-09-01 00:00:00', 'admin');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV002', 'Lê Thị Mai', 'Stylist', '0911222333', 'Hưng Yên', 'CN001', '1997-09-25 00:00:00', 'letan');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV003', 'Nguyễn Văn Dũng', 'Stylist', '0912333444', 'Hải Dương', 'CN001', '1995-01-15 00:00:00', 'letan1');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV004', 'Đỗ Thành Đạt', 'Stylist', '0913444555', 'Hà Nam', 'CN003', '1996-08-30 00:00:00', 'nhanvien2');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV005', 'Nguyễn Tiến Đạt', 'Thu ngân', '0914555666', 'Hà Nội', 'CN001', '1998-04-12 00:00:00', 'thungan');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV006', 'Lê Quỳnh Anh', 'Thu ngân', '0352512256', 'Thái Nguyên', 'CN003', '2000-09-13 00:00:00', 'thungan2');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV007', 'Đõ Hữu Quốc Ánh', 'Quản lý', '0911111111', 'Hà Nội', 'CN002', '1985-06-10 00:00:00', 'quanly');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV008', 'Trần Minh Tâm', 'Thu ngân', '0987656789', 'Hưng Yên', 'CN002', '2005-12-04 00:00:00', 'thungan3');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV009', 'Lê Minh Anh', 'Thu ngân', '0987656788', 'Hà Nội', 'CN002', '2005-12-04 00:00:00', 'thungan4');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV010', 'Lê Quỳnh Chi', 'Stylist', '0352512251', 'Thái Bình', 'CN002', '2000-12-04 00:00:00', 'nhanvien3');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV011', 'Nguyễn Văn Đức', 'Stylist', '0352512252', 'Thái Nguyên', 'CN002', '2001-11-11 00:00:00', 'nhanvien1');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV0114', 'Độ Mích Xi', 'Thu ngân', '0312111222', 'Cao Bằng', 'CN004', '2005-03-06 00:00:00', 'letan4');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV013', 'Hoàng Minh Tân', 'Lễ tân', '0352512254', 'Cao Bằng', 'CN004', '1999-12-04 00:00:00', 'letan2');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('NV014', 'Độ Mích Xi', 'Lễ tân', '0311111222', 'Cao Bằng', 'CN004', '2005-03-06 00:00:00', 'letan3');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('test', 'test', 'Lễ tân', '0311111111', 'Cao Bằng', 'CN002', '2006-03-16 00:00:00', 'test');
INSERT INTO `NHANVIEN` (`MANV`, `HOTEN`, `CHUCVU`, `SDT`, `DIACHI`, `MACHINHANH`, `NGAYSINH`, `MATK`) VALUES ('test95', 'Đỗ Tiến Đạt 2', 'Quản lý', '1231231234', 'Cao Bằng', 'CN002', '2005-05-09 00:00:00', 'test95');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD001', NULL, 80000, 'Chuyển khoản', 'NV005', 'LH001', 'Đã thanh toán', 'KH001', '2026-03-31 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD002', NULL, 300000, 'Tiền mặt', 'NV005', 'LH002', 'Đã thanh toán', 'KH006', '2026-03-31 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD003', NULL, 50000, 'Tiền mặt', 'NV005', NULL, 'Đã thanh toán', 'KH007', '2026-04-01 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD004', NULL, 230000, 'Chuyển khoản', 'NV005', NULL, 'Đã thanh toán', 'KH007', '2026-04-02 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD005', NULL, 400000, 'Tiền mặt', 'NV005', NULL, 'Đã thanh toán', 'KH007', '2026-04-09 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2604027186', 'KM005', 122000, 'Ví điện tử', 'NV005', 'LH00111', 'Đã thanh toán', 'KH001', '2026-04-02 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD260402E6C1', NULL, 24222220, 'Thẻ tín dụng', 'NV009', 'LH0011', 'Đã thanh toán', '0987678989', '2026-04-02 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2604131833', NULL, 999999, 'Chuyển khoản', 'NV0114', 'LH177609774402739', 'Đã thanh toán', '0987678989', '2026-04-13 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD26041337E3', NULL, 400000, 'Tiền mặt', 'NV005', 'LH003', 'Đã thanh toán', 'KH003', '2026-04-13 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2604136BFE', NULL, 11111111, 'Thẻ tín dụng', 'NV006', 'test10_4', 'Đã thanh toán', '0909090909', '2026-04-13 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2604138007', NULL, 11111111, 'Thẻ tín dụng', 'NV006', 'LH177609763468168', 'Đã thanh toán', '0987678989', '2026-04-13 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2604138B2C', 'KM002', 9444444, 'Ví điện tử', 'NV006', 'LH1776097857446720', 'Đã thanh toán', '0987678989', '2026-04-13 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2604138C35', 'KM003', 35000, 'Chuyển khoản', 'NV005', 'LH004', 'Đã thanh toán', 'KH004', '2026-04-13 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('HD2605091BCE', 'KM005', 585000, 'Tiền mặt', 'NV006', 'test95', 'Đã thanh toán', '1231231234', '2026-05-09 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('test', 'KM005', 10000000, 'Tiền mặt', 'NV008', NULL, 'Đã thanh toán', '0987678989', '2026-04-02 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('test1212', NULL, 1121999, 'Tiền mặt', 'NV005', NULL, 'Đã huỷ', '0909090909', '2026-04-26 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('test2', 'KM005', 10000000, 'Ví điện tử', 'NV006', NULL, 'Đã thanh toán', '0987678989', '2026-04-02 00:00:00');
INSERT INTO `HOADON` (`MAHD`, `MAKM`, `TONGTIEN`, `HINHTHUCTHANHTOAN`, `MANV`, `MALICH`, `TRANGTHAI`, `MAKH`, `NGAYTHANHTOAN`) VALUES ('test3', 'KM003', 15752955, 'Thẻ tín dụng', 'NV008', NULL, 'Đã thanh toán', '0987678989', '2026-04-02 00:00:00');
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD001', 'DV001', 1, 50000, 50000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD001', 'DV002', 1, 30000, 30000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD002', 'DV003', 1, 300000, 300000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD003', 'DV001', 1, 50000, 50000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD004', 'DV002', 1, 30000, 30000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD004', 'DV003', 1, 200000, 200000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD005', 'DV004', 1, 400000, 400000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2604027186', 'DV001', 1, 122000, 122000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD260402E6C1', 'DV00111', 2, 999999, 1999998);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD260402E6C1', 'DV0011111', 2, 11111111, 22222222);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2604131833', 'DV00111', 1, 999999, 999999);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD26041337E3', 'DV004', 1, 400000, 400000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2604136BFE', 'DV0011111', 1, 11111111, 11111111);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2604138007', 'DV0011111', 1, 11111111, 11111111);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2604138B2C', 'DV0011111', 1, 11111111, 11111111);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2604138C35', 'DV001', 1, 50000, 50000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2605091BCE', 'CSD002', 1, 350000, 350000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('HD2605091BCE', 'CSD003', 1, 300000, 300000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test', 'DV0011111', 1, 11111111, 11111111);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test1212', 'DV001', 1, 122000, 122000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test1212', 'DV00111', 1, 999999, 999999);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test2', 'DV0011111', 1, 11111111, 11111111);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test3', 'DV001', 1, 122000, 122000);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test3', 'DV0011111', 2, 11111111, 22222222);
INSERT INTO `CHITIETHOADON` (`MAHD`, `MADV`, `SOLUONG`, `DONGIA`, `THANHTIEN`) VALUES ('test3', 'DV004', 2, 80000, 160000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH001', 'DV001', 1, 'Cắt layer', 'NV001', 50000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH001', 'DV002', 1, 'Gội thảo dược', 'NV002', 30000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH0011', 'DV00111', 2, 'Không có ghi chú', 'NV010', 999999);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH0011', 'DV0011111', 2, 'Ok ok', 'NV011', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH00111', 'DV001', 1, 'Không có ghi chú', 'NV003', 122000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH002', 'DV003', 1, 'Nhuộm nâu lạnh', 'NV001', 300000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH003', 'DV004', 1, 'Uốn phồng chân tóc', 'NV003', 400000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH004', 'DV001', 1, 'Cắt ngắn', 'NV002', 50000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH177609763468168', 'DV0011111', 1, 'Không có gì', 'NV004', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH177609774402739', 'DV00111', 1, 'Không có ghi chú', 'test', 999999);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1776097857446720', 'DV0011111', 1, 'Không có ghi chú', 'NV004', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1777191396355962', 'DV002', 1, 'không có nhu cầu nữa', 'NV002', 199000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778117943255167', 'DV00111', 1, 'Tóc mình hơi mỏng', 'NV011', 999999);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778252465695806', 'DV00111', 1, 'không', 'NV010', 999999);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778252465695806', 'DV0011111', 1, 'Không có ghi chú', 'NV011', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778290723977933', 'DV001', 1, 'không có nhu cầu nữa', 'NV004', 122000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778290774295369', 'DV0011111', 1, 'không có nhu cầu nữa', 'NV004', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778291401801801', 'DV001', 1, 'không có nhu cầu nữa', 'NV004', 122000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('LH1778300750195677', 'DV00111', 1, 'Không có ghi chú', 'NV002', 999999);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test', 'DV0011111', 2, 'Không có ghi chú', 'NV011', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test1', 'DV004', 1, 'Không có ghi chú', 'test', 80000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test10_4', 'DV0011111', 1, 'Không có ghi chú', 'NV004', 11111111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test95', 'CSD002', 1, 'Không có ghi chú', 'NV004', 350000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test95', 'CSD003', 1, 'Không có ghi chú', 'NV004', 300000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test99', 'DV004', 4, 'Không có ghi chú', 'NV010', 320000);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('test99', 'test95', 3, 'Không có ghi chú', 'NV010', 1111);
INSERT INTO `CHITIETLICHHEN` (`MALICH`, `MADV`, `SOLUONG`, `GHICHU`, `MANV`, `GIA_DUKIEN`) VALUES ('testLichSu', 'DV00111', 1, 'không có nhu cầu nữa', 'NV004', 999999);

SELECT * FROM CHINHANH;
SELECT * FROM CHITIETHOADON;
SELECT * FROM CHITIETLICHHEN;
SELECT * FROM DICHVU;
SELECT * FROM HOADON;
SELECT * FROM KHACHHANG;
SELECT * FROM KHUYENMAI;
SELECT * FROM LICHHEN;
SELECT * FROM NHANVIEN;
SELECT * FROM TAIKHOAN;
use dhair;

-- ============================================================
-- TRIGGERS
-- SQL Server trigger on CHITIETHOADON handled 3 events at once.
-- MySQL requires one trigger per event, so it is split into 3.
-- ============================================================

DROP TRIGGER IF EXISTS `TRG_TuDongTaoHoaDonTuLichHenDaHoanThanh`;
DELIMITER $$
CREATE TRIGGER `TRG_TuDongTaoHoaDonTuLichHenDaHoanThanh`
AFTER UPDATE ON `LICHHEN`
FOR EACH ROW
BEGIN
    DECLARE v_MAHD CHAR(20);
    DECLARE v_TONGTIEN INT DEFAULT 0;

    IF NEW.TRANGTHAI = 'Hoàn thành'
       AND NOT (OLD.TRANGTHAI <=> 'Hoàn thành') THEN

        SET v_MAHD = CONCAT(
            'HD', DATE_FORMAT(NOW(), '%y%m%d'),
            UPPER(SUBSTRING(REPLACE(UUID(), '-', ''), 1, 4))
        );

        SELECT COALESCE(SUM(COALESCE(SOLUONG, 0) * COALESCE(GIA_DUKIEN, 0)), 0)
          INTO v_TONGTIEN
          FROM CHITIETLICHHEN
         WHERE MALICH = NEW.MALICH;

        INSERT INTO HOADON
            (MAHD, MAKH, MALICH, MAKM, MANV, TRANGTHAI,
             TONGTIEN, HINHTHUCTHANHTOAN, NGAYTHANHTOAN)
        VALUES
            (v_MAHD, NEW.MAKH, NEW.MALICH, NULL, NULL, 'Chưa thanh toán',
             v_TONGTIEN, NULL, NOW());

        INSERT INTO CHITIETHOADON (MAHD, MADV, SOLUONG, DONGIA, THANHTIEN)
        SELECT v_MAHD, MADV, SOLUONG, GIA_DUKIEN,
               COALESCE(SOLUONG, 0) * COALESCE(GIA_DUKIEN, 0)
          FROM CHITIETLICHHEN
         WHERE MALICH = NEW.MALICH;
    END IF;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `TRG_CapNhatTongTien_CTHD_AI`;
DELIMITER $$
CREATE TRIGGER `TRG_CapNhatTongTien_CTHD_AI`
AFTER INSERT ON `CHITIETHOADON`
FOR EACH ROW
BEGIN
    UPDATE HOADON H
    LEFT JOIN KHUYENMAI KM ON H.MAKM = KM.MAKM
    SET H.TONGTIEN = CAST(
        COALESCE((SELECT SUM(C.THANHTIEN)
                    FROM CHITIETHOADON C
                   WHERE C.MAHD = NEW.MAHD), 0)
        * (1 - COALESCE(KM.GIATRI, 0) / 100.0)
        AS SIGNED)
    WHERE H.MAHD = NEW.MAHD
      AND H.TRANGTHAI = 'Chưa thanh toán';
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `TRG_CapNhatTongTien_CTHD_AU`;
DELIMITER $$
CREATE TRIGGER `TRG_CapNhatTongTien_CTHD_AU`
AFTER UPDATE ON `CHITIETHOADON`
FOR EACH ROW
BEGIN
    UPDATE HOADON H
    LEFT JOIN KHUYENMAI KM ON H.MAKM = KM.MAKM
    SET H.TONGTIEN = CAST(
        COALESCE((SELECT SUM(C.THANHTIEN)
                    FROM CHITIETHOADON C
                   WHERE C.MAHD = NEW.MAHD), 0)
        * (1 - COALESCE(KM.GIATRI, 0) / 100.0)
        AS SIGNED)
    WHERE H.MAHD = NEW.MAHD
      AND H.TRANGTHAI = 'Chưa thanh toán';

    IF NOT (OLD.MAHD <=> NEW.MAHD) THEN
        UPDATE HOADON H
        LEFT JOIN KHUYENMAI KM ON H.MAKM = KM.MAKM
        SET H.TONGTIEN = CAST(
            COALESCE((SELECT SUM(C.THANHTIEN)
                        FROM CHITIETHOADON C
                       WHERE C.MAHD = OLD.MAHD), 0)
            * (1 - COALESCE(KM.GIATRI, 0) / 100.0)
            AS SIGNED)
        WHERE H.MAHD = OLD.MAHD
          AND H.TRANGTHAI = 'Chưa thanh toán';
    END IF;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `TRG_CapNhatTongTien_CTHD_AD`;
DELIMITER $$
CREATE TRIGGER `TRG_CapNhatTongTien_CTHD_AD`
AFTER DELETE ON `CHITIETHOADON`
FOR EACH ROW
BEGIN
    UPDATE HOADON H
    LEFT JOIN KHUYENMAI KM ON H.MAKM = KM.MAKM
    SET H.TONGTIEN = CAST(
        COALESCE((SELECT SUM(C.THANHTIEN)
                    FROM CHITIETHOADON C
                   WHERE C.MAHD = OLD.MAHD), 0)
        * (1 - COALESCE(KM.GIATRI, 0) / 100.0)
        AS SIGNED)
    WHERE H.MAHD = OLD.MAHD
      AND H.TRANGTHAI = 'Chưa thanh toán';
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `TRG_CapNhatTongTien_HoaDon_KM`;
DELIMITER $$
CREATE TRIGGER `TRG_CapNhatTongTien_HoaDon_KM`
BEFORE UPDATE ON `HOADON`
FOR EACH ROW
BEGIN
    DECLARE v_TongThanhTien DECIMAL(20,2) DEFAULT 0;
    DECLARE v_GiaTriKM DOUBLE DEFAULT 0;

    IF NOT (OLD.MAKM <=> NEW.MAKM)
       AND NEW.TRANGTHAI IN ('Chưa thanh toán', 'Đã thanh toán', 'Đã huỷ') THEN

        SELECT COALESCE(SUM(THANHTIEN), 0)
          INTO v_TongThanhTien
          FROM CHITIETHOADON
         WHERE MAHD = NEW.MAHD;

        IF NEW.MAKM IS NOT NULL THEN
            SELECT COALESCE(MAX(GIATRI), 0)
              INTO v_GiaTriKM
              FROM KHUYENMAI
             WHERE MAKM = NEW.MAKM;
        ELSE
            SET v_GiaTriKM = 0;
        END IF;

        SET NEW.TONGTIEN = CAST(
            v_TongThanhTien * (1 - v_GiaTriKM / 100.0)
            AS SIGNED
        );
    END IF;
END$$
DELIMITER ;


ALTER TABLE TAIKHOAN
MODIFY PASS VARCHAR(255) NOT NULL;

-- ============================================================
-- DHAIR NORMALIZED SEED DATA
-- Generated for the existing DHair schema
-- Customer default password: 12345678 (bcrypt)
-- Staff default password: Dhair@123 (bcrypt)
-- PHANQUYEN: 0=Khách hàng, 1=Admin, 2=Quản lý, 3=Stylist, 4=Thu ngân, 5=Lễ tân
-- ============================================================

USE dhair;

ALTER TABLE TAIKHOAN MODIFY PASS VARCHAR(255) NOT NULL;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE CHITIETHOADON;
TRUNCATE TABLE CHITIETLICHHEN;
TRUNCATE TABLE HOADON;
TRUNCATE TABLE LICHHEN;
TRUNCATE TABLE NHANVIEN;
TRUNCATE TABLE KHACHHANG;
TRUNCATE TABLE TAIKHOAN;
TRUNCATE TABLE KHUYENMAI;
TRUNCATE TABLE DICHVU;
TRUNCATE TABLE CHINHANH;
SET FOREIGN_KEY_CHECKS = 1;


-- 1. CHI NHÁNH
INSERT INTO CHINHANH (MACHINHANH, TENCHINHANH, DIACHI, SDT) VALUES
('CN001', 'DHair - Nguyễn Trãi', '120 Nguyễn Trãi, Thanh Xuân, Hà Nội', '0247301001'),
('CN002', 'DHair - Cầu Giấy', '165 Cầu Giấy, Cầu Giấy, Hà Nội', '0247301002'),
('CN003', 'DHair - Tân Bình', '327 Trường Chinh, Tân Bình, TP.HCM', '0287301003'),
('CN004', 'DHair - Hải Châu', '78 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', '0236730104');


-- 2. DỊCH VỤ: mã chuẩn DV001...DV010
INSERT INTO DICHVU (MADV, LOAI, TENDV, MOTA, THOIGIAN, GIADV, TRANGTHAI, HINH, QUYTRINH) VALUES
('DV001', 'CT', 'Cắt xả tạo kiểu', 'Cắt tóc theo kiểu phù hợp khuôn mặt, xả sạch tóc con, sấy và tạo kiểu hoàn thiện.', 30, 80000, 'Đang cung cấp', '/img/product/cat-xa-tao-kieu.png', 'Tư vấn kiểu tóc-Cắt tóc-Xả sạch-Sấy khô-Tạo kiểu'),
('DV002', 'CT', 'Cắt gội tiêu chuẩn', 'Gói cắt và gội cơ bản, phù hợp khách hàng cần chăm sóc nhanh và gọn.', 45, 120000, 'Đang cung cấp', '/img/product/cat-goi-combo-1-1.jpg', 'Tư vấn kiểu tóc-Cắt tóc-Gội đầu-Massage đầu-Xả tóc-Sấy khô-Tạo kiểu'),
('DV003', 'CT', 'Cắt gội thư giãn', 'Gói cắt tóc kết hợp gội thảo dược và massage thư giãn vùng đầu, cổ và vai gáy.', 60, 180000, 'Đang cung cấp', '/img/product/cat-goi-combo-2.png', 'Tư vấn kiểu tóc-Cắt tóc-Gội thảo dược-Massage đầu-Massage cổ vai gáy-Xả tóc-Sấy khô-Tạo kiểu'),
('DV004', 'CT', 'Uốn tóc tiêu chuẩn', 'Uốn tạo kiểu theo chất tóc, sử dụng thuốc uốn phù hợp và chăm sóc tóc sau uốn.', 120, 450000, 'Đang cung cấp', '/img/product/uon-tieu-chuan.jpg', 'Tư vấn kiểu uốn-Gội làm sạch-Cắt chỉnh form-Vào thuốc uốn-Định hình-Xả thuốc-Dưỡng tóc-Sấy tạo kiểu'),
('DV005', 'CT', 'Nhuộm tóc thời trang', 'Nhuộm tóc một màu theo bảng màu salon, bao gồm tư vấn màu và chăm sóc tóc sau nhuộm.', 150, 500000, 'Đang cung cấp', '/img/product/shine-2.jpg', 'Tư vấn màu-Kiểm tra nền tóc-Pha thuốc-Nhuộm tóc-Ủ màu-Xả sạch-Dưỡng tóc-Sấy tạo kiểu'),
('DV006', 'CT', 'Phục hồi Keratin', 'Phục hồi tóc khô xơ bằng Keratin, giúp tóc mềm, giảm rối và tăng độ bóng.', 90, 350000, 'Đang cung cấp', '/img/product/cat-goi-combo-3-1.jpg', 'Kiểm tra tóc-Gội làm sạch-Thoa Keratin-Ủ dưỡng-Xả tóc-Sấy và hoàn thiện'),
('DV007', 'CSD', 'Gội đầu dưỡng sinh', 'Gội đầu kết hợp bấm huyệt và massage cổ vai gáy giúp thư giãn.', 60, 200000, 'Đang cung cấp', '/img/product/goi-thu-gian-1.png', 'Rửa mặt-Massage mặt-Gội đầu-Bấm huyệt đầu-Massage cổ vai gáy-Xả tóc-Sấy khô'),
('DV008', 'CSD', 'Chăm sóc da cơ bản', 'Làm sạch, cấp ẩm và chăm sóc da mặt cơ bản theo quy trình tiêu chuẩn.', 50, 250000, 'Đang cung cấp', '/img/product/goi-thu-gian-3.png', 'Tẩy trang-Rửa mặt-Tẩy tế bào chết-Xông hơi-Massage mặt-Đắp mặt nạ-Thoa kem dưỡng'),
('DV009', 'CSD', 'Lấy mụn chuyên sâu', 'Làm sạch mụn bằng dụng cụ vô trùng, sát khuẩn và làm dịu da sau xử lý.', 70, 350000, 'Đang cung cấp', '/img/product/goi-thu-gian-2.png', 'Tẩy trang-Rửa mặt-Xông hơi-Lấy mụn-Sát khuẩn-Điện tím-Đắp mặt nạ-Chiếu đèn-Thoa dưỡng'),
('DV010', 'CSD', 'Massage cổ vai gáy', 'Massage thư giãn vùng cổ, vai và gáy, hỗ trợ giảm căng cơ do ngồi lâu.', 45, 180000, 'Đang cung cấp', '/img/product/goi-thu-gian.png', 'Khởi động-Thả lỏng vai-Ấn huyệt cổ vai gáy-Massage chuyên sâu-Chườm ấm-Kết thúc');


-- 3. KHUYẾN MÃI: mã chuẩn KM001...KM005
INSERT INTO KHUYENMAI (MAKM, TENKM, MOTA, NGAYBD, NGAYKT, GIATRI, TRANGTHAI) VALUES
('KM001', 'Khách hàng mới', 'Giảm 10% hóa đơn đầu tiên cho khách hàng mới.', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 10, 'Đang áp dụng'),
('KM002', 'Khách hàng thân thiết', 'Giảm 15% cho khách hàng thuộc chương trình thành viên.', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 15, 'Đang áp dụng'),
('KM003', 'Ưu đãi sinh nhật', 'Giảm 20% hóa đơn trong tháng sinh nhật của khách hàng.', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 20, 'Đang áp dụng'),
('KM004', 'Ưu đãi tháng 10', 'Giảm 10% tổng hóa đơn trong tháng 10/2026.', '2026-10-01 00:00:00', '2026-10-31 23:59:59', 10, 'Đang áp dụng'),
('KM005', 'Ưu đãi cuối năm', 'Giảm 15% tổng hóa đơn trong chương trình cuối năm.', '2026-11-01 00:00:00', '2026-12-31 23:59:59', 15, 'Chưa áp dụng');


-- 4. TÀI KHOẢN NHÂN VIÊN + KHÁCH HÀNG
-- Nhân viên: MATK = MANV. Khách hàng: MATK = MAKH = SDT.
INSERT INTO TAIKHOAN (MATK, PASS, PHANQUYEN, TRANGTHAI) VALUES
('NV001', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 1, 'Hoạt động'),
('NV002', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 2, 'Hoạt động'),
('NV003', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 5, 'Hoạt động'),
('NV004', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 4, 'Hoạt động'),
('NV005', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV006', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV007', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV008', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV009', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 2, 'Hoạt động'),
('NV010', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 5, 'Hoạt động'),
('NV011', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 4, 'Hoạt động'),
('NV012', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV013', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV014', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV015', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV016', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 2, 'Hoạt động'),
('NV017', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 5, 'Hoạt động'),
('NV018', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 4, 'Hoạt động'),
('NV019', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV020', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV021', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV022', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV023', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 2, 'Hoạt động'),
('NV024', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 5, 'Hoạt động'),
('NV025', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 4, 'Hoạt động'),
('NV026', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV027', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV028', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('NV029', '$2b$10$GfbbjDlnmXiK.XFGpEH35eSnsI6i7PFfJGnq9RnCIjBDs3y1behH2', 3, 'Hoạt động'),
('0902000001', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000002', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000003', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000004', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000005', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000006', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000007', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000008', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000009', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000010', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000011', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động'),
('0902000012', '$2b$10$IAcixGDjbg2OqNAZC5cU4.bq.Oqaqj2wRP.tLKqElIn7B2S.yurp2', 0, 'Hoạt động');


-- 5. KHÁCH HÀNG: MAKH luôn là số điện thoại
INSERT INTO KHACHHANG (MAKH, HOTEN, SDT, MATK, EMAIL) VALUES
('0902000001', 'Nguyễn Văn An', '0902000001', '0902000001', 'an.nguyen@example.com'),
('0902000002', 'Trần Minh Đức', '0902000002', '0902000002', 'duc.tran@example.com'),
('0902000003', 'Lê Hoàng Nam', '0902000003', '0902000003', 'nam.le@example.com'),
('0902000004', 'Phạm Quỳnh Anh', '0902000004', '0902000004', 'anh.pham@example.com'),
('0902000005', 'Vũ Hải Yến', '0902000005', '0902000005', 'yen.vu@example.com'),
('0902000006', 'Đặng Quốc Việt', '0902000006', '0902000006', 'viet.dang@example.com'),
('0902000007', 'Nguyễn Thùy Linh', '0902000007', '0902000007', 'linh.nguyen@example.com'),
('0902000008', 'Trần Đức Long', '0902000008', '0902000008', 'long.tran@example.com'),
('0902000009', 'Lê Minh Châu', '0902000009', '0902000009', 'chau.le@example.com'),
('0902000010', 'Phan Anh Dũng', '0902000010', '0902000010', 'dung.phan@example.com'),
('0902000011', 'Võ Ngọc Lan', '0902000011', '0902000011', 'lan.vo@example.com'),
('0902000012', 'Bùi Gia Hân', '0902000012', '0902000012', 'han.bui@example.com');


-- 6. NHÂN VIÊN: MANV đồng thời là tên đăng nhập MATK
INSERT INTO NHANVIEN (MANV, HOTEN, CHUCVU, SDT, DIACHI, MACHINHANH, NGAYSINH, MATK) VALUES
('NV001', 'Đỗ Tiến Đạt', 'Admin', '0903000001', 'Hà Nội', 'CN001', '1995-09-01 00:00:00', 'NV001'),
('NV002', 'Nguyễn Quốc Huy', 'Quản lý', '0903000002', 'Hà Nội', 'CN001', '1992-04-18 00:00:00', 'NV002'),
('NV003', 'Trần Thu Hà', 'Lễ tân', '0903000003', 'Hà Nội', 'CN001', '1999-08-21 00:00:00', 'NV003'),
('NV004', 'Lê Minh Anh', 'Thu ngân', '0903000004', 'Hà Nội', 'CN001', '1998-12-04 00:00:00', 'NV004'),
('NV005', 'Phạm Đức Anh', 'Stylist', '0903000005', 'Hà Nội', 'CN001', '1997-03-12 00:00:00', 'NV005'),
('NV006', 'Nguyễn Quang Tấn', 'Stylist', '0903000006', 'Hà Nội', 'CN001', '1996-07-23 00:00:00', 'NV006'),
('NV007', 'Phạm Hải Hưng', 'Stylist', '0903000007', 'Hà Nội', 'CN001', '1998-11-15 00:00:00', 'NV007'),
('NV008', 'Nguyễn Tuấn Thành', 'Stylist', '0903000008', 'Hà Nội', 'CN001', '2000-01-28 00:00:00', 'NV008'),
('NV009', 'Vũ Hoàng Long', 'Quản lý', '0903000009', 'Hà Nội', 'CN002', '1991-05-06 00:00:00', 'NV009'),
('NV010', 'Nguyễn Ngọc Mai', 'Lễ tân', '0903000010', 'Hà Nội', 'CN002', '2000-02-19 00:00:00', 'NV010'),
('NV011', 'Trần Khánh Linh', 'Thu ngân', '0903000011', 'Hà Nội', 'CN002', '1999-06-25 00:00:00', 'NV011'),
('NV012', 'Lê Đức Minh', 'Stylist', '0903000012', 'Hà Nội', 'CN002', '1997-09-14 00:00:00', 'NV012'),
('NV013', 'Đặng Tuấn Kiệt', 'Stylist', '0903000013', 'Hà Nội', 'CN002', '1996-12-09 00:00:00', 'NV013'),
('NV014', 'Hoàng Gia Bảo', 'Stylist', '0903000014', 'Hà Nội', 'CN002', '1998-04-03 00:00:00', 'NV014'),
('NV015', 'Bùi Thành Nam', 'Stylist', '0903000015', 'Hà Nội', 'CN002', '2001-10-17 00:00:00', 'NV015'),
('NV016', 'Nguyễn Minh Quân', 'Quản lý', '0903000016', 'TP.HCM', 'CN003', '1990-08-30 00:00:00', 'NV016'),
('NV017', 'Phạm Thảo Vy', 'Lễ tân', '0903000017', 'TP.HCM', 'CN003', '2000-05-11 00:00:00', 'NV017'),
('NV018', 'Võ Ngọc Trâm', 'Thu ngân', '0903000018', 'TP.HCM', 'CN003', '1998-01-22 00:00:00', 'NV018'),
('NV019', 'Trần Gia Huy', 'Stylist', '0903000019', 'TP.HCM', 'CN003', '1997-02-16 00:00:00', 'NV019'),
('NV020', 'Lê Hoàng Phúc', 'Stylist', '0903000020', 'TP.HCM', 'CN003', '1996-06-08 00:00:00', 'NV020'),
('NV021', 'Nguyễn Đức Thịnh', 'Stylist', '0903000021', 'TP.HCM', 'CN003', '1999-09-27 00:00:00', 'NV021'),
('NV022', 'Phan Nhật Minh', 'Stylist', '0903000022', 'TP.HCM', 'CN003', '2001-03-05 00:00:00', 'NV022'),
('NV023', 'Đặng Quốc Bảo', 'Quản lý', '0903000023', 'Đà Nẵng', 'CN004', '1991-11-12 00:00:00', 'NV023'),
('NV024', 'Lê Thanh Hương', 'Lễ tân', '0903000024', 'Đà Nẵng', 'CN004', '1999-04-24 00:00:00', 'NV024'),
('NV025', 'Nguyễn Ngọc Anh', 'Thu ngân', '0903000025', 'Đà Nẵng', 'CN004', '1998-07-07 00:00:00', 'NV025'),
('NV026', 'Trần Minh Khang', 'Stylist', '0903000026', 'Đà Nẵng', 'CN004', '1997-01-19 00:00:00', 'NV026'),
('NV027', 'Phạm Quốc Khánh', 'Stylist', '0903000027', 'Đà Nẵng', 'CN004', '1996-10-02 00:00:00', 'NV027'),
('NV028', 'Võ Thành Công', 'Stylist', '0903000028', 'Đà Nẵng', 'CN004', '2000-12-13 00:00:00', 'NV028'),
('NV029', 'Nguyễn Anh Tú', 'Stylist', '0903000029', 'Đà Nẵng', 'CN004', '2001-08-31 00:00:00', 'NV029');


-- 7. LỊCH HẸN: MALICH theo format LH + 18 ký tự UUID không dấu gạch ngang
INSERT INTO LICHHEN (MALICH, NGAYHEN, GIOHEN, TRANGTHAI, MACHINHANH, MAKH) VALUES
('LH387d6061823a494d93', '2026-09-20', '09:00:00', 'Hoàn thành', 'CN001', '0902000001'),
('LH200da8d3d564405aa2', '2026-09-22', '14:00:00', 'Hoàn thành', 'CN002', '0902000002'),
('LH9a613fab6cb6478896', '2026-09-25', '10:30:00', 'Hoàn thành', 'CN003', '0902000003'),
('LH1f6d6c7563f240b8b0', '2026-09-28', '15:00:00', 'Hoàn thành', 'CN004', '0902000004'),
('LH0e4c65a7d2234f06a6', '2026-10-01', '09:30:00', 'Hoàn thành', 'CN001', '0902000005'),
('LHa44044002e2a42ca95', '2026-10-02', '16:00:00', 'Hoàn thành', 'CN002', '0902000006'),
('LH1e873a4ee2a14012bd', '2026-10-03', '13:30:00', 'Hoàn thành', 'CN003', '0902000007'),
('LH8b0c0d5788c948bcae', '2026-10-04', '11:00:00', 'Hoàn thành', 'CN004', '0902000008'),
('LHde139ee10eb84877b5', '2026-10-05', '17:00:00', 'Hoàn thành', 'CN001', '0902000009'),
('LH1fba93e64ac14a2a8e', '2026-10-06', '10:00:00', 'Đang thực hiện', 'CN002', '0902000010'),
('LHb5c3113d67d34cd697', '2026-10-06', '18:00:00', 'Đã đặt', 'CN003', '0902000011'),
('LHe313535560aa43e88e', '2026-10-07', '09:00:00', 'Đã đặt', 'CN004', '0902000012'),
('LHdda47b7ac6dc4c4da5', '2026-10-08', '14:30:00', 'Đang chờ', 'CN001', '0902000001'),
('LH27e7de270115495689', '2026-10-09', '16:30:00', 'Đã huỷ', 'CN002', '0902000002'),
('LH64721f3203c9470a9b', '2026-10-10', '10:30:00', 'Đã đặt', 'CN003', '0902000003');


-- 8. CHI TIẾT LỊCH HẸN: GIA_DUKIEN là ĐƠN GIÁ snapshot, không phải thành tiền
INSERT INTO CHITIETLICHHEN (MALICH, MADV, SOLUONG, GHICHU, MANV, GIA_DUKIEN) VALUES
('LH387d6061823a494d93', 'DV002', 1, 'Cắt gọn hai bên, giữ độ dài phần mái.', 'NV005', 120000),
('LH387d6061823a494d93', 'DV010', 1, 'Massage nhẹ vùng vai gáy.', 'NV006', 180000),
('LH200da8d3d564405aa2', 'DV004', 1, 'Uốn phồng tự nhiên, không quá xoăn.', 'NV012', 450000),
('LH9a613fab6cb6478896', 'DV007', 1, 'Ưu tiên lực massage vừa.', 'NV019', 200000),
('LH9a613fab6cb6478896', 'DV008', 1, 'Da hơi khô, cần cấp ẩm.', 'NV020', 250000),
('LH1f6d6c7563f240b8b0', 'DV005', 1, 'Nhuộm màu nâu lạnh.', 'NV026', 500000),
('LH0e4c65a7d2234f06a6', 'DV003', 1, 'Cắt layer, giữ form tự nhiên.', 'NV007', 180000),
('LH0e4c65a7d2234f06a6', 'DV006', 1, 'Tóc khô phần ngọn.', 'NV008', 350000),
('LHa44044002e2a42ca95', 'DV001', 1, 'Cắt ngắn gọn để đi làm.', 'NV013', 80000),
('LH1e873a4ee2a14012bd', 'DV009', 1, 'Tập trung vùng mũi và cằm.', 'NV021', 350000),
('LH8b0c0d5788c948bcae', 'DV002', 1, 'Cắt gọn theo kiểu công sở.', 'NV027', 120000),
('LH8b0c0d5788c948bcae', 'DV007', 1, 'Gội thư giãn sau cắt.', 'NV028', 200000),
('LHde139ee10eb84877b5', 'DV004', 1, 'Uốn nhẹ phần mái và đỉnh đầu.', 'NV005', 450000),
('LHde139ee10eb84877b5', 'DV006', 1, 'Phục hồi sau uốn.', 'NV006', 350000),
('LH1fba93e64ac14a2a8e', 'DV003', 1, 'Cắt và gội, tạo kiểu tự nhiên.', 'NV014', 180000),
('LHb5c3113d67d34cd697', 'DV005', 1, 'Dự kiến nhuộm nâu chocolate.', 'NV022', 500000),
('LHe313535560aa43e88e', 'DV008', 1, 'Chăm sóc da cơ bản, da nhạy cảm.', 'NV029', 250000),
('LHdda47b7ac6dc4c4da5', 'DV001', 1, 'Cắt gọn, không dùng nhiều sáp.', 'NV008', 80000),
('LH27e7de270115495689', 'DV004', 1, 'Khách hủy do thay đổi lịch cá nhân.', 'NV015', 450000),
('LH64721f3203c9470a9b', 'DV007', 1, 'Gội dưỡng sinh thư giãn.', 'NV019', 200000),
('LH64721f3203c9470a9b', 'DV010', 1, 'Massage cổ vai gáy mức vừa.', 'NV020', 180000);


-- 9. HÓA ĐƠN: dữ liệu thanh toán khớp lịch hẹn và chi nhánh
INSERT INTO HOADON (MAHD, MAKM, TONGTIEN, HINHTHUCTHANHTOAN, MANV, MALICH, TRANGTHAI, MAKH, NGAYTHANHTOAN) VALUES
('HD3e9afcc44a3f4c7b8b', 'KM001', 270000, 'Chuyển khoản', 'NV004', 'LH387d6061823a494d93', 'Đã thanh toán', '0902000001', '2026-09-20 10:20:00'),
('HD3461dcdc7bb54c328b', NULL, 450000, 'Tiền mặt', 'NV011', 'LH200da8d3d564405aa2', 'Đã thanh toán', '0902000002', '2026-09-22 16:10:00'),
('HD3d21c6124f8b4db6b8', 'KM002', 382500, 'Ví điện tử', 'NV018', 'LH9a613fab6cb6478896', 'Đã thanh toán', '0902000003', '2026-09-25 12:20:00'),
('HD5471eae3fd0a49d3ba', 'KM003', 400000, 'Thẻ tín dụng', 'NV025', 'LH1f6d6c7563f240b8b0', 'Đã thanh toán', '0902000004', '2026-09-28 17:40:00'),
('HDd9f81c78f0384109a4', 'KM004', 477000, 'Chuyển khoản', 'NV004', 'LH0e4c65a7d2234f06a6', 'Đã thanh toán', '0902000005', '2026-10-01 11:50:00'),
('HD6537c005a92d4e95a2', NULL, 80000, 'Tiền mặt', 'NV011', 'LHa44044002e2a42ca95', 'Đã thanh toán', '0902000006', '2026-10-02 16:45:00'),
('HDb56dd007a925457a81', 'KM001', 315000, 'Ví điện tử', 'NV018', 'LH1e873a4ee2a14012bd', 'Đã thanh toán', '0902000007', '2026-10-03 15:00:00'),
('HDf5ab9da6ba1744db95', NULL, 320000, 'Chuyển khoản', 'NV025', 'LH8b0c0d5788c948bcae', 'Đã thanh toán', '0902000008', '2026-10-04 12:30:00'),
('HD4e3bbea68f4a470b8f', 'KM004', 720000, NULL, NULL, 'LHde139ee10eb84877b5', 'Chưa thanh toán', '0902000009', NULL);


-- 10. CHI TIẾT HÓA ĐƠN
INSERT INTO CHITIETHOADON (MAHD, MADV, SOLUONG, DONGIA, THANHTIEN) VALUES
('HD3e9afcc44a3f4c7b8b', 'DV002', 1, 120000, 120000),
('HD3e9afcc44a3f4c7b8b', 'DV010', 1, 180000, 180000),
('HD3461dcdc7bb54c328b', 'DV004', 1, 450000, 450000),
('HD3d21c6124f8b4db6b8', 'DV007', 1, 200000, 200000),
('HD3d21c6124f8b4db6b8', 'DV008', 1, 250000, 250000),
('HD5471eae3fd0a49d3ba', 'DV005', 1, 500000, 500000),
('HDd9f81c78f0384109a4', 'DV003', 1, 180000, 180000),
('HDd9f81c78f0384109a4', 'DV006', 1, 350000, 350000),
('HD6537c005a92d4e95a2', 'DV001', 1, 80000, 80000),
('HDb56dd007a925457a81', 'DV009', 1, 350000, 350000),
('HDf5ab9da6ba1744db95', 'DV002', 1, 120000, 120000),
('HDf5ab9da6ba1744db95', 'DV007', 1, 200000, 200000),
('HD4e3bbea68f4a470b8f', 'DV004', 1, 450000, 450000),
('HD4e3bbea68f4a470b8f', 'DV006', 1, 350000, 350000);


-- 11. KIỂM TRA SAU KHI SEED
SELECT MACHINHANH, CHUCVU, COUNT(*) AS SOLUONG
FROM NHANVIEN
GROUP BY MACHINHANH, CHUCVU
ORDER BY MACHINHANH, CHUCVU;

SELECT COUNT(*) AS SO_ADMIN
FROM NHANVIEN
WHERE CHUCVU = 'Admin';

SELECT COUNT(*) AS KHACH_HANG_SAI_MA
FROM KHACHHANG
WHERE MAKH <> SDT OR MATK <> SDT;

SELECT COUNT(*) AS NHAN_VIEN_SAI_TAI_KHOAN
FROM NHANVIEN
WHERE MANV <> MATK;

SELECT COUNT(*) AS LICH_SAI_FORMAT
FROM LICHHEN
WHERE MALICH NOT REGEXP '^LH[0-9a-fA-F]{18}$';

SELECT H.MAHD, H.TONGTIEN, H.TRANGTHAI, H.MAKM, L.MACHINHANH, H.MAKH
FROM HOADON H
LEFT JOIN LICHHEN L ON L.MALICH = H.MALICH
ORDER BY H.NGAYTHANHTOAN IS NULL, H.NGAYTHANHTOAN;
