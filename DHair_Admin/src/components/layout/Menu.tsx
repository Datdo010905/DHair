import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  menus: { url: string; name: string }[];
}

export default function Menu({ menus }: MenuProps) {
  const { pathname } = useLocation();
  return (
    <nav className="dh-shell dh-navigation" aria-label="Điều hướng chính">
      <div className="dh-shell-width dh-navigation-row">
        <ul>
          {menus.map(menu => <li key={menu.url}>
            <NavLink to={menu.url} className={({ isActive }) =>
              isActive || (menu.url === '/home' && pathname === '/') ? 'dh-nav-link dh-nav-active' : 'dh-nav-link'
            }>{menu.name}</NavLink>
          </li>)}
          <li><NavLink to="/datlich" className={({ isActive }) => isActive ? 'dh-nav-link dh-nav-active' : 'dh-nav-link'}>Đặt lịch</NavLink></li>
        </ul>
        <a className="dh-nav-contact" href="#support">Liên hệ & hỗ trợ ↗</a>
      </div>
    </nav>
  );
}
