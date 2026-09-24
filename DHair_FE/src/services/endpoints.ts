export const endpoints = {
  auth: {
    login: '/api/login/login-taikhoan',
    register: '/api/khachhang/insert-khachhangVoiTaiKhoan',
    forgotPassword: '/api/taikhoan/forgot-password',
  },
  services: {
    hair: '/api/dichvu/get-all-DichVuToc',
    skinCare: '/api/dichvu/get-all-DichVuCSD',
  },
} as const;
