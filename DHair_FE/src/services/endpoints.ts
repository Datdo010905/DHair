export const endpoints = {
  auth: {
    login: '/api/login/login-taikhoan',
    register: '/api/khachhang/insert-khachhangVoiTaiKhoan',
    forgotPassword: '/api/taikhoan/forgot-password',
  },
  services: {
    detail: (id: string) => `/api/dichvu/get-DichVuByID/${encodeURIComponent(id)}`,
    all: '/api/dichvu/get-all-DichVuCungCap',
    hair: '/api/dichvu/get-all-DichVuToc',
    skinCare: '/api/dichvu/get-all-DichVuCSD',
  },
} as const;
