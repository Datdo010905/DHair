# DHair Mobile

Expo 57/React Native dành cho khách hàng. Đặt lịch, lịch sử, hủy, hồ sơ và đổi mật khẩu đã nối API.

```powershell
npm ci
Copy-Item .env.example .env.local
npm start
npm run typecheck
npx expo export --platform web
```

Nếu env đã có thì chỉnh, không ghi đè. Đặt EXPO_PUBLIC_API_URL theo [README gốc](../README.md); điện thoại thật dùng IP LAN máy API.

| Nơi | Chức năng |
| --- | --- |
| src/app/_layout.tsx | Context và Stack |
| src/app/(tabs) | Home, tìm kiếm, đặt lịch, lịch sử, hồ sơ |
| src/app/(auth) | Đăng nhập/đăng ký/quên mật khẩu |
| src/app/services/[id].tsx | Route chi tiết dịch vụ |
| src/features/auth | Phiên và form tài khoản |
| src/features/services | API/hook/tìm kiếm/chi tiết/lưu lựa chọn dịch vụ |
| src/features/booking | API đặt lịch và giờ trống |
| src/features/history | Lịch, chi tiết, modal hủy |
| src/features/profile | Hồ sơ và đổi mật khẩu |
| src/features/home | Logo/banner/giới thiệu |
| src/services | Base URL, endpoint, URL ảnh |
| assets/img | Logo, avatar và 9 banner đang dùng |

Expo Router tìm màn hình theo tên file: không xóa vì không thấy import. Ảnh dịch vụ thật lấy từ backend. Token giữ Context, chưa lưu phiên dài hạn; AsyncStorage chỉ giữ dịch vụ đang chọn. Lịch sử theo JWT; khách chỉ hủy Đã đặt.

QuickActions/Hotline còn thiếu xử lý; sao đánh giá chỉ minh họa. Lý do hủy do admin/job lưu ở LICHHEN chưa được hiển thị đầy đủ như ghi chú khách tự hủy.

Export web kiểm tra bundle/routes/asset, không thay thế chạy điện thoại. Icon/splash nay trỏ ảnh DHair tồn tại; cần native rebuild để xem cách hệ điều hành cắt icon. Đã bỏ reset-project template vì có thể xóa source.

Quy ước: [AGENTS.md](AGENTS.md). Giải thích và câu hỏi bảo vệ: [LUONG_CHUC_NANG.md](../docs/LUONG_CHUC_NANG.md).
