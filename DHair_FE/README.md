# DHair frontend

## Kết nối API dịch vụ

1. Chạy backend trong `DHair_BE`: `npm run dev` (mặc định cổng 5000).
2. Trong `DHair_FE`, sao chép `.env.example` thành `.env.local`.
3. Đặt `EXPO_PUBLIC_API_URL` bằng địa chỉ gốc của backend, không thêm `/api`:
   - Web trên máy chạy backend: `http://localhost:5000`.
   - Android Emulator: `http://10.0.2.2:5000`.
   - Điện thoại thật: `http://<IP-LAN-may-chay-BE>:5000`. Hai thiết bị cần kết nối cùng mạng và máy chạy BE phải cho phép kết nối tới cổng 5000.
4. Chạy `npm install`, sau đó `npx expo start`. Khởi động lại Expo sau khi đổi cấu hình URL.

Trang chủ gọi hai endpoint sau và đọc trường `data` trong phản hồi `{ success, data, message }`:

- `GET /api/dichvu/get-all-DichVuToc`: dịch vụ tóc đang cung cấp.
- `GET /api/dichvu/get-all-DichVuCSD`: dịch vụ chăm sóc da đang cung cấp.

Ảnh lấy từ trường `HINH`; đường dẫn `/img/product/...` được ghép với địa chỉ backend. Backend phục vụ ảnh từ thư mục `uploads`.

Mỗi nhóm dịch vụ có trạng thái đang tải, không có dữ liệu, báo lỗi và nút thử lại riêng. Nếu không cấu hình URL, mặc định dùng `10.0.2.2:5000` trên Android và `localhost:5000` trên các nền tảng khác.

Kiểm tra kiểu dữ liệu: `npx tsc --noEmit`.
