import React, { useEffect, useState } from 'react';
import TopBarAdmin from './TopBarAdmin';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import '../../assets/css/admin.css';
import '../../assets/css/admin-shell.css';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        document.getElementById('toggleSidebar')?.focus();
      }
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return (
    <div className="admin-layout">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <button
          className="admin-sidebar-overlay"
          aria-label="Đóng menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="main">
        <TopBarAdmin
          sidebarOpen={mobileOpen}
          onToggleSidebar={() => setMobileOpen((value) => !value)}
        />
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
export default AdminLayout;
