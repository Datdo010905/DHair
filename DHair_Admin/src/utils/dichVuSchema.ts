import { z } from 'zod';

export const dichVuSchema = z.object({
  serviceID: z.string().min(1, { message: "Mã dịch vụ không được để trống" }),
  serviceName: z.string().min(1, { message: "Tên dịch vụ không được để trống" }),
  serviceType: z.string(),
  serviceDesc: z.string().min(1, { message: "Mô tả dịch vụ không được để trống" }),
  serviceTime: z.coerce.number().min(5, { message: "Thời gian ít nhất 5 phút" }),
  servicePrice: z.coerce.number().min(1000, { message: "Giá tiền phải từ 1.000đ" }), 
  serviceStatus: z.string(),
  serviceProcedure: z.string().min(1, { message: "Quy trình dịch vụ không được để trống" }),
});

export type DichVuFormValues = z.infer<typeof dichVuSchema>;