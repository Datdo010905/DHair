# Đánh giá sau dịch vụ

Mỗi lịch hoàn thành có một đánh giá 1–5 sao, nhận xét tùy chọn tối đa 500 ký tự.
Khách chỉ gửi cho lịch của mình. Phản hồi không công khai; tài khoản quản trị và
quản lý (quyền 1, 2) xem qua `/admin/reviews`.

## Cài đặt trên database khác

Chạy từ thư mục `DHair_BE` với `DATABASE_URL` của môi trường cần cập nhật:

```powershell
npx prisma db execute --file prisma/booking-reviews.sql --schema prisma/schema.prisma
npx prisma generate
```

Khởi động lại backend sau khi cập nhật. Trên Windows, dừng backend trước khi
generate nếu DLL Prisma đang bị khóa. SQL chỉ thêm bảng, không sửa dữ liệu lịch cũ.

## Sử dụng

- Mobile: Lịch sử → lịch Hoàn thành → Đánh giá dịch vụ.
- Admin: Phản hồi → chọn chi nhánh, khoảng ngày gửi, số sao → Xem phản hồi.
- Mở “Xem lịch” để xem ngày hẹn, dịch vụ và stylist liên quan.
- Điểm trung bình và tỷ lệ 4–5 sao tính trên toàn bộ kết quả đã lọc, không chỉ trang
  hiện tại. Khi chưa có đánh giá, hiển thị dấu gạch thay vì điểm 0.
- Đánh giá thuộc cả trải nghiệm của lịch, không dùng để chấm riêng từng stylist.

## Kiểm tra

`npm test` chạy các kiểm tra quyền, chủ sở hữu, trạng thái hoàn thành, gửi trùng,
số sao, độ dài nhận xét và thống kê. Kiểm tra database thật nên chạy trong
transaction rồi rollback để không đưa phản hồi thử vào báo cáo.
