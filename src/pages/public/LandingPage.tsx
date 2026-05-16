import styles from './LandingPage.module.css';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const features = [
  { icon: '🎳', title: 'Lane Booking', desc: 'Reserve bowling lanes for any time slot with ease.' },
  { icon: '🏆', title: 'Tournaments', desc: 'Join or follow exciting bowling tournaments.' },
  { icon: '👥', title: 'Membership', desc: 'Enjoy member benefits and priority bookings.' },
  { icon: '📅', title: 'Schedules', desc: 'View real-time availability of all lanes.' },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroIcon}>🎳</div>
        <h1 className={styles.heroTitle}>Welcome to BowlPro</h1>
        <p className={styles.heroSub}>
          The easiest way to book bowling lanes, join tournaments, and manage your membership.
        </p>
        <div className={styles.heroBtns}>
          <Link to="/login">
            <Button variant="accent" size="lg">Member Login</Button>
          </Link>
          <Link to="/public-booking">
            <Button variant="ghost" size="lg">Book as Guest</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg">Register</Button>
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything You Need</h2>
        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Bowl?</h2>
        <p className={styles.ctaSub}>Sign up today and get access to exclusive member perks.</p>
        <Link to="/register">
          <Button variant="accent" size="lg">Get Started</Button>
        </Link>
      </section>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} BowlPro. All rights reserved.
      </footer>
    </div>
  );
}
