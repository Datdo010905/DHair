import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

interface PrivateRouteProps {
  allowedRoles?: number[];
}

// Chặn giao diện ngay trong lần render; API vẫn phải tự xác minh quyền từ token.
const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('phanquyen');
  const role = storedRole === null ? null : Number(storedRole);
  const hasRole = role !== null && (!allowedRoles || allowedRoles.includes(role));

  useEffect(() => {
    if (token && !hasRole) {
      toast.error('Bạn không có quyền truy cập trang này!', { toastId: 'loi-vuot-quyen' });
    }
  }, [token, hasRole]);

  if (!token) return <Navigate to="/login" replace />;
  if (!hasRole) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PrivateRoute;
