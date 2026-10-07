import { Link, useNavigate } from 'react-router-dom';
import { FiPhone, FiUser, FiLogOut } from './ShellIcons';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    if (!window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) return;
    logout();
    toast.success('Đăng xuất thành công!');
    navigate('/login', { replace: true });
  };

  return (
    <div className="dh-shell dh-topbar">
      <div className="dh-shell-width dh-topbar-row">
        <div className="dh-topbar-contact">
          <span className="dh-topbar-message">DHair — Chăm sóc tóc, định hình phong cách</span>
          <a href="tel:0352512556">
            <FiPhone aria-hidden="true" />
            0352 512 556
          </a>
        </div>
        <div className="dh-topbar-account">
          <Link to={user ? '/profile' : '/login'}>
            <FiUser aria-hidden="true" />
            <span>{user ? user.username : 'Đăng nhập'}</span>
          </Link>
          {user ? (
            <button type="button" onClick={handleLogout}>
              <FiLogOut aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
          ) : (
            <Link to="/signup">Đăng ký</Link>
          )}
        </div>
      </div>
    </div>
  );
}
