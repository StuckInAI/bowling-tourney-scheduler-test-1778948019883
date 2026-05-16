import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>🎳 BowlPro</span>
        </div>
        <div className={styles.nav}>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Join Now</Button>
          </Link>
        </div>
      </header>

      <main className={styles.hero}>
        <h1 className={styles.title}>The Ultimate Bowling Experience</h1>
        <p className={styles.subtitle}>
          Book lanes in seconds, join competitive tournaments, and track your progress. 
          Elevate your game with BowlPro.
        </p>
        <div className={styles.cta}>
          <Link to="/public-booking">
            <Button variant="accent" size="lg">Reserve a Lane</Button>
          </Link>
          <Link to="/register">
            <Button variant="ghost" size="lg">Become a Member</Button>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 BowlPro Reservation Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}