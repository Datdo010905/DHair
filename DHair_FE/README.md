# DHair Mobile

Ứng dụng khách hàng của DHair, xây dựng bằng React Native và Expo. Người dùng có thể khám phá dịch vụ tóc, chăm sóc da, xem chi tiết và chuyển dịch vụ đã chọn sang màn hình đặt lịch.

Giao diện dùng NativeWind với tông trắng–xanh navy, điều hướng bằng Expo Router và tổ chức code theo tính năng.

[Tổng quan hệ thống và thiết lập backend](../README.md) · [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Nền tảng | Expo SDK 57, React Native 0.86, React 19 |
| Ngôn ngữ | TypeScript 6 |
| Điều hướng | Expo Router |
| Giao diện | NativeWind 4, Tailwind CSS 3, Ionicons |
| Kết nối backend | Fetch API, AbortController |
| Lưu lựa chọn dịch vụ | AsyncStorage |

## Trạng thái tính năng

| Màn hình / luồng | Đã có | Phần chưa tích hợp |
| --- | --- | --- |
| Đăng nhập / đăng ký / quên mật khẩu | Gọi API, kiểm tra dữ liệu nhập, hiển thị lỗi | Lưu phiên đăng nhập lâu dài |
| Home | Dịch vụ tóc và chăm sóc da từ API; bấm thẻ xem chi tiết | Một số nội dung và nút phụ vẫn là giao diện |
| Tìm kiếm | Tìm có dấu/không dấu, lọc nhóm, tải lại, trạng thái rỗng và lỗi | — |
| Chi tiết | Ảnh, mô tả, giá, thời gian, quy trình; nút Đặt lịch ngay | — |
| Đặt lịch | Tự chọn dịch vụ từ local, chọn thông tin và xem trước lịch hẹn | Salon, stylist, khung giờ là dữ liệu mẫu; chưa gọi API tạo lịch |
| Lịch sử | Dữ liệu minh họa, lọc trạng thái, mở rộng chi tiết | API lịch sử theo tài khoản |
| Tài khoản | Tên, số điện thoại từ phiên đăng nhập, đăng xuất | Email hồ sơ, API cập nhật thông tin và đổi mật khẩu |

Các form chỉnh sửa tài khoản đang ở chế độ xem trước, nút lưu bị vô hiệu hóa. Bấm đặt lịch hiện chỉ mở bản xem trước, chưa tạo lịch hẹn trên hệ thống.

## Bắt đầu

### 1. Cài đặt dependencies

Yêu cầu Node.js từ 22.13.x và npm. Chạy các lệnh tại thư mục `DHair_FE`:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Với Bash/zsh, thay lệnh sao chép bằng `cp .env.example .env.local`. Nếu đã có `.env.local`, chỉnh file hiện tại để giữ cấu hình của bạn.

### 2. Cấu hình backend

Chạy backend theo [hướng dẫn tại README gốc](../README.md), sau đó đặt địa chỉ trong `.env.local`:

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:5000
```

| Nơi chạy ứng dụng | Địa chỉ backend |
| --- | --- |
| Trình duyệt trên cùng máy chạy backend | `http://localhost:5000` |
| Android Emulator chuẩn | `http://10.0.2.2:5000` |
| iOS Simulator trên cùng máy Mac chạy backend | `http://localhost:5000` |
| Điện thoại thật | `http://<IP-LAN-may-chay-backend>:5000` |

URL không có hậu tố `/api`; các endpoint đã bao gồm tiền tố này. Điện thoại thật và máy chạy backend cần cùng mạng, cổng `5000` cần cho phép kết nối. Trên Windows, dùng `ipconfig` để xem IPv4 của card mạng đang sử dụng.

Code hiện có địa chỉ LAN dự phòng dành riêng cho máy phát triển trên Android và `localhost:5000` trên nền tảng khác. Hãy cấu hình `EXPO_PUBLIC_API_URL` cho thiết bị của bạn thay vì phụ thuộc địa chỉ dự phòng trong [apiClient.ts](./src/services/apiClient.ts).

### 3. Khởi động ứng dụng

```powershell
npm start
```

| Lệnh | Mục đích |
| --- | --- |
| `npm start` | Khởi động Expo và chọn thiết bị từ terminal |
| `npm run android` | Khởi động Expo với Android |
| `npm run ios` | Khởi động Expo với iOS; simulator cần macOS/Xcode |
| `npm run web` | Chạy bản web |
| `npx expo start --clear` | Khởi động lại và xóa cache Metro |
| `npx tsc --noEmit` | Kiểm tra TypeScript |
| `npx expo export --platform web` | Build bản web vào `dist/` |

Khởi động lại Expo sau khi sửa `.env.local`. Backend cần chạy riêng khi dùng bản web.

## Cấu trúc mã nguồn

```text
src/
├── app/
│   ├── (auth)/             # Đăng nhập, đăng ký, quên mật khẩu
│   ├── (tabs)/             # Home, tìm kiếm, đặt lịch, lịch sử, tài khoản
│   ├── services/[id].tsx   # Route chi tiết dịch vụ
│   └── _layout.tsx         # Root navigator và AuthProvider
├── features/
│   ├── auth/              # API xác thực, AuthContext, RequireAuth và form
│   ├── home/              # Các phần giao diện trang chủ
│   ├── services/          # API, kiểu dữ liệu, hook, component và lưu local
│   ├── history/           # Giao diện lịch sử và dữ liệu minh họa
│   └── profile/           # Thông tin tài khoản và form xem trước
├── services/
│   ├── apiClient.ts       # Địa chỉ backend, GET JSON, timeout và URL ảnh
│   └── endpoints.ts       # Khai báo endpoint tập trung
├── hooks/
├── constants/
├── types/
└── utils/
```

Các tính năng dịch vụ đi theo luồng:

```text
Route / Component → Hook → features/services/api.ts
                        → services/apiClient.ts + endpoints.ts → Backend
```

Hook tải dữ liệu, quản lý loading/error và hủy request khi không còn cần thiết. Component hiển thị trạng thái và nhận tương tác. Xác thực có hàm gửi POST riêng trong `features/auth/api.ts`, dùng chung địa chỉ backend và danh sách endpoint.

## API đang sử dụng

| Phương thức | Endpoint | Mục đích |
| --- | --- | --- |
| `POST` | `/api/login/login-taikhoan` | Đăng nhập |
| `POST` | `/api/khachhang/insert-khachhangVoiTaiKhoan` | Đăng ký |
| `POST` | `/api/taikhoan/forgot-password` | Cấp lại mật khẩu |
| `GET` | `/api/dichvu/get-all-DichVuToc` | Dịch vụ tóc đang cung cấp |
| `GET` | `/api/dichvu/get-all-DichVuCSD` | Dịch vụ chăm sóc da đang cung cấp |
| `GET` | `/api/dichvu/get-all-DichVuCungCap` | Tất cả dịch vụ đang cung cấp để tìm kiếm |
| `GET` | `/api/dichvu/get-DichVuByID/:id` | Chi tiết một dịch vụ |

API dịch vụ trả về `{ success, data, message }`. `apiGet` lấy phần `data`, giới hạn thời gian chờ 15 giây và chuẩn hóa lỗi mạng hoặc phản hồi không hợp lệ. Kiểu `Service` giữ tên trường theo backend: `MADV`, `TENDV`, `GIADV`, `THOIGIAN`, `HINH`…

`getImageUrl` ghép đường dẫn ảnh tương đối với địa chỉ backend. Ví dụ `/img/product/anh.jpg` được phục vụ từ `DHair_BE/uploads/anh.jpg`. Ảnh thiếu hoặc tải lỗi được thay bằng biểu tượng hoặc thông báo.

## Luồng dịch vụ → đặt lịch

1. Bấm thẻ dịch vụ trên Home hoặc Tìm kiếm.
2. Route `services/[id]` tải chi tiết bằng mã dịch vụ.
3. Bấm **Đặt lịch ngay** để lưu mã, tên, giá và thời gian vào AsyncStorage, khóa `dhair:booking-service`.
4. Nếu chưa đăng nhập, ứng dụng mở Login với `next=booking`; đăng nhập thành công sẽ tiếp tục sang Đặt lịch.
5. Khi mở tab Đặt lịch, form đọc lựa chọn local và tự điền dịch vụ. Đổi dịch vụ thủ công cũng cập nhật lựa chọn này.

Ứng dụng không gọi thêm API kiểm tra trạng thái cung cấp trước khi tự điền. Thông tin người dùng trong `AuthContext` chỉ tồn tại trong phiên chạy hiện tại; lựa chọn dịch vụ trong AsyncStorage tồn tại độc lập với phiên đăng nhập.

## Kiểm tra thủ công

- Chạy backend, mở Home và kiểm tra cả hai nhóm dịch vụ cùng ảnh.
- Tìm bằng từ khóa có dấu/không dấu, đổi nhóm, thử từ khóa không có kết quả.
- Mở chi tiết từ Home và Tìm kiếm; kiểm tra nút quay lại.
- Bấm Đặt lịch ngay khi đã đăng nhập và khi chưa đăng nhập; kiểm tra dịch vụ được tự chọn.
- Đổi dịch vụ trong form, chuyển tab rồi quay lại để kiểm tra lựa chọn local.
- Mở Lịch sử, đổi bộ lọc và mở rộng thẻ minh họa.
- Mở Tài khoản, xem form xem trước và thử hủy/xác nhận đăng xuất.
- Tắt backend để kiểm tra lỗi và nút thử lại khi tải dịch vụ.

## Xử lý lỗi

| Hiện tượng | Cách kiểm tra |
| --- | --- |
| Không thể kết nối máy chủ | Kiểm tra backend, URL theo thiết bị, mạng LAN và cổng `5000` |
| Android gọi nhầm máy | Đặt `EXPO_PUBLIC_API_URL`; không dùng `localhost` để trỏ tới máy tính từ điện thoại |
| Cấu hình mới chưa có hiệu lực | Dừng Expo rồi chạy lại; thử `npx expo start --clear` |
| API phản hồi quá lâu | Xem log backend và kết nối MySQL; request GET có timeout 15 giây |
| Không có ảnh | Đối chiếu `HINH`, URL ảnh và file trong `uploads` của backend |
| Build web báo thiếu favicon | `app.json` đang trỏ tới `assets/images/favicon.png`; kiểm tra file hoặc cập nhật đường dẫn khi bổ sung bộ icon |
| Lịch sử chưa khớp tài khoản / chưa lưu được hồ sơ | Các màn này đang dùng dữ liệu minh họa hoặc form xem trước, chưa tích hợp API |

## Quy ước phát triển

- Đặt route trong `src/app`, giao diện và logic tính năng trong `src/features`.
- Khai báo endpoint tập trung; dùng API client hiện có cho các yêu cầu GET dịch vụ.
- Dùng NativeWind cho phần lớn giao diện, StyleSheet cho thuộc tính cần thiết.
- Hiển thị rõ trạng thái đang tải, lỗi, dữ liệu rỗng và thao tác thử lại.
- Ghi rõ dữ liệu minh họa; chỉ báo lưu thành công khi thao tác thực sự hoàn tất.
- Chạy `npx tsc --noEmit` sau khi sửa TypeScript và kiểm tra trên thiết bị mục tiêu khi thay đổi giao diện.
