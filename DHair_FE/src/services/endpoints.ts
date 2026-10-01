export const endpoints = {
  profile: '/api/khachhang/me',
  booking: {
    history: '/api/lichhen/history',
    cancel: (id: string) => `/api/lichhen/${encodeURIComponent(id)}/cancel`,
    options: '/api/lichhen/booking-options',
    availability: '/api/lichhen/availability',
    create: '/api/lichhen/book',
  },
  auth: {
    login: '/api/login/login-taikhoan',
    register: '/api/khachhang/insert-khachhangVoiTaiKhoan',
    changePassword: '/api/taikhoan/change-password',
    forgotPassword: '/api/taikhoan/forgot-password',
  },
  services: {
    detail: (id: string) => `/api/dichvu/get-DichVuByID/${encodeURIComponent(id)}`,
    all: '/api/dichvu/get-all-DichVuCungCap',
    hair: '/api/dichvu/get-all-DichVuToc',
    skinCare: '/api/dichvu/get-all-DichVuCSD',
  },
} as const;
