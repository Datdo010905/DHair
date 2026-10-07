# DHair — Giải thích luồng chức năng và câu hỏi bảo vệ

Tài liệu đối chiếu source ngày 07/10/2026. Đây là mô tả hệ thống hiện có, không phải danh sách tính năng dự kiến. Tên file dưới đây tính từ gốc repository. Tra từng URL/middleware ở [API_ROUTES.md](API_ROUTES.md); xem giới hạn ở [BAO_CAO_RA_SOAT.md](BAO_CAO_RA_SOAT.md).

## 1. Đọc dự án theo thứ tự nào?

1. `DHair_BE/prisma/schema.prisma`: cấu trúc dữ liệu và quan hệ.
2. `DHair_BE/src/server.js` → `app.js`: mở API, gắn routes và khởi động tác vụ tự hủy.
3. `DHair_BE/src/routes/`: HTTP nào gọi controller nào, có middleware hay không.
4. `controllers/`: nhận dữ liệu HTTP, xác thực ở những route được bảo vệ, trả success/message/data.
5. `services/`: truy vấn Prisma, kiểm tra nghiệp vụ, transaction. Riêng thống kê vẫn truy vấn trong controller.
6. Web: `src/index.tsx` → `App.tsx` → `pages/` → `api/axiosClient.ts` và API theo nhóm.
7. Mobile: `src/app/_layout.tsx` → màn hình Expo Router → `features/` → `services/endpoints.ts`.

Ví dụ một yêu cầu: người dùng bấm nút → hàm xử lý ở màn hình → Axios/fetch → route Express → controller → service → Prisma/MySQL → JSON → cập nhật state → React render lại. Trigger SQL là ngoại lệ: MySQL tự chạy khi thay đổi bảng, không cần frontend gọi API tạo hóa đơn.

## 2. Dữ liệu và vai trò

| Bảng | Vai trò / liên kết |
| --- | --- |
| TAIKHOAN | MATK, mật khẩu bcrypt, quyền, trạng thái; liên kết khách hoặc nhân viên |
| KHACHHANG | Hồ sơ, số điện thoại, email; có thể chưa có tài khoản với khách trực tiếp |
| NHANVIEN | Chức vụ, chi nhánh, tài khoản; stylist gắn ở từng chi tiết lịch |
| CHINHANH | Địa điểm phục vụ, nhân viên, lịch |
| DICHVU | Nhóm CT/CSD, giá, thời lượng, trạng thái, ảnh, mô tả |
| LICHHEN | Ngày/giờ hẹn, khách, chi nhánh, trạng thái, các mốc thực tế, lý do hủy |
| CHITIETLICHHEN | Khóa ghép MALICH + MADV; số lượng, stylist, giá tổng đã chốt, thời lượng một đơn vị, phát sinh |
| HANGDOI | Một bản ghi cho một lịch; giờ vào/gọi và trạng thái hàng đợi |
| LICHNGHI | Khoảng nghỉ gốc của nhân viên, lý do; đệm tính trong code |
| LICHSULICH | Ai thao tác, lúc nào, nội dung thay đổi điều phối |
| HOADON | Lịch liên quan, khách, thu ngân, khuyến mãi, tổng, phương thức, thời điểm thanh toán |
| CHITIETHOADON | Khóa ghép MAHD + MADV; số lượng, đơn giá, thành tiền |
| KHUYENMAI | Thời hạn, trạng thái và phần trăm giảm |

Quyền giao diện: 0 khách hàng; 1 quản trị; 2 quản lý; 3 stylist; 4 thu ngân; 5 lễ tân. Xem `App.tsx`, `PrivateRoute.tsx`, `salonOperationsController.requireStaff`. **Ẩn menu không thay thế phân quyền API**: nhiều API cũ chưa được bảo vệ đầy đủ.

## 3. Đăng nhập, đăng ký, đăng xuất

**Ở đâu:** BE `loginController`, `taiKhoanService`, `khachHangService`; web `LoginPage`, `SignupPage`, `AuthContext`; mobile `features/auth/`.

- Đăng nhập gửi username/pass đến `/api/login/login-taikhoan`.
- Backend tìm MATK, `bcrypt.compare` mật khẩu, kiểm tra Hoạt động/Khóa, lấy tên hồ sơ rồi ký JWT chứa MaTK và PhanQuyen. Không trả hash mật khẩu trong phản hồi đăng nhập.
- Web giữ token/quyền trong localStorage; Axios thêm `Authorization: Bearer ...`. Mobile giữ user/token trong React Context, gửi token tại các API cần phiên.
- Đăng ký khách dùng `/api/khachhang/insert-khachhangVoiTaiKhoan`; backend tạo tài khoản và khách liên kết. Kiểm tra lại các trường quyền từ request là hạng mục bảo mật cần hoàn thiện.
- Đăng xuất xóa phiên phía giao diện. Chưa có refresh token hoặc danh sách thu hồi JWT. Mobile đóng ứng dụng rồi mở lại sẽ cần đăng nhập lại.

**Giảng viên hỏi “JWT khác mật khẩu ở đâu?”** Mật khẩu được kiểm tra bằng bcrypt lúc đăng nhập; JWT là vé phiên có chữ ký và hạn dùng. Việc localStorage có giá trị quyền không chứng minh người gọi có quyền ở backend.

## 4. Hồ sơ, đổi và quên mật khẩu

**Ở đâu:** BE `profileController`, `profileService`, `taiKhoanController`, `mailService`; web `ProfilePage`, `ForgotPage`; mobile `features/profile/`, `ForgotPasswordForm`.

- GET/PUT `/api/khachhang/me` lấy mã tài khoản từ token rồi tìm khách tương ứng. Cho sửa tên/email; không nhận mã chủ sở hữu do client tùy ý gửi.
- Đổi mật khẩu: xác thực token, kiểm tra mật khẩu cũ với bcrypt, hash mật khẩu mới và cập nhật.
- Quên mật khẩu hiện nhận email + số điện thoại, tạo mật khẩu tạm, lưu hash rồi gửi Gmail qua Nodemailer. **Chưa phải luồng OTP/link xác nhận**. Code hiện gửi nền, có thể trả thành công trước khi biết email đã gửi được; cần cải thiện trước khi dùng thật.

## 5. Danh mục, tìm kiếm và chi tiết dịch vụ

**Ở đâu:** BE `dichVuRoutes/Controller/Service`; web `DichVuPage`, `HairAndSkincare`, `DichVuDetailsPage`; mobile `features/services/`, `home`, `search`, `services/[id]`.

- Danh mục khách chỉ lấy dịch vụ đang cung cấp. Mobile dùng hook tải dịch vụ, tìm kiếm/lọc tại thiết bị; chọn dịch vụ mở màn hình chi tiết theo MADV.
- CT là dịch vụ tóc, CSD là chăm sóc da. `getAll()` của web thực tế chỉ lấy CT; `getAllCSD()` lấy CSD. Báo cáo/hóa đơn cần ghép cả hai và giữ dịch vụ ngừng cung cấp để đọc lịch sử.
- Ảnh từ `HINH` được mobile ghép với API_BASE_URL nếu là đường dẫn tương đối. Backend phục vụ thư mục uploads ở `/img/product`.
- Quản trị thêm/sửa dịch vụ dùng multipart/form-data, ảnh qua Multer; xóa chịu ràng buộc khóa ngoại. Không xóa ảnh uploads chỉ vì không thấy import: đường dẫn có thể nằm trong DB.
- Chọn đặt lịch từ chi tiết mobile lưu dịch vụ trong AsyncStorage để chuyển màn hình/tiếp tục sau đăng nhập. Đây chỉ là lựa chọn dịch vụ, không phải nơi lưu phiên.

## 6. Đặt lịch và chống trùng giờ

**Ở đâu:** `bookingService.getOptions/getAvailability/createBooking`, `bookingAvailability`, `salonTime`; web `components/ui/DatLich.tsx`, mobile `app/(tabs)/booking.tsx`.

1. Tải chi nhánh, chọn chi nhánh rồi tải stylist của chi nhánh có chức vụ Stylist.
2. Chọn dịch vụ, số lượng, ngày; gọi `/api/lichhen/availability` lấy giờ có thể phục vụ.
3. Backend kiểm tra dịch vụ đang cung cấp, nhân viên đúng chi nhánh, cửa sổ 5 ngày (hôm nay đến +4), giờ Việt Nam 08:00–22:00. Loại giờ đã qua, lịch bận và lịch nghỉ có đệm.
4. Thời gian cần = thời lượng dịch vụ × số lượng. Khoảng giao nhau được loại; hai khoảng tiếp giáp được phép.
5. Gửi `/book` trên mobile hoặc `/create-full` trên web. Adapter payload cũ cũng gọi chung service tạo lịch.
6. Trong transaction, khóa chi nhánh rồi nhân viên bằng `SELECT ... FOR UPDATE`, kiểm tra giờ lại và lưu lịch + chi tiết. Nếu giờ đã có người đặt, trả 409.
7. Giá/thời lượng lấy từ server; `GIA_DUKIEN` là tổng cả dòng, `THOILUONG` là một đơn vị. Đổi giá danh mục sau này không được nhân/chốt lại giá lịch cũ tùy tiện.

**Câu hỏi:** “Frontend đã kiểm tra trống, tại sao backend kiểm tra lại?” Vì hai khách có thể cùng nhìn thấy một giờ trống. Khóa và kiểm tra trong transaction bảo vệ lần ghi; chỉ lọc ở giao diện không chống được race condition.

**Giới hạn hiện tại:** các endpoint tạo lịch cũ còn nhận mã khách/tài khoản từ request mà chưa ràng buộc đầy đủ bằng JWT. Chống trùng giờ không có nghĩa là đã chống giả mạo danh tính.

## 7. Lịch sử và hủy

**Ở đâu:** `bookingHistoryService`, `bookingController`; web `LichSuPage`, admin `BookingPage`, mobile `AppointmentHistory` + `CancelAppointmentModal`.

- `/history` lấy khách theo token, trả lịch + chi tiết + danh sách `cancellationReasons`.
- Danh sách lý do khai báo một chỗ trong `bookingHistoryService.js`. Admin đọc `/cancellation-reasons`; quyền ghi vẫn kiểm tra ở API cập nhật trạng thái.
- Khách chỉ tự hủy khi Đã đặt. “Khác” phải nhập nội dung, tổng ghi chú không quá 200 ký tự.
- API khách dùng updateMany với điều kiện mã lịch + chủ sở hữu + trạng thái. Trạng thái đổi ngay trước khi ghi thì yêu cầu bị từ chối; cập nhật lý do và chi tiết nằm trong transaction.
- Hủy khách lưu `LYDOHUY` đồng thời thay ghi chú của các chi tiết. Hủy bởi admin lưu `LYDOHUY` theo luồng điều phối.
- Mobile hiện hiển thị lý do qua ghi chú chi tiết, nên lý do do admin/tự hủy chỉ lưu ở LICHHEN chưa được hiển thị đầy đủ. Đây là thiếu sót có thật, xem báo cáo rà soát.

## 8. Tự hủy nếu khách chưa đến

**Ở đâu:** `jobs/bookingNoShowJob.js`, `services/bookingNoShowService.js`, khởi động trong `server.js`.

- Chạy ngay khi server khởi động rồi theo chu kỳ một phút; có chống chạy chồng trong một tiến trình.
- Chỉ hủy Đã đặt/Đang chờ, `THOIGIANDEN IS NULL`, và thời điểm hẹn nhỏ hơn hiện tại trừ 10 phút. Đúng 10 phút chưa hủy.
- `NGAYHEN` là DATE, `GIOHEN` là TIME. SQL ghép bằng `TIMESTAMP(NGAYHEN,GIOHEN)`; mốc so sánh được đổi sang giờ Việt Nam. Không lấy timezone máy chủ để đoán giờ hẹn.
- UPDATE kèm điều kiện trạng thái/giờ đến nên nếu lễ tân vừa xác nhận đến, job không ghi đè.
- Server tắt thì job không chạy; khi mở lại có thể hủy những lịch quá hạn bị bỏ lỡ. Giao diện cần tải lại, chưa có push notification.

## 9. Điều phối salon

**Ở đâu:** `SalonOperationsPanel.tsx`, `salonOperationsController`, `salonOperationsService`, `salonTime`; chi tiết vận hành ở [SALON_OPERATIONS.md](../DHair_BE/SALON_OPERATIONS.md).

| Thao tác | Xử lý chính |
| --- | --- |
| Nhận khách trực tiếp | Tìm/tạo khách theo số điện thoại; tạo lượt; kiểm tra stylist hoặc đưa hàng đợi |
| Xác nhận đã đến | Ghi THOIGIANDEN; job không tự hủy nữa |
| Bắt đầu phục vụ | Kiểm tra xung đột, ghi BATDAUTHUCTE và KETTHUCDUKIEN |
| Gọi khách / nhận khách trong hàng | HANGDOI lưu giờ vào/gọi; khi nhận kiểm tra lại nhân viên, đổi trạng thái phục vụ |
| Khách rời hàng | Đổi trạng thái hàng và hủy lượt kèm lý do |
| Thêm dịch vụ phát sinh | Kiểm tra dịch vụ, giá/thời lượng từ DB, xung đột; đánh dấu PHATSINH |
| Kéo dài | Cập nhật dự kiến, cảnh báo ảnh hưởng; không âm thầm dời lịch khách khác |
| Đổi giờ / stylist | Kiểm tra khả dụng rồi chuyển cả lượt và chi tiết sang thời gian/thợ mới |
| Nhân viên nghỉ | Lưu khoảng nghỉ gốc, trả lịch ảnh hưởng; thêm 30 phút đệm lúc tính khả dụng |
| Hoàn thành | Ghi KETTHUCTHUCTE, đổi trạng thái, trigger tạo hóa đơn |

“Đang chờ” của lịch là đã duyệt, chưa xác nhận có mặt; khác hàng đợi vận hành trong HANGDOI. Nghỉ 11:00–12:30 thì bắt đầu nhận lại từ 13:00. Một stylist phục vụ cả lượt khi đổi/xếp hàng; chưa mô hình hóa ghế hoặc công đoạn song song.

## 10. Hóa đơn, giảm giá và thanh toán

**Ở đâu:** `prisma/invoice-completion-trigger.sql`, `invoiceWorkflow`, `hoaDonService/Controller`; web `HoaDonPage`.

1. Lịch chuyển từ trạng thái khác sang Hoàn thành → trigger kiểm tra chưa có hóa đơn còn hiệu lực.
2. Tạo hóa đơn Chưa thanh toán, sao chép đủ chi tiết ban đầu/phát sinh, `NGAYTHANHTOAN = NULL`.
3. Tổng trước giảm = SUM(GIA_DUKIEN), không nhân lại số lượng. Đơn giá chi tiết = giá dòng / số lượng (làm tròn).
4. Thu ngân mở hóa đơn, chọn khuyến mãi, thu ngân đúng chi nhánh, phương thức và trạng thái Đã thanh toán.
5. Service khóa dữ liệu, kiểm tra hóa đơn còn nháp, đồng bộ chi tiết từ lịch, kiểm tra hạn/trạng thái/phần trăm khuyến mãi. Tiền = làm tròn(tổng × (1 − %/100)).
6. Server ghi giờ thu tiền. Hóa đơn đã thanh toán/hủy không sửa; chỉ hóa đơn hủy được xóa. Hóa đơn gắn lịch không tự thêm dịch vụ riêng.

Chọn “Chuyển khoản/Ví điện tử” hiện chỉ là ghi nhận phương thức, **không phải tích hợp cổng thanh toán**. Chưa có webhook, đối soát, đặt cọc hoặc hoàn tiền.

Trigger chỉ chạy khi đổi trạng thái. Nếu hóa đơn của lịch hoàn thành bị hủy thì không có lần chuyển trạng thái mới để tự tạo lại; cần quy trình xử lý riêng. API tạo hóa đơn vẫn được giữ để tương thích, giao diện đã bỏ nút tạo thủ công.

**Câu hỏi:** “Transaction có rollback trigger không?” Với các bảng transactional như InnoDB, trigger chạy cùng giao dịch cập nhật lịch; test MySQL hiện dùng transaction và rollback dữ liệu fixture. DDL tạo/drop trigger lại không phải một transaction nghiệp vụ tương tự.

## 11. CRUD quản trị và báo cáo

| Tính năng | Web → backend | Cách hoạt động |
| --- | --- | --- |
| Tài khoản | AccountPage → taiKhoanController/Service | Tạo, sửa quyền/trạng thái, xóa; hash khi tạo; không trả PASS ở danh sách |
| Khách hàng | CustomerPage → khachHangController/Service | Hồ sơ, tạo kèm tài khoản, cập nhật và tìm kiếm |
| Nhân viên | StaffPage → nhanVienController/Service | Hồ sơ/chức vụ/chi nhánh; ảnh hưởng khả dụng và vai trò thu ngân/stylist |
| Khuyến mãi | KhuyenMaiPage → khuyenMaiController/Service | Danh mục ưu đãi; lúc thu tiền service kiểm tra lại hạn và trạng thái |
| Dịch vụ | DichVuPage → dichVuController/Service | Hai nhóm CT/CSD, ảnh, trạng thái cung cấp |
| Dashboard | DashBoardPage → các API danh mục/lịch | Đếm khách, nhân viên, dịch vụ, tài khoản, khuyến mãi và lịch hôm nay |
| Báo cáo | ReportPage → thongKeController và API hóa đơn/lịch | Doanh thu đã thanh toán; trạng thái/khung giờ; top dịch vụ/thợ; xuất Excel |

Sau đợt dọn: top dịch vụ giới hạn theo hóa đơn Đã thanh toán đang được lọc và cộng số lượng; top stylist chỉ lấy chi tiết của lịch Hoàn thành đang được lọc. Năm biểu đồ mặc định lấy năm Việt Nam hiện tại. Biểu đồ doanh thu tháng là dữ liệu cả năm, chưa theo khoảng ngày như tất cả thẻ khác; giao diện cần thống nhất thêm. Top stylist hiện đếm dòng chi tiết, không phải số lượt duy nhất — phải giải thích đúng chỉ số khi bảo vệ.

## 12. Nội dung giới thiệu, hỗ trợ và các phần chưa có nghiệp vụ

Web `HomePage`, `AboutPage`, `TopthoPage`, `Product`, `Slideshow` chứa nội dung/ảnh giới thiệu, không tương đương hệ quản trị nội dung. Chatbot đang là nút thông báo tính năng phát triển, chưa có AI/chat server. Mobile QuickActions và Hotline còn nút chưa nối xử lý; năm ngôi sao trong RatingCard là trang trí, không phải điểm đánh giá tổng hợp. Không trình bày các phần này như đã có đầy đủ backend.

## 13. Kịch bản demo và câu hỏi thường gặp

1. Đăng ký/đăng nhập khách → mở dịch vụ → đặt lịch trong 5 ngày.
2. Mở web admin cùng dữ liệu; xác nhận đến, bắt đầu, thêm dịch vụ, hoàn thành.
3. Sang hóa đơn: có hóa đơn nháp; chọn khuyến mãi/thu ngân, thanh toán; kiểm tra báo cáo.
4. Tạo lịch khác rồi khách hủy bằng lý do; kiểm tra admin thấy trạng thái/lý do.
5. Ghi nghỉ 11:00–12:30; chứng minh API chỉ cho nhận lại từ 13:00 nếu không có lịch khác.
6. Demo xung đột bằng hai phiên cùng chọn một slot: lần ghi sau phải bị từ chối.
7. Tự hủy: dùng database thử nghiệm và mốc giờ phù hợp, không chỉnh hàng loạt dữ liệu thật để demo.

| Câu hỏi | Trả lời ngắn |
| --- | --- |
| Vì sao không xóa dịch vụ cũ? | Hóa đơn/lịch sử vẫn tham chiếu; ngừng cung cấp giữ được lịch sử |
| Vì sao snapshot giá/thời lượng? | Sửa danh mục không làm thay đổi giá/giờ của lịch đã chốt |
| API là nguồn sự thật gì? | Giá, khả dụng và chuyển trạng thái phải xác minh tại server, giao diện chỉ hỗ trợ nhập |
| Backend tắt có tự hủy không? | Không; job nằm trong tiến trình Node, chạy bù khi khởi động |
| Dữ liệu mobile/web có riêng không? | Cùng API và DB; state giao diện khác nhau, cần tải lại để thấy cập nhật |
| Prisma có tạo trigger không? | Schema mô tả bảng/quan hệ, trigger cài bằng SQL/script riêng |
| Hệ thống đã an toàn để public chưa? | Chưa; phải hoàn thiện phân quyền API, quên mật khẩu, upload và quản lý phiên |

## 14. Kiểm thử nằm ở đâu?

`DHair_BE/test/booking.test.js`: giờ trống, chốt giá và tranh slot; `bookingHistory.test.js`: quyền sở hữu/hủy/rollback; `bookingNoShow.test.js`: ngưỡng giờ/race/job; `profile.test.js`: hồ sơ/token; `salonOperations.test.js`: thời gian và tích hợp MySQL điều phối–hóa đơn. Chạy theo README. Build thành công không thay thế kiểm thử thủ công trên điện thoại hay kiểm toán bảo mật.
