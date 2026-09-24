# DHair — Hệ thống đặt lịch và quản lý salon

DHair là dự án ứng dụng đa nền tảng phục vụ việc tìm kiếm dịch vụ, đặt lịch chăm sóc tóc và quản lý hoạt động salon. Repository gồm ứng dụng mobile, website dành cho khách hàng và quản trị viên, cùng REST API dùng chung.

> Dự án đang được phát triển. Một số màn hình mobile sử dụng dữ liệu minh họa; xem bảng trạng thái chức năng bên dưới.

## Tổng quan

| Thành phần | Vai trò | Công nghệ chính |
| --- | --- | --- |
| [DHair_FE](./DHair_FE/) | Ứng dụng Android, iOS và web qua Expo | Expo SDK 57, React Native 0.86, React 19, TypeScript, Expo Router, NativeWind |
| [DHair_Admin](./DHair_Admin/) | Website khách hàng và khu vực quản trị | React 19, TypeScript, React Router, Axios, React Scripts |
| [DHair_BE](./DHair_BE/) | REST API, xử lý nghiệp vụ và gửi email | Node.js, Express 5, Prisma 6, MySQL, Nodemailer |
| [dhair.sql](./dhair.sql) | Dữ liệu mẫu và trigger cơ sở dữ liệu | SQL |

## Cấu trúc repository

```text
DHair/
├── DHair_FE/
│   ├── src/app/          # Màn hình và điều hướng Expo Router
│   ├── src/features/     # Giao diện, hook và logic theo tính năng
│   └── src/services/     # API client và danh sách endpoint
├── DHair_Admin/
│   └── src/
│       ├── api/          # Các hàm gọi API của website
│       └── pages/        # Trang khách hàng và quản trị
├── DHair_BE/
│   ├── prisma/           # Schema cơ sở dữ liệu
│   ├── src/              # Routes, controllers và services
│   └── uploads/          # Ảnh dịch vụ
├── dhair.sql
└── README.md
```

Mỗi ứng dụng có `package.json` và `package-lock.json` riêng. Cài dependencies trong đúng thư mục ứng dụng, không chạy `npm install` tại thư mục gốc repository.

## Trạng thái chức năng

### Ứng dụng mobile

| Chức năng | Trạng thái hiện tại |
| --- | --- |
| Đăng nhập, đăng ký, quên mật khẩu | Đã tích hợp API |
| Home và tìm kiếm | Lấy dịch vụ từ API; tìm có dấu/không dấu và lọc nhóm trên thiết bị |
| Chi tiết dịch vụ | Gọi API theo mã dịch vụ, mở được từ Home và Tìm kiếm |
| Chuyển sang đặt lịch | Lưu dịch vụ bằng AsyncStorage và tự điền vào form; hỗ trợ tiếp tục sau đăng nhập |
| Form đặt lịch | Dịch vụ từ API; salon, stylist, khung giờ dùng dữ liệu mẫu; chưa gửi yêu cầu tạo lịch hẹn |
| Lịch sử lịch hẹn | Giao diện minh họa, lọc trạng thái và xem chi tiết; chưa nối API |
| Thông tin tài khoản | Hiển thị tên, số điện thoại từ phiên đăng nhập; đăng xuất hoạt động |
| Chỉnh sửa thông tin, đổi mật khẩu | Giao diện xem trước; chưa hỗ trợ lưu |

Phiên đăng nhập mobile hiện được giữ trong bộ nhớ ứng dụng. Lựa chọn dịch vụ đặt lịch được lưu riêng trên thiết bị.

### Website và backend

Website có khu vực khách hàng và các trang quản trị tài khoản, dịch vụ, khách hàng, nhân viên, lịch hẹn, hóa đơn, khuyến mãi và báo cáo. Backend cung cấp các nhóm API tương ứng, kết nối MySQL qua Prisma và gửi email bằng Nodemailer.

Chi tiết luồng mobile và tổ chức code: [DHair_FE/README.md](./DHair_FE/README.md).

## Yêu cầu môi trường

- Node.js từ **22.13.x** và npm để làm việc với Expo SDK 57; xem [tài liệu phiên bản Expo](https://docs.expo.dev/versions/v57.0.0/).
- MySQL và công cụ quản lý như MySQL Workbench hoặc MySQL CLI.
- Thiết bị chạy Expo Go phù hợp với SDK của dự án, hoặc môi trường Android/iOS đã thiết lập.
- iOS Simulator cần macOS và Xcode; trên Windows có thể dùng Android, điện thoại thật hoặc bản web.

## Cài đặt và chạy

Các lệnh dưới đây bắt đầu từ thư mục gốc repository. Mở terminal riêng cho từng ứng dụng cần chạy.

### 1. Backend và cơ sở dữ liệu

```powershell
cd DHair_BE
npm ci
```

Tạo file `DHair_BE/.env` với cấu hình của môi trường phát triển:

```dotenv
PORT=5000
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/dhair"
JWT_SECRET="replace-with-your-own-random-secret"
JWT_EXPIRES_IN="1d"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-gmail-app-password"
```

| Biến | Mục đích |
| --- | --- |
| `PORT` | Cổng API; mặc định `5000` |
| `DATABASE_URL` | Chuỗi kết nối MySQL của Prisma |
| `JWT_SECRET` | Khóa ký token đăng nhập |
| `JWT_EXPIRES_IN` | Thời hạn token, ví dụ `1d` |
| `MAIL_USER`, `MAIL_PASS` | Tài khoản Gmail và mật khẩu ứng dụng cho chức năng gửi email |

Thay giá trị mẫu bằng cấu hình cá nhân; không đưa `.env` vào Git. Ký tự đặc biệt trong mật khẩu MySQL cần được mã hóa theo định dạng URL trong `DATABASE_URL`.

Với **database phát triển mới**, tạo database trong MySQL:

```sql
CREATE DATABASE dhair CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Trong terminal tại `DHair_BE`, tạo bảng theo schema và sinh Prisma Client:

```powershell
npx prisma db push
npx prisma generate
```

Sau đó dùng công cụ MySQL mở và chạy [dhair.sql](./dhair.sql) trên database `dhair`. File này chứa dữ liệu mẫu và trigger, không chứa lệnh tạo bảng. Nhập một lần trên database mới; chạy lại các lệnh `INSERT` có thể gây trùng khóa.

Khởi động API từ thư mục `DHair_BE`:

```powershell
npm run dev
```

Backend mặc định lắng nghe trên `0.0.0.0:5000`. Kiểm tra bằng cách mở:

```text
http://localhost:5000/api/dichvu/get-all-DichVuCungCap
```

Phản hồi thành công có dạng `{ "success": true, "data": [...], "message": "..." }`. Đường dẫn `/` có thể trả về lỗi không tìm thấy route vì backend không cung cấp trang chủ.

### 2. Ứng dụng mobile

Mở terminal mới từ thư mục gốc:

```powershell
cd DHair_FE
npm ci
Copy-Item .env.example .env.local
```

Nếu đã có `.env.local`, chỉnh file hiện tại. Đặt `EXPO_PUBLIC_API_URL` theo thiết bị chạy ứng dụng, **không thêm `/api`**:

| Môi trường | Giá trị ví dụ |
| --- | --- |
| Web trên máy chạy backend | `http://localhost:5000` |
| Android Emulator chuẩn | `http://10.0.2.2:5000` |
| Điện thoại thật | `http://<IP-LAN-may-chay-backend>:5000` |

```powershell
npm start
```

Mở ứng dụng theo hướng dẫn trong terminal Expo. Khởi động lại Expo sau khi thay đổi biến môi trường. Xem thêm [README frontend](./DHair_FE/README.md).

### 3. Website khách hàng và quản trị

Mở terminal mới từ thư mục gốc:

```powershell
cd DHair_Admin
npm ci
npm start
```

Website mặc định chạy tại `http://localhost:3000`. Địa chỉ backend đang được cấu hình trực tiếp tại [axiosClient.ts](./DHair_Admin/src/api/axiosClient.ts) là `http://localhost:5000`.

Đường dẫn quản trị: `/admin/dashboard`; truy cập phụ thuộc quyền tài khoản đăng nhập.

## Kiểm tra và build

| Thư mục | Lệnh | Mục đích |
| --- | --- | --- |
| `DHair_FE` | `npx tsc --noEmit` | Kiểm tra TypeScript |
| `DHair_FE` | `npx expo export --platform web` | Xuất bản build web vào `dist/` |
| `DHair_BE` | `npm start` | Chạy API không dùng nodemon |
| `DHair_Admin` | `npm test` | Chạy trình kiểm thử React Scripts |

Script `npm run build` của website dùng cú pháp biến môi trường kiểu Unix. Khi build bằng PowerShell tại `DHair_Admin`, dùng:

```powershell
$env:CI = "false"
npx react-scripts build
```

Backend chưa có bộ kiểm thử tự động; script `npm test` hiện là placeholder. Website còn có vấn đề tương thích TypeScript 4.9 với khai báo kiểu của Zod 4, có thể làm kiểm tra kiểu hoặc build thất bại.

## Xử lý lỗi thường gặp

| Hiện tượng | Kiểm tra |
| --- | --- |
| Mobile không kết nối API | Backend đã chạy; URL đúng theo thiết bị; điện thoại và máy tính cùng mạng; cổng API được phép truy cập |
| Đổi URL nhưng ứng dụng vẫn gọi địa chỉ cũ | Khởi động lại Expo; khi cần xóa cache, chạy `npx expo start --clear` |
| API báo lỗi database | Kiểm tra MySQL, `DATABASE_URL`, quyền truy cập và các bảng đã tạo |
| Lỗi Prisma Client sau khi cài đặt hoặc đổi schema | Chạy `npx prisma generate` trong `DHair_BE` |
| Ảnh dịch vụ không hiển thị | Kiểm tra `HINH` và file trong `DHair_BE/uploads`; backend phục vụ ảnh tại `/img/product` |
| Không nhận được email | Kiểm tra `MAIL_USER`, `MAIL_PASS` và log gửi mail của backend |

## Phát triển tiếp

- Nối API tạo lịch hẹn, salon, stylist và khung giờ cho mobile.
- Thay lịch sử minh họa bằng dữ liệu của tài khoản đăng nhập.
- Nối API chỉnh sửa hồ sơ và đổi mật khẩu trên mobile.
- Hoàn thiện quản lý phiên đăng nhập và kiểm thử các luồng chính.
