export interface LoginInput {
  phone: string;
  password: string;
}

// Phần phản hồi được dùng để kiểm tra kết quả của cả ba API.
export interface AuthResponse {
  token?: string;
  success: boolean;
  message?: string;
  data?: {
    MATK: string;
    HOTEN?: string | null;
  };
}

export interface AuthUser {
  token: string;
  accountId: string;
  fullName: string;
}

export interface RegisterInput {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  phone: string;
  email: string;
}
