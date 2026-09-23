import { z } from 'zod';

export const HoadonSchema = z.object({
    hoadonID: z.string().min(1, { message: "Mã hóa đơn không được để trống" }),
    khachhangID: z.string().min(1, { message: "Khách hàng không được để trống" }),
    khuyenmaiID: z.string().optional(),
    nhanvienID: z.string().min(1, { message: "Thu ngân không được để trống" }),
    methodPayment: z.string().min(1, { message: "Phương thức thanh toán không được để trống" }),

    branchID: z.string().min(1, {message: "Hãy chọn chi nhánh khách vãng lai dùng dịch vụ"}),
    dichvuID: z.string().min(1, {message: "Hãy chọn dịch vụ"}),
    soluongdung : z.coerce.number().min(1, {message: "Nhỏ nhất là 1"})
});

export type HoadonFormValue = z.infer<typeof HoadonSchema>;