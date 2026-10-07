import AdminIcon from '../ui/AdminIcon';
import { useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiBarChart2,
  FiCalendar,
  FiFileText,
  FiScissors,
  FiTag,
  FiShield,
  FiUsers,
  FiBriefcase,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menus = [
  {
    name: 'Tổng quan',
    url: '/admin/dashboard',
    icon: FiGrid,
    roles: [1, 2, 3, 4, 5],
    group: 'Điều hành',
  },
  {
    name: 'Lịch hẹn',
    url: '/admin/bookings',
    icon: FiCalendar,
    roles: [1, 2, 3, 5],
    group: 'Điều hành',
  },
  {
    name: 'Hoá đơn',
    url: '/admin/invoices',
    icon: FiFileText,
    roles: [1, 2, 4],
    group: 'Điều hành',
  },
  { name: 'Báo cáo', url: '/admin/reports', icon: FiBarChart2, roles: [1, 2], group: 'Điều hành' },
  { name: 'Dịch vụ', url: '/admin/services', icon: FiScissors, roles: [1, 2], group: 'Quản lý' },
  { name: 'Khuyến mại', url: '/admin/promotions', icon: FiTag, roles: [1], group: 'Quản lý' },
  { name: 'Khách hàng', url: '/admin/customers', icon: FiUsers, roles: [1, 2], group: 'Quản lý' },
  { name: 'Nhân viên', url: '/admin/staff', icon: FiBriefcase, roles: [1, 2], group: 'Quản lý' },
  { name: 'Tài khoản', url: '/admin/accounts', icon: FiShield, roles: [1], group: 'Quản lý' },
];
const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);
  const role = Number(user?.role || localStorage.getItem('phanquyen') || 0);
  const visible = menus.filter((menu) => menu.roles.includes(role));
  useEffect(() => {
    if (!open) return;
    const sidebar = sidebarRef.current;
    const focusable = () =>
      Array.from(sidebar?.querySelectorAll<HTMLElement>('a[href], button') || []).filter(
        (el) => el.getClientRects().length,
      );
    focusable()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    sidebar?.addEventListener('keydown', trapFocus);
    return () => sidebar?.removeEventListener('keydown', trapFocus);
  }, [open]);
  const close = () => {
    onClose();
    document.getElementById('toggleSidebar')?.focus();
  };
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };
  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${open ? 'open' : ''}`}
      id="sidebar"
      aria-label="Menu quản trị"
    >
      <div className="brand">
        <Link to="/admin/dashboard" onClick={onClose} aria-label="DHair - Tổng quan">
          <img className="admin-brand-logo" src="/img/logoDHair_V1.png" alt="DHair" />
        </Link>
        <button className="admin-sidebar-close" onClick={close} aria-label="Đóng thanh điều hướng">
          <AdminIcon icon={FiX} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Điều hướng quản trị">
        {['Điều hành', 'Quản lý'].map((group) => {
          const items = visible.filter((menu) => menu.group === group);
          return items.length ? (
            <div className="admin-nav-group" key={group}>
              <p>{group}</p>
              {items.map((menu) => (
                <NavLink key={menu.url} to={menu.url} onClick={onClose}>
                  <AdminIcon icon={menu.icon} aria-hidden="true" />
                  <span>{menu.name}</span>
                </NavLink>
              ))}
            </div>
          ) : null;
        })}
      </nav>
      <div className="admin-sidebar-account">
        <span className="admin-avatar" aria-hidden="true">
          {user?.username?.slice(0, 1).toUpperCase() || 'D'}
        </span>
        <div>
          <strong>{user?.username || 'Chưa đăng nhập'}</strong>
          <small>Tài khoản quản trị</small>
        </div>
      </div>
      <div className="sidebar-footer">
        <button onClick={handleLogout}>
          <AdminIcon icon={FiLogOut} aria-hidden="true" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
