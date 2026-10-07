# DHair Backend

Xem [README gốc](../README.md), [luồng nghiệp vụ](../docs/LUONG_CHUC_NANG.md), [API](../docs/API_ROUTES.md).

- `src/server.js`: mở cổng, job tự hủy.
- `src/app.js`: middleware, ảnh tĩnh, mount API.
- `src/routes`: URL, middleware; `controllers`: HTTP; `services`: Prisma/nghiệp vụ.
- Service mới nhận `db` để test bằng mock hoặc transaction.
- `prisma/schema.prisma`: bảng/quan hệ; trigger cài bằng SQL riêng.
- `test`: khả dụng/hủy/no-show/hồ sơ/điều phối/hóa đơn.
- `scripts/update-invoice-trigger.js`: cài trigger có backup/khôi phục khi lỗi; không chạy mỗi lần khởi động.
- `uploads`: ảnh đường dẫn lưu trong DB, không xóa theo thống kê import.

```powershell
npm ci
npx prisma generate
npm run dev
npm test
```

`npm start` chạy không nodemon. Test MySQL bật RUN_SALON_DB_TESTS=1 theo README gốc; không reset DB để test. Cấu hình env và thứ tự seed/trigger phải đọc README trước khi chạy trên DB mới.

Giờ nghiệp vụ Việt Nam; DATE/TIME khác các mốc thực tế UTC. Giá/thời lượng chốt trong chi tiết. Khóa chi nhánh/lịch/thợ bảo vệ kiểm tra xung đột. Trigger tạo hóa đơn, invoiceWorkflow kiểm tra thu tiền. Job chạy trong tiến trình Node. Nhiều CRUD legacy chưa phân quyền thống nhất; đọc [báo cáo rà soát](../docs/BAO_CAO_RA_SOAT.md).
