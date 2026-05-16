import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import Button from '@/components/ui/Button';

const features = [
  { icon: '🎳', title: 'Easy Booking', desc: 'Reserve your lane in seconds, anytime.' },
  { icon: '🏆', title: 'Tournaments', desc: 'Join exciting bowling tournaments.' },
  { icon: '💳', title: 'Memberships', desc: 'Flexible subscription plans for regulars.' },
  { icon: '📊', title: 'Admin Tools', desc: 'Powerful management dashboard.' },
];

export default function LandingPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.logo}>🎳</div>
        <h1 className={styles.title}>BowlPro Reservation</h1>
        <p className={styles.subtitle}>The modern way to book bowling lanes, join tournaments, and manage your membership.</p>
        <div className={styles.actions}>
          <Link to="/login"><Button variant="accent" size="lg">Login</Button></Link>
          <Link to="/register"><Button variant="ghost" size="lg">Register</Button></Link>
          <Link to="/public-booking"><Button variant="secondary" size="lg">View Availability</Button></Link>
        </div>
      </section>
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why BowlPro?</h2>
        <div className={styles.featuresGrid}>
          {features.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
