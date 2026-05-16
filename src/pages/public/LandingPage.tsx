import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const features = [
  { icon: '🎳', title: 'Easy Lane Booking', desc: 'Book your preferred lane in seconds, any time of day.' },
  { icon: '🏆', title: 'Tournaments', desc: 'Join exciting bowling tournaments and compete for prizes.' },
  { icon: '👥', title: 'Member Benefits', desc: 'Exclusive discounts and priority booking for members.' },
  { icon: '📱', title: 'Real-time Updates', desc: 'Instant confirmation and live slot availability.' },
  { icon: '💳', title: 'Flexible Plans', desc: 'Choose from Basic, Premium, or VIP membership tiers.' },
  { icon: '🌐', title: 'Public Booking', desc: 'No account needed for casual bowlers. Book as a guest.' },
];

const plans = [
  {
    name: 'Basic',
    price: '$19',
    period: '/month',
    features: ['5 lane bookings/month', 'Standard time slots', 'Email confirmations', 'Tournament access'],
    featured: false,
  },
  {
    name: 'Premium',
    price: '$39',
    period: '/month',
    features: ['Unlimited bookings', 'Priority time slots', 'SMS + Email alerts', 'Tournament priority', 'Guest passes (2/mo)'],
    featured: true,
  },
  {
    name: 'VIP',
    price: '$69',
    period: '/month',
    features: ['Unlimited bookings', 'VIP lane access', 'Dedicated support', 'Free tournament entry', 'Guest passes (5/mo)', 'Locker room access'],
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logo}>🎳</div>
          <h1 className={styles.heroTitle}>Strike Your Way to Fun</h1>
          <p className={styles.heroSubtitle}>
            The ultimate bowling reservation system. Book lanes, join tournaments,
            and become part of our bowling community.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/register" className={styles.btnPrimary}>🎳 Join Now — It's Free</Link>
            <Link to="/public-booking" className={styles.btnSecondary}>Book as Guest →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <h2 className={styles.sectionTitle}>Everything You Need to Bowl</h2>
          <div className={styles.featureGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <div className={styles.pricingInner}>
          <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <div key={plan.name} className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}>
                {plan.featured && <span className={styles.pricingBadge}>Most Popular</span>}
                <div className={styles.pricingName}>{plan.name}</div>
                <div className={styles.pricingPrice}>{plan.price}</div>
                <div className={styles.pricingPeriod}>{plan.period}</div>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((f) => <li key={f}>✓ {f}</li>)}
                </ul>
                <Link
                  to="/register"
                  className={`${styles.pricingBtn} ${plan.featured ? styles.pricingBtnFeatured : styles.pricingBtnOutline}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 BowlPro. All rights reserved. 🎳</p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', marginRight: '1rem' }}>Login</Link>
          <Link to="/register" style={{ color: 'rgba(255,255,255,0.6)', marginRight: '1rem' }}>Register</Link>
          <Link to="/public-booking" style={{ color: 'rgba(255,255,255,0.6)' }}>Guest Booking</Link>
        </p>
      </footer>
    </div>
  );
}
