import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const features = [
  { icon: '🎳', title: 'Easy Booking', desc: 'Reserve lanes in seconds, anytime.' },
  { icon: '🏆', title: 'Tournaments', desc: 'Join exciting bowling tournaments.' },
  { icon: '💳', title: 'Memberships', desc: 'Exclusive perks for members.' },
];

export default function LandingPage() {
  return (
    <div className={styles.hero}>
      <div className={styles.logo}>🎳</div>
      <h1 className={styles.title}>BowlPro</h1>
      <p className={styles.subtitle}>The modern bowling reservation system for members and walk-ins alike.</p>
      <div className={styles.actions}>
        <Link to="/login" className={styles.btnPrimary}>Member Login</Link>
        <Link to="/register" className={styles.btnSecondary}>Join Now</Link>
        <Link to="/public-booking" className={styles.btnSecondary}>Book as Guest</Link>
      </div>
      <div className={styles.features}>
        {features.map(f => (
          <div key={f.title} className={styles.feature}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <div className={styles.featureTitle}>{f.title}</div>
            <div className={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
