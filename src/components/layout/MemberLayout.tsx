import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Trophy,
  User,
  CreditCard,
  LogOut,
  Menu,
  X,
  Bowling,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { getInitials } from '@/lib/utils';
import styles from './Layout.module.css';

const navItems = [
  { to: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/member/booking', icon: CalendarDays, label: 'Book Slot' },
  { to: '/member/my-bookings', icon: BookOpen, label: 'My Bookings' },
  { to: '/member/tournaments', icon: Trophy, label: 'Tournaments' },
  { to: '/member/profile', icon: User, label: 'Profile' },
  { to: '/member/subscription', icon: CreditCard, label: 'Subscription' },
];

export default function MemberLayout() {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Bowling size={24} className={styles.logo} />
          <span className={styles.logoText}>BowlPro</span>
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
              <div className={styles.avatar}>{getInitials(currentUser.name)}</div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{currentUser.name}</span>
                <span className={styles.userEmail}>{currentUser.email}</span>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className={styles.topbarTitle}>Member Portal</div>
          <div className={styles.topbarRight}>
            {currentUser && (
              <div className={styles.avatarSm}>{getInitials(currentUser.name)}</div>
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
