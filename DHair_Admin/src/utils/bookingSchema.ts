import { z } from 'zod';

export const BookingSchema = z.object({
    bookingID: z.string().min(1, { message: "Mã lịch không được để trống" }),
    bookingDate: z.string().min(1, { message: "Ngày hẹn không được để trống" }),
    bookingTime: z.string(),
    branchID: z.string().min(1, { message: "Mã chi nhánh không được để trống" }),
    customerID: z.string().min(1, { message: "Mã khách hàng không được để trống" }),
    dichvu: z.string().min(1, { message: "Dịch vụ không được để trống" }),
    soluong: z.string().min(1, { message: "Số lượng không được để trống" }),

}).superRefine((data, ctx) => {
    const bookingDateTime = new Date(`${data.bookingDate}T${data.bookingTime}`);
    const now = new Date();

    if (bookingDateTime <= now) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Lịch hẹn phải ở sau thời gian hiện tại",
            path: ["bookingDate"],
        });

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Lịch hẹn phải ở sau thời gian hiện tại",
            path: ["bookingTime"],
        });
    }
});

export type BookingFormValue = z.infer<typeof BookingSchema>;