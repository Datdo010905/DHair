# Danh mục API hiện có

Sinh từ routes trong source; cột middleware chỉ phản ánh middleware gắn tại route, không đảm bảo toàn bộ kiểm tra quyền bên trong controller. Xem BAO_CAO_RA_SOAT.md về các API legacy.

## dichVuRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/dichvu/get-all-DichVuToc` | `dichVuController.getDichVuToc` |
| GET | `/api/dichvu/get-all-DichVuCungCap` | `dichVuController.getAllDichVuCungCap` |
| GET | `/api/dichvu/get-all-DichVuCSD` | `dichVuController.getDichVuCSD` |
| GET | `/api/dichvu/get-all-DichVuChamSocDA` | `dichVuController.getDichVuChamSocDaAll` |
| GET | `/api/dichvu/get-all-DichVu` | `dichVuController.getDichVuTocAll` |
| GET | `/api/dichvu/get-DichVuByID/:id` | `dichVuController.getDichVuByID` |
| POST | `/api/dichvu/create-DichVu` | `upload.single('fileAnh'), dichVuController.createDichVu` |
| PUT | `/api/dichvu/update-DichVu` | `upload.single('fileAnh'), dichVuController.updateDichVu` |
| DELETE | `/api/dichvu/delete-DichVu/:id` | `dichVuController.deleteDichVu` |

## hoaDonRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/hoadon/get-all-HoaDon` | `hoaDonController.getAll` |
| GET | `/api/hoadon/get-byId-HoaDon/:id` | `hoaDonController.getByID` |
| POST | `/api/hoadon/insert-HoaDon` | `hoaDonController.create` |
| PUT | `/api/hoadon/update-HoaDon/:id` | `hoaDonController.update` |
| DELETE | `/api/hoadon/delete-HoaDon/:id` | `hoaDonController.remove` |
| GET | `/api/hoadon/get-all-hoadonTheoNgay` | `hoaDonController.getAllTheoNgay` |
| GET | `/api/hoadon/get-all-CTHoaDon` | `hoaDonController.getAllCT` |
| GET | `/api/hoadon/get-byId-CTHoaDon/:id` | `hoaDonController.getCTByID` |
| POST | `/api/hoadon/insert-CTHoaDon` | `hoaDonController.createCT` |
| DELETE | `/api/hoadon/delete-CTHoaDon/:id` | `hoaDonController.removeCT` |
| POST | `/api/hoadon/insert-HoaDonvaChiTiet` | `hoaDonController.createFull` |
| DELETE | `/api/hoadon/delete-HoaDonvaChiTiet/:id` | `hoaDonController.deleteFull` |

## khachHangRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/khachhang/me` | `profileController.requireSession, profileController.get` |
| PUT | `/api/khachhang/me` | `profileController.requireSession, profileController.update` |
| GET | `/api/khachhang/get-all-khachhang` | `khachHangController.getAll` |
| GET | `/api/khachhang/get-byId-khachhang/:id` | `khachHangController.getByID` |
| POST | `/api/khachhang/insert-khachhangVoiTaiKhoan` | `khachHangController.createCustomerWithAccount` |
| PUT | `/api/khachhang/update-khachhang/:id` | `khachHangController.update` |
| DELETE | `/api/khachhang/delete-khachhang/:id` | `khachHangController.remove` |
| DELETE | `/api/khachhang/delete-full/:id` | `khachHangController.deleteFullCustomerTransaction` |
| PUT | `/api/khachhang/update-profile/:id` | `khachHangController.updateProfileFull` |

## khuyenMaiRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/khuyenmai/get-all-KhuyenMai` | `khuyenMaiController.getAll` |
| GET | `/api/khuyenmai/get-byId-KhuyenMai/:id` | `khuyenMaiController.getByID` |
| POST | `/api/khuyenmai/insert-KhuyenMai` | `khuyenMaiController.create` |
| PUT | `/api/khuyenmai/update-KhuyenMai/:id` | `khuyenMaiController.update` |
| DELETE | `/api/khuyenmai/delete-KhuyenMai/:id` | `khuyenMaiController.remove` |

## lichHenRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/lichhen/cancellation-reasons` | `bookingController.requireCustomerSession, bookingController.cancellationReasons,` |
| GET | `/api/lichhen/operations/board` | `...staffSession, salon.board` |
| POST | `/api/lichhen/operations/walk-in` | `...staffSession, salon.walkIn` |
| POST | `/api/lichhen/operations/leave` | `...staffSession, salon.leave` |
| POST | `/api/lichhen/operations/:id/queue` | `...staffSession, salon.queue` |
| POST | `/api/lichhen/operations/:id/extend` | `...staffSession, salon.extend` |
| POST | `/api/lichhen/operations/:id/reschedule` | `...staffSession, salon.reschedule` |
| GET | `/api/lichhen/operations/:id/history` | `...staffSession, salon.history` |
| POST | `/api/lichhen/operations/:id/invoice` | `...staffSession, salon.invoice` |
| GET | `/api/lichhen/admin-list` | `bookingController.requireCustomerSession, lichHenController.getAdminBookings,` |
| GET | `/api/lichhen/history` | `bookingController.requireCustomerSession, bookingController.history` |
| POST | `/api/lichhen/:id/cancel` | `bookingController.requireCustomerSession, bookingController.cancel` |
| GET | `/api/lichhen/booking-options` | `bookingController.options` |
| GET | `/api/lichhen/availability` | `bookingController.availability` |
| POST | `/api/lichhen/book` | `bookingController.create` |
| GET | `/api/lichhen/get-all-lichhen` | `lichHenController.getAll` |
| GET | `/api/lichhen/get-byId-lichhen/:id` | `lichHenController.getByID` |
| GET | `/api/lichhen/get-byIdKH-lichhen/:id` | `lichHenController.getByIDKH` |
| GET | `/api/lichhen/get-byIdNV-lichhen/:id` | `lichHenController.getByNhanVien` |
| POST | `/api/lichhen/insert-lichhen` | `lichHenController.create` |
| PUT | `/api/lichhen/update-lichhen/:id` | `...staffSession, lichHenController.updateStatus` |
| DELETE | `/api/lichhen/delete-lichhen/:id` | `lichHenController.remove` |
| GET | `/api/lichhen/get-all-lichhenTheoNgay` | `lichHenController.getAllTheoNgay` |
| GET | `/api/lichhen/get-all-CTlichhen` | `lichHenController.getAllCT` |
| GET | `/api/lichhen/get-byId-CTlichhen/:id` | `lichHenController.getCTByID` |
| POST | `/api/lichhen/insert-CTlichhen` | `...staffSession, lichHenController.createCT` |
| PUT | `/api/lichhen/update-CTlichhen/:id` | `lichHenController.updateCT` |
| DELETE | `/api/lichhen/delete-CTlichhen/:id` | `lichHenController.removeCT` |
| POST | `/api/lichhen/create-full` | `bookingController.createFull` |
| DELETE | `/api/lichhen/delete-full/:id` | `lichHenController.deleteFullBookingTransaction` |

## loginRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| POST | `/api/login/login-taikhoan` | `loginController.dangNhap` |

## nhanVienRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/nhanvien/get-all-nhanvien` | `nhanVienController.getAll` |
| GET | `/api/nhanvien/get-byId-nhanvien/:id` | `nhanVienController.getByID` |
| POST | `/api/nhanvien/insert-nhanvien` | `nhanVienController.create` |
| PUT | `/api/nhanvien/update-nhanvien/:id` | `nhanVienController.update` |
| DELETE | `/api/nhanvien/delete-nhanvien/:id` | `nhanVienController.remove` |
| POST | `/api/nhanvien/insert-full` | `nhanVienController.createWithAccount` |
| DELETE | `/api/nhanvien/delete-full/:id` | `nhanVienController.deleteFullStaffTransaction` |

## taiKhoanRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/taikhoan/get-all-taikhoan` | `taiKhoanController.getAll` |
| GET | `/api/taikhoan/get-byId-taikhoan/:id` | `taiKhoanController.getByID` |
| PUT | `/api/taikhoan/update-taikhoan/:id` | `taiKhoanController.update` |
| DELETE | `/api/taikhoan/delete-taikhoan/:id` | `taiKhoanController.remove` |
| POST | `/api/taikhoan/insert-taikhoan` | `taiKhoanController.create` |
| PUT | `/api/taikhoan/change-password` | `profileController.requireSession, taiKhoanController.changePassword` |
| POST | `/api/taikhoan/forgot-password` | `taiKhoanController.forgotPassword` |

## thongKeRoutes.js

| HTTP | Đường dẫn | Middleware / controller |
| --- | --- | --- |
| GET | `/api/baocao/thongke/doanh-thu` | `thongKeController.getDoanhThuTheoThang` |
| GET | `/api/baocao/thongke/trang-thai-lich` | `thongKeController.getThongKeTrangThaiLich` |
| GET | `/api/baocao/thongke/khung-gio` | `thongKeController.getThongKeKhungGio` |

