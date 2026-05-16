import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  CalendarDays,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎳</span>
            <span className={styles.logoText}>BowlPro</span>
          </div>
          <nav className={styles.headerNav}>
            <button className={styles.navLink} onClick={() => navigate('/public-booking')}>
              Book a Lane
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Join Now
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🎳 Premium Bowling Experience</div>
          <h1 className={styles.heroTitle}>
            Strike Your
            <span className={styles.heroAccent}> Perfect Game</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Join BowlPro for exclusive lane bookings, tournaments, and a community
            of bowling enthusiasts. Reserve your lane in seconds.
          </p>
          <div className={styles.heroCta}>
            <Button size="lg" onClick={() => navigate('/register')}>
              Get Started Free
              <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/public-booking')}>
              Book as Guest
            </Button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>🎳</div>
            <div className={styles.heroCardText}>
              <span className={styles.heroCardTitle}>Lane Available</span>
              <span className={styles.heroCardSub}>Tonight at 7:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionSubtitle}>
            From casual games to competitive tournaments, BowlPro has it all.
          </p>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <CalendarDays size={32} className={styles.featureIcon} />
              <h3>Easy Booking</h3>
              <p>Reserve lanes instantly with our intuitive booking system. View real-time availability.</p>
            </div>
            <div className={styles.featureCard}>
              <Trophy size={32} className={styles.featureIcon} />
              <h3>Tournaments</h3>
              <p>Join exciting tournaments and compete with fellow bowling enthusiasts.</p>
            </div>
            <div className={styles.featureCard}>
              <Users size={32} className={styles.featureIcon} />
              <h3>Member Benefits</h3>
              <p>Exclusive discounts, priority booking, and access to member-only events.</p>
            </div>
            <div className={styles.featureCard}>
              <Star size={32} className={styles.featureIcon} />
              <h3>Premium Lanes</h3>
              <p>State-of-the-art lanes with automatic scoring and comfortable seating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Simple Pricing</h2>
          <p className={styles.sectionSubtitle}>Choose the plan that works for you.</p>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>Guest</h3>
              <div className={styles.price}><span className={styles.priceAmount}>$25</span>/hour</div>
              <ul className={styles.priceFeatures}>
                <li><CheckCircle size={16} /> Lane booking</li>
                <li><CheckCircle size={16} /> Equipment rental</li>
                <li><CheckCircle size={16} /> Shoe rental</li>
              </ul>
              <Button variant="ghost" fullWidth onClick={() => navigate('/public-booking')}>
                Book Now
              </Button>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingBadge}>Most Popular</div>
              <h3>Member</h3>
              <div className={styles.price}><span className={styles.priceAmount}>$49</span>/month</div>
              <ul className={styles.priceFeatures}>
                <li><CheckCircle size={16} /> Unlimited bookings</li>
                <li><CheckCircle size={16} /> 20% discount on extras</li>
                <li><CheckCircle size={16} /> Tournament access</li>
                <li><CheckCircle size={16} /> Priority lanes</li>
              </ul>
              <Button fullWidth onClick={() => navigate('/register')}>
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <span>🎳</span>
            <span>BowlPro</span>
          </div>
          <p className={styles.footerText}>© 2024 BowlPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
