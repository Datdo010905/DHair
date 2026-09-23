import { z } from 'zod';

export const khuyenMaiSchema = z.object({
  promotionID: z.coerce.string().min(1, { message: "Mã khuyến mại không được để trống" }),
  promotionName: z.coerce.string().min(1, { message: "Tên chương trình không được để trống" }),
  
  promotionDesc: z.coerce.string().min(1, { message: "Mô tả chương trình không được để trống" }),
  
  promotionBD: z.coerce.string().min(1, { message: "Vui lòng chọn ngày bắt đầu" }),
  promotionKT: z.coerce.string().min(1, { message: "Vui lòng chọn ngày kết thúc" }),
  
  promotionValue: z.coerce.number().min(0).max(100, { message: "Khuyến mại từ 0% đến 100%" }),
}).refine(data => {
  const startDate = new Date(data.promotionBD);
  const endDate = new Date(data.promotionKT);

  //true
  return startDate < endDate;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["promotionKT"]
})

export type KhuyenMaiFormValue = z.infer<typeof khuyenMaiSchema>;