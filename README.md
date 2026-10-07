# DHair — Đặt lịch và quản lý salon

DHair gồm mobile cho khách hàng, website khách hàng/quản trị và REST API dùng chung MySQL. Hệ thống hỗ trợ đặt lịch theo giờ trống của stylist, điều phối tại salon, tự hủy khách không đến và lập hóa đơn khi hoàn thành.

## Tài liệu

- [Luồng chức năng và câu hỏi bảo vệ](docs/LUONG_CHUC_NANG.md): làm gì, ở đâu, chạy qua những lớp nào.
- [Báo cáo rà soát](docs/BAO_CAO_RA_SOAT.md): thay đổi, kiểm chứng và thiếu sót còn lại.
- [Danh mục API](docs/API_ROUTES.md): URL, phương thức và middleware/controller.
- [Vận hành salon và nâng cấp DB cũ](DHair_BE/SALON_OPERATIONS.md).
- README riêng: [Backend](DHair_BE/README.md), [Web/Admin](DHair_Admin/README.md), [Mobile](DHair_FE/README.md).

## Công nghệ và cấu trúc

| Thư mục | Công nghệ | Vai trò |
| --- | --- | --- |
| DHair_BE | Node.js, Express 5, Prisma 6, MySQL, JWT, bcrypt, Nodemailer | API/nghiệp vụ |
| DHair_Admin | React 19, TypeScript, React Router, Axios, CRA, Recharts | Web khách/quản trị |
| DHair_FE | Expo 57, React Native 0.86, Expo Router, NativeWind | Mobile khách hàng |
| docs | Markdown | Luồng, API và rà soát |
| dhair.sql | SQL mẫu | Seed và trigger cũ; cập nhật trigger sau import |

```text
DHair_BE/src/          routes → controllers → services → Prisma/MySQL
DHair_BE/test/         unit tests và tích hợp MySQL có rollback
DHair_BE/prisma/       schema, SQL nâng cấp, trigger hóa đơn
DHair_Admin/src/       pages, components, api, context, utils, assets/css
DHair_FE/src/app/      file-based routing của Expo
DHair_FE/src/features/ auth, services, booking, history, profile, home
```

Mỗi ứng dụng có package.json/lockfile riêng. Cài trong đúng thư mục, không npm install tại gốc. Không xóa route Expo chỉ vì không thấy import trực tiếp.

## Chức năng hiện có

- Đăng nhập/đăng ký/quên mật khẩu; hồ sơ và đổi mật khẩu đã nối API.
- Tra cứu dịch vụ CT/CSD, chi tiết, đặt lịch và lịch sử thật trên web/mobile.
- Đặt lịch trong 5 ngày, phục vụ 08:00–22:00 giờ Việt Nam; chống xung đột tại server.
- Khách hủy lịch Đã đặt với lý do chung; admin dùng luồng trạng thái riêng.
- Khách trực tiếp, hàng đợi, xác nhận đến, dịch vụ phát sinh, kéo dài, đổi giờ/thợ, nghỉ có 30 phút đệm.
- Job mỗi phút hủy lịch quá giờ hẹn 10 phút nếu chưa đến.
- Trigger tạo hóa đơn nháp khi hoàn thành; thu tiền, khuyến mãi, báo cáo và Excel.

Chưa có thanh toán online/đặt cọc/hoàn tiền, push notification, quản lý ghế hoặc đánh giá thật. Chatbot và một số nút giới thiệu còn minh họa. Các API CRUD legacy chưa phân quyền đầy đủ; chưa sẵn sàng public production.

## Yêu cầu môi trường

Node.js 22.13+ cho Expo 57 (phiên rà soát dùng 24.13.0), npm, MySQL và công cụ SQL. Android/điện thoại thật hoặc Expo web; iOS simulator cần macOS. Tham khảo [Expo 57](https://docs.expo.dev/versions/v57.0.0/) khi thay cấu hình native.

## Cài đặt và chạy

### Backend và DB

```powershell
cd DHair_BE
npm ci
```

Tạo `.env` trong DHair_BE bằng cấu hình cá nhân:

```dotenv
PORT=5000
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/dhair"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-gmail-app-password"
```

Không commit .env. Ký tự đặc biệt trong mật khẩu DATABASE_URL cần URL-encode.

**DB mới:** tạo database `dhair`, rồi trong DHair_BE:

```powershell
npx prisma db push
npx prisma generate
```

Import `dhair.sql` bằng công cụ MySQL sau khi tạo bảng. Đây là seed chạy một lần, không phải migration chạy lặp. Kiểm tra dữ liệu nhạy cảm/tài khoản mẫu trước khi chia sẻ. Backend chỉ nhận bcrypt: không giả định mật khẩu seed đăng nhập được và không hạ kiểm tra để nhận plaintext. Tạo tài khoản hợp lệ qua luồng đăng ký/quản trị ở môi trường phát triển.

Sau import, cập nhật trigger và thời lượng:

```powershell
node scripts/update-invoice-trigger.js
npx prisma db execute --schema prisma/schema.prisma --file prisma/salon-duration-backfill.sql
npm run dev
```

**DB đang dùng:** sao lưu, đọc SALON_OPERATIONS.md; chỉ chạy SQL bổ sung nếu thiếu cột/bảng. Không reset DB hoặc import lại seed lên dữ liệu hiện tại. Prisma db push không cài trigger.

API `http://localhost:5000`; kiểm tra `GET /api/dichvu/get-all-DichVuCungCap`. Chạy từ DHair_BE vì uploads sử dụng đường dẫn theo thư mục làm việc. Khởi động server sẽ chạy job tự hủy ngay trên DB cấu hình.

### Website

```powershell
cd DHair_Admin
npm ci
npm start
```

Web `http://localhost:3000`. API URL tại `src/api/axiosClient.ts` là localhost:5000. Route chính: `/`, `/datlich`, `/lichsu`, `/profile`, `/admin/dashboard`. Token/quyền giữ localStorage; PrivateRoute chỉ bảo vệ giao diện.

### Mobile

```powershell
cd DHair_FE
npm ci
Copy-Item .env.example .env.local
npm start
```

Nếu env đã tồn tại thì sửa, không ghi đè. Đặt `EXPO_PUBLIC_API_URL`, không thêm `/api`:

| Nơi chạy | URL ví dụ |
| --- | --- |
| Web cùng máy API | http://localhost:5000 |
| Android emulator chuẩn | http://10.0.2.2:5000 |
| Điện thoại thật | http://IP-LAN-MAY-API:5000 |

Điện thoại/máy API cần thông mạng; restart Expo sau khi đổi env. apiClient còn fallback IP LAN của người phát triển, nên luôn đặt env khi chuyển máy. Phiên mobile ở bộ nhớ; AsyncStorage chỉ giữ lựa chọn dịch vụ.

## Kiểm tra và build

| Thư mục | Lệnh | Mục đích |
| --- | --- | --- |
| DHair_BE | npm test | Test mặc định, bỏ tích hợp MySQL |
| DHair_Admin | npm run lint | Toàn bộ TS/TSX |
| DHair_Admin | npm run build | CRA build, chạy được PowerShell |
| DHair_FE | npm run typecheck | Kiểm tra TypeScript |
| DHair_FE | npx expo export --platform web | Đóng gói và xuất routes web |

Tích hợp MySQL trên DB có schema/trigger, trong DHair_BE:

```powershell
$env:RUN_SALON_DB_TESTS='1'
npm test
Remove-Item Env:RUN_SALON_DB_TESTS
```

Fixture nghiệp vụ chạy trong transaction rồi rollback; nên dùng DB thử nghiệm. Chưa có E2E native hoặc kiểm chứng SMTP thật. Website có xung đột TypeScript 4.9/Zod 4 khi tsc độc lập; CRA build qua không thay thế kiểm tra kiểu toàn diện.

## Quy ước

`.editorconfig` và `.prettierrc.json` quy định UTF-8, 2 spaces, single quote, 100 ký tự/dòng. Chú thích giải thích nghiệp vụ/transaction/thời gian. Giữ lockfile, SQL, test và ảnh DB tham chiếu. Danh sách ảnh mobile đã bỏ ở `docs/removed-mobile-assets.txt`. Định dạng code không đồng nghĩa đã đo được cải thiện hiệu năng runtime.

## Xử lý lỗi thường gặp

| Hiện tượng | Kiểm tra |
| --- | --- |
| Mobile không kết nối | URL, mạng, backend/cổng 5000 |
| Không có slot | 5 ngày hợp lệ, giờ hiện tại, hết trước 22h, lịch bận/nghỉ |
| Chưa tự hủy | Server/job, quá 10 phút, THOIGIANDEN còn NULL |
| Hoàn thành không sinh hóa đơn | Trigger trong DB, chi tiết lịch, hóa đơn hiệu lực đã tồn tại |
| Không tải lý do hủy admin | Backend đã restart với route mới, token hợp lệ |
| Đăng nhập seed thất bại | PASS bcrypt, trạng thái Hoạt động, JWT env |
| Không nhận email | SMTP/env/log; API quên mật khẩu chưa đảm bảo gửi thành công |
| Ảnh lỗi | HINH/ảnh uploads hoặc đường dẫn asset thật |
