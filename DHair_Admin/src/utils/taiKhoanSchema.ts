import { z } from 'zod';

export const createTaiKhoanSchema = z.object({
  accUsername: z.string().min(1, { message: 'Tài khoản không được để trống' }),

  accPassword: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .max(50, { message: 'Mật khẩu tối đa 50 ký tự' }),

  accRole: z.string(),

  accStatus: z.string(),
});

export const updateTaiKhoanSchema = z.object({
  accUsername: z.string().min(1),
  accPassword: z.string().optional(),
  accRole: z.string(),
  accStatus: z.string(),
});
