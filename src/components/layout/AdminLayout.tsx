import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Trophy,
  BookOpen,
  Bell,
  LogOut,
  Menu,
  X,
  Bowling,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { getInitials } from '@/lib/utils';
import styles from './Layout.module.css';

const navItems = [
  { to: '/admin/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/slots', icon: CalendarDays, label: 'Slot Management' },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/tournaments', icon: Trophy, label: 'Tournaments' },
  { to: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

export default function AdminLayout() {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${styles.adminSidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Bowling size={24} className={styles.logo} />
          <span className={styles.logoText}>BowlPro Admin</span>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {currentUser && (
            <div className={styles.userInfo}>
              <div className={`${styles.avatar} ${styles.adminAvatar}`}>
                {getInitials(currentUser.name)}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{currentUser.name}</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={`${styles.topbar} ${styles.adminTopbar}`}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className={styles.topbarTitle}>Admin Dashboard</div>
          <div className={styles.topbarRight}>
            {currentUser && (
              <div className={`${styles.avatarSm} ${styles.adminAvatarSm}`}>
                {getInitials(currentUser.name)}
              </div>
            )}
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
