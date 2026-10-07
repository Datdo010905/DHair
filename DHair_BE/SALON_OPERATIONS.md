# Vận hành salon

## Cập nhật database

Database local đã được cập nhật trong đợt triển khai này. Không chạy lại file
`salon-operations.sql` trên database đã có các cột/bảng mới.

Với database khác, sao lưu trước, dừng backend, rồi chạy trong `DHair_BE`:

```powershell
node node_modules/prisma/build/index.js db execute --schema prisma/schema.prisma --file prisma/salon-operations.sql
node node_modules/prisma/build/index.js db execute --schema prisma/schema.prisma --file prisma/salon-duration-backfill.sql
node node_modules/prisma/build/index.js generate
npm run dev
```

Schema cũ chưa có lịch sử Prisma Migrate, nên dùng SQL bổ sung tường minh;
không reset database. File đầu chỉ chạy một lần. File backfill chỉ điền thời
lượng còn NULL. Không bịa giờ khách đến hoặc giờ phục vụ cho lịch cũ.

## Cách dùng trên web

Trong **Quản lý lịch hẹn → Điều phối tại salon**, chọn chi nhánh:

1. **Nhận khách trực tiếp**: nhập số điện thoại, tên, dịch vụ. Số điện thoại
   đã có sẽ dùng khách cũ. Chọn stylist để thử nhận ngay; nếu không đủ chỗ
   hoặc chọn chỉ xếp hàng thì khách vào hàng đợi.
2. Khách đặt trước đến: dùng **Cập nhật → Đã đến** trong bảng lịch.
   Chọn **Đang thực hiện** để bắt đầu; hệ thống kiểm tra khoảng trống thực tế.
   Nếu chưa làm được, dùng **Đưa khách đã đến vào hàng đợi**.
3. Hàng đợi sắp theo giờ vào hàng. **Gọi khách** ghi nhận đã gọi;
   **Nhận phục vụ** kiểm tra lại stylist và bắt đầu. Khách có thể rời hàng.
4. **+ Dịch vụ** dùng được khi đang làm. Giá/thời lượng lấy từ server;
   nếu ảnh hưởng lịch sau thì phải sắp xếp lịch sau trước khi thêm.
5. **Cập nhật thời gian cần thêm** ghi nhận việc kéo dài và cảnh báo xung đột.
   **Đổi giờ / stylist** chuyển toàn bộ dịch vụ trong lịch sang một stylist.
6. **Ghi nhận nhân viên nghỉ** chặn nhận lịch mới trong khoảng nghỉ và
   liệt kê lịch cũ bị ảnh hưởng. Lễ tân quyết định đổi giờ/thợ hoặc cho chờ.
7. Chuyển lịch sang **Hoàn thành**: trigger tự tạo hóa đơn chưa thanh toán
   từ đủ dịch vụ ban đầu/phát sinh. Sang trang **Hóa đơn** để thu tiền.

Chi tiết lịch hiển thị các mốc thời gian, lý do hủy và lịch sử thao tác.
Hàng đợi/cảnh báo và danh sách lịch tự tải lại mỗi 30 giây.
Web khách và app tiếp tục đọc cùng dữ liệu lịch từ backend; giờ và stylist
đã đổi xuất hiện khi tải lại lịch sử. Chưa có push notification.

## Quy tắc và giới hạn

- Giờ salon: Việt Nam, 08:00–22:00. Các mốc thực tế lưu UTC trong DATETIME;
  NGAYHEN/GIOHEN vẫn giữ cách lưu ngày/giờ địa phương cũ.
- Quá 10 phút chưa đến: tác vụ mỗi phút tự hủy. Đúng 10 phút chưa hủy.
  Khách quay lại sau khi hủy được nhận bằng lượt trực tiếp mới, không mở lại lịch cũ.
- Đang chờ = lịch đã duyệt, chưa xác nhận có mặt. Đã đến = khách có mặt.
  Hàng đợi có trạng thái riêng để không nhầm với Đang chờ.
- Sau mỗi khoảng nghỉ của nhân viên có thêm 30 phút đệm: nghỉ 11:00–12:30
  thì nhận khách lại từ 13:00. Áp dụng cả lịch nghỉ đã lưu; giờ xin nghỉ gốc
  không đổi. Đặt lịch, đổi giờ, nhận khách và cảnh báo đều dùng mốc này.
- Chỗ trống tính theo stylist, chưa tính ghế. Khi nhận từ hàng đợi hoặc đổi
  lịch, một stylist nhận toàn bộ dịch vụ trong lượt. Chưa phân lịch song song
  theo từng công đoạn.
- Lịch đang làm quá giờ dự kiến giữ thợ bận cho tới khi hoàn thành hoặc cập
  nhật dự kiến mới. Hệ thống không tự dời giờ hẹn của người khác.
- Giá và thời lượng dịch vụ được chốt khi chọn. Hóa đơn từ lịch dùng giá
  đã chốt; chưa xử lý đặt cọc, thanh toán online hay hoàn tiền.
- Quản lý/lễ tân (quyền 1, 2, 5) điều phối; stylist (3) chỉ cập nhật tiến độ
  lịch được giao. Đây không phải đợt thay thế toàn bộ bảo mật API cũ.

## Kiểm thử

```powershell
node --test test/*.test.js
$env:RUN_SALON_DB_TESTS='1'
node --test test/salonOperations.test.js
```

Kiểm thử MySQL dùng dữ liệu riêng trong transaction và luôn rollback;
không lưu khách/lịch mẫu vào database. Chạy sau khi đã cập nhật schema.

## Đồng bộ hóa đơn và lịch hẹn

Database local có trigger tự lập hóa đơn khi lịch hoàn thành. Để cập nhật
trigger trên database khác, chạy `node scripts/update-invoice-trigger.js`.
Script sao lưu định nghĩa cũ vào `prisma/invoice-completion-trigger.backup.sql`
trước khi thay thế. Không sửa các hóa đơn cũ trong lần cập nhật này.

- Hoàn thành lịch tạo hóa đơn chưa thanh toán, đủ dịch vụ, ngày thu tiền NULL.
- Giá trong chi tiết lịch đã là giá tổng: không nhân số lượng lần thứ hai.
- Trang lịch không cần nút Lập hóa đơn; các API tạo vẫn kiểm tra trùng lịch.
- Ở trang Hóa đơn, chọn khuyến mãi, thu ngân, phương thức và Đã thanh toán.
  Backend kiểm tra hạn khuyến mãi, tính lại tiền và ghi thời điểm thực thu.
- Không sửa/xóa hóa đơn đã thanh toán; không thêm dịch vụ riêng vào hóa đơn
  gắn lịch. Hóa đơn lẻ chưa thanh toán vẫn thêm dịch vụ và tính lại tổng được.
- Hóa đơn cũ chưa thanh toán gắn lịch được đồng bộ giá/dịch vụ khi cập nhật.
  Hóa đơn đã thanh toán cũ cần đối soát riêng, không tự chỉnh số tiền lịch sử.
