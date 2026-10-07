# Báo cáo rà soát DHair — 07/10/2026

## Phạm vi và giới hạn

Rà soát cấu trúc, quan hệ import, routes/API, các service nghiệp vụ chính, cấu hình, tài nguyên, test, build và tài liệu của BE/Admin/FE. Không phải kiểm toán bảo mật hoàn chỉnh, không kiểm chứng mọi thao tác bằng điện thoại thật, không xác nhận SMTP hoặc cổng thanh toán bên ngoài. Các thay đổi người dùng đã có trước đợt rà soát được giữ, gồm cấu hình API LAN mobile.

## Đã dọn và sửa

| Phần | Thay đổi |
| --- | --- |
| Mobile assets | Bỏ 143 ảnh không được source/config tham chiếu, 19.570.120 byte (~18,7 MiB). Danh sách tại removed-mobile-assets.txt. Giữ avatar, logo và 9 banner đang dùng |
| Mobile template | Bỏ scripts/reset-project.js và lệnh reset-project có thể xóa source; thêm npm run typecheck |
| Mobile config | Sửa icon/splash/favicon trỏ tới file không tồn tại, dùng asset DHair thật; loại cấu hình iOS Expo template khỏi app.json |
| Admin dead files | Bỏ data/static_content.ts, utils/bookingSchema.ts, assets/css/reset.css không có tham chiếu; hoadonSchema.ts không còn dùng sau khi bỏ nhánh tạo hóa đơn thủ công |
| Admin hóa đơn | Bỏ nhánh modal add/checkout không thể mở từ giao diện; giữ API backend và thêm dịch vụ hóa đơn lẻ vì vẫn là luồng có thể dùng |
| Admin quyền | PrivateRoute trả redirect ngay nếu thiếu token/quyền; sửa trường hợp thiếu role vẫn được cho render |
| Lý do hủy | Danh mục lý do chỉ cần phiên hợp lệ; middleware điều phối trước đó chặn stylist lấy danh mục. Quyền ghi vẫn kiểm tra riêng |
| Báo cáo | Top dịch vụ lấy hóa đơn đã thanh toán đang lọc, cộng số lượng; top thợ lấy lịch hoàn thành đang lọc. Năm mặc định theo Việt Nam thay vì cố định 2026 |
| Web template | Sửa manifest/metadata DHair và đường dẫn logo không tồn tại |
| Script | npm test BE chạy bộ test thật; build Admin bỏ cú pháp CI=false không tương thích PowerShell; thêm lint Admin |
| Dependencies Admin | Gỡ @hookform/resolvers, react-hook-form, web-vitals không có caller và @types/react-router-dom v5 không phù hợp router v7; cập nhật package-lock bằng npm offline |
| Code | Dọn import/biến không dùng, debug comment/URL cũ, định dạng JS/TS/TSX/CSS, thêm chú thích các luồng quan trọng; thêm editorconfig/prettier config |
| Tài liệu | Viết lại README gốc và README từng app, luồng nghiệp vụ/câu hỏi bảo vệ và danh mục API |

Đây là giảm dung lượng source và cải thiện khả năng bảo trì. Không khẳng định app nhanh hơn một tỷ lệ cụ thể: chưa đo benchmark; bundler thường đã không đóng gói ảnh không được tham chiếu.

## Những phần cố ý giữ

- `DHair_BE/uploads`: ảnh có thể được DB tham chiếu, không thể kết luận thừa chỉ bằng import.
- `DHair_Admin/public/img`: trang giới thiệu có đường dẫn tĩnh và dữ liệu nội dung; chưa xóa hàng loạt.
- SQL nâng cấp, seed, script trigger và `invoice-completion-trigger.backup.sql`: phục vụ cài đặt/khôi phục dù không import vào app.
- Routes Expo, file khai báo kiểu, Babel/Metro/Tailwind: công cụ tự tìm bằng quy ước.
- Lockfiles, test, hướng dẫn AGENTS/CLAUDE, license và cấu hình IDE.
- Endpoint CRUD cũ: có thể còn client ngoài repo; không xóa hợp đồng API chỉ vì không thấy caller nội bộ.
- Node_modules/build/dist là đầu ra hoặc dependencies, không phải mã nghiệp vụ để xóa trong đợt này.

## Thiếu sót còn lại theo ưu tiên

### P0 — Phân quyền API và danh tính khi ghi

**Bằng chứng:** `src/routes/taiKhoanRoutes.js`, `hoaDonRoutes.js`, `dichVuRoutes.js`, nhiều route khách/nhân viên/khuyến mãi không gắn middleware quyền. `bookingController.create/createFull` nhận mã khách/tài khoản từ body; `/book` và `/create-full` chưa bắt buộc xác thực như `/history`.

**Hậu quả:** chặn nút/menu phía React không ngăn gọi API trực tiếp; có nguy cơ đọc/sửa dữ liệu hoặc đặt lịch cho người khác. Cần ma trận quyền server cho từng route, kiểm tra tài khoản còn hoạt động, phạm vi chi nhánh/chủ sở hữu, và test 401/403 cho từng vai trò. Đợt dọn này không khôi phục toàn bộ gói bảo mật từng được yêu cầu rollback.

### P1 — Quên mật khẩu và vòng đời token

**Bằng chứng:** `taiKhoanController.forgotPassword` sinh mật khẩu 6 số bằng Math.random, đổi hash trước khi biết gửi email thành công; mail gửi nền. `mailService` trả false khi SMTP lỗi nhưng API vẫn có thể báo thành công. JWT hiện không bị thu hồi tự động sau đổi mật khẩu; mobile phiên nằm trong Context, web token ở localStorage.

**Cần làm:** luồng reset có mã/link một lần, hết hạn, giới hạn thử, chỉ xác nhận thành công khi đúng kết quả; quy định thu hồi/refresh token. Không coi email+SDT là quy trình xác minh đầy đủ.

### P1 — Upload dịch vụ

**Bằng chứng:** `dichVuRoutes.js` dùng file.originalname làm tên lưu và multer chưa có giới hạn dung lượng/loại file ở cấu hình hiện tại.

**Cần làm:** bảo vệ quyền upload, tên do server sinh, kiểm tra định dạng/nội dung/kích thước, tránh ghi đè ảnh cùng tên, quy trình xóa ảnh có kiểm tra DB.

### P1 — Bootstrap DB và trigger

`dhair.sql` còn trigger phiên bản cũ; Prisma schema không cài trigger. README yêu cầu chạy update-invoice-trigger.js sau import. Chưa có lịch sử Prisma Migrate đầy đủ; SQL salon-operations không được chạy lặp trên DB đã nâng cấp. Seed cần kiểm tra mật khẩu bcrypt và thông tin cá nhân trước khi chia sẻ. Không sửa dữ liệu thật hoặc reset database trong đợt rà soát.

Lịch hoàn thành có hóa đơn bị hủy không tự sinh lại vì trigger chỉ chạy khi chuyển trạng thái. Cần chọn nghiệp vụ: cấm hủy hóa đơn liên quan, cho lập thay thế có audit, hoặc quy trình điều chỉnh riêng. Không tự tạo lại khi người dùng chưa quyết định.

### P1 — Lý do hủy chưa đồng nhất lúc hiển thị

Admin/job ghi LICHHEN.LYDOHUY, khách tự hủy còn ghi GHICHU của chi tiết. `bookingHistoryService.formatAppointment` và mobile đọc note từ GHICHU, chưa đưa LYDOHUY thành trường riêng. Lịch tự hủy/admin hủy có thể không thấy lý do đúng trên mobile. Cần trả cancellationReason cấp lịch và giữ ghi chú dịch vụ riêng; có kế hoạch tương thích dữ liệu cũ.

### P2 — Chỉ số và thời gian báo cáo

Đã sửa top theo dữ liệu lọc/năm động, nhưng còn:

- `thongKeController.getDoanhThuTheoThang`: lọc cuối năm bằng <= ngày 31/12 lúc 00:00, có thể thiếu giao dịch cuối ngày; dùng timezone máy cho năm/tháng. Nên dùng khoảng [đầu năm VN, đầu năm sau VN).
- Biểu đồ tháng là cả năm còn một số thẻ theo khoảng ngày; cần nhãn/phạm vi thống nhất.
- Top thợ đếm dòng dịch vụ, không phải số lịch duy nhất. Chốt định nghĩa trước khi đổi tên chỉ số.
- Khung giờ đếm cả lịch hủy theo code hiện tại; cần nói rõ là nhu cầu đặt lịch hay khách được phục vụ.

### P2 — Công cụ và chất lượng code

- Admin TypeScript 4.9 không đọc một số khai báo Zod 4; tsconfig có ignoreDeprecations 6.0 không đồng bộ compiler. Cần nâng đồng bộ toolchain hoặc chọn Zod tương thích trong đợt riêng có lockfile/test; không tắt typecheck để che lỗi.
- Nhiều controller/service tự tạo PrismaClient, cần cân nhắc một client dùng chung để hạn chế connection pool.
- Một số trang lớn còn state/form cũ, any, CSS chồng lớp và comment lịch sử; định dạng toàn source chưa phải refactor kiến trúc hoàn chỉnh.
- Frontend chưa có test E2E cho hủy/thu tiền/đổi lịch; chưa đo hiệu năng query/pagination toàn bộ CRUD.

### P2 — Chức năng minh họa và triển khai

- Mobile QuickActions/Hotline còn nút chưa có onPress; RatingCard không phải dữ liệu đánh giá thật; chatbot web đang phát triển.
- Chưa có online payment, đặt cọc, webhook, đối soát, hoàn tiền hay push.
- API URLs còn localhost/LAN; cần cấu hình env khi triển khai. Không dùng IP máy người viết làm cấu hình chung.
- Icon/splash đã có file thật nhưng chưa kiểm tra hình thức native trên Android/iOS. Export web không thay native build.
- CORS đang mở; cần chính sách deployment, HTTPS, backup và quản lý secrets trước khi public.

## Kiểm chứng

- BE: 46/46 test qua khi bật RUN_SALON_DB_TESTS=1, gồm MySQL điều phối → hóa đơn; fixture rollback.
- FE: tsc --noEmit qua; Expo export --platform web qua, 20 static routes.
- Admin: CRA production build cuối báo Compiled successfully; lint toàn source không còn lỗi/cảnh báo. Build chạy lại sau khi dọn nhánh hóa đơn và dependencies.
- tsc Admin độc lập vẫn bị lỗi dependency Zod/TypeScript đã nêu; không được tính là qua.
- Chưa chạy E2E browser/điện thoại, load test, SMTP thật hoặc kiểm toán an ninh toàn diện.

## Cách đọc để bảo vệ

Đọc README để chạy → LUONG_CHUC_NANG.md để giải thích → API_ROUTES.md để tra URL → mở service/trigger tương ứng → chạy test làm bằng chứng. Khi được hỏi tính năng chưa có, nêu rõ hiện trạng và giới hạn thay vì mô tả như đã triển khai.
