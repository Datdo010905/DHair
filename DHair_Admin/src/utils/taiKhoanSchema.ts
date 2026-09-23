import { z } from 'zod';

export const taiKhoanSchema = z.object({
  accUsername: z.string().min(1, { message: "Tài khoản không được để trống" }),
  accPassword: z.string().min(1, { message: "Mật khẩu không được để trống" }),
  accRole: z.string(),
  accStatus: z.string(),
});

export type TaiKhoanFormValue = z.infer<typeof taiKhoanSchema>;