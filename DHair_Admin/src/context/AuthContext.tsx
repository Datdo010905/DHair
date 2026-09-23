import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  username: string;
  role: string;
}

//Định nghĩa những gì Vùng nhớ chung này sẽ chứa
interface AuthContextType {
  user: User | null; // null nghĩa là chưa đăng nhập
  login: (userData: User, token: string) => void;
  logout: () => void;
}

//Khởi tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Tạo Provider (Cái bọc bên ngoài để truyền dữ liệu)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('phanquyen');
    const username = localStorage.getItem('username'); // Lấy tên đã lưu
    
    if (token && role && username) {
      setUser({ username, role });
    }
  }, []);

  // Hàm xử lý chung khi gọi đăng nhập thành công
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('phanquyen', userData.role);
    localStorage.setItem('username', userData.username);
  };

  // Hàm xử lý chung khi gọi đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('phanquyen');
    localStorage.removeItem('username');
    localStorage.removeItem('tenkhach');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//Tạo một Custom Hook để các file khác gọi cho nhanh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};