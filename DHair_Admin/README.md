# DHair Web và Admin

Bao gồm website khách và quản trị. Cài đặt tại [README gốc](../README.md).

```powershell
npm ci
npm start
npm run lint
npm run build
```

- `index.tsx`: Router, Context và toast; `App.tsx`: routes/nhóm quyền.
- `pages/client`: tài khoản, dịch vụ, đặt lịch, lịch sử, hồ sơ, giới thiệu.
- `pages/admin`: danh mục, lịch, hóa đơn, báo cáo.
- `components/ui/SalonOperationsPanel.tsx`: điều phối.
- `api`: Axios và API theo nhóm; URL tại axiosClient.ts.
- `assets/css`: CSS theo màn hình; `utils`: validation và Excel.

Bearer token từ localStorage, lỗi 401 xóa phiên. PrivateRoute không thay thế quyền API. Danh mục lịch sử cần CT+CSD kể cả ngừng cung cấp. Hóa đơn tự tạo từ trigger khi hoàn thành; frontend cập nhật/thu tiền. Luồng từng tính năng xem [tài liệu](../docs/LUONG_CHUC_NANG.md).

tsc độc lập hiện vướng TypeScript 4.9/Zod 4; CRA build qua không chứng minh mọi kiểm tra kiểu qua. Xem [báo cáo](../docs/BAO_CAO_RA_SOAT.md).
