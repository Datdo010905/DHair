//validate khách hàng
import { z } from 'zod';

export const customerSchema = z.object({
    cusName: z.string().min(1, { message: "Tên khách hàng không được để trống" }),
    cusPhone: z.string().min(1, { message: "Số điện thoại không được để trống" }),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;