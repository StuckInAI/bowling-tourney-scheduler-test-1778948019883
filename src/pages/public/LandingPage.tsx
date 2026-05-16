import { useNavigate } from 'react-router-dom';
import {
  Bowling,
  Trophy,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  Shield,
  Star,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  const handleCTA = () => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin/overview');
      else navigate('/member/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <Bowling size={28} />
          <span>BowlPro</span>
        </div>
        <div className={styles.navLinks}>
          <button onClick={() => navigate('/public-booking')} className={styles.navLink}>
            Book a Lane
          </button>
          {currentUser ? (
            <button
              onClick={() =>
                currentUser.role === 'admin'
                  ? navigate('/admin/overview')
                  : navigate('/member/dashboard')
              }
              className={styles.navBtn}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className={styles.navLink}>
                Login
              </button>
              <button onClick={() => navigate('/register')} className={styles.navBtn}>
                Join Now
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Star size={14} />
            Premium Bowling Experience
          </div>
          <h1 className={styles.heroTitle}>
            Bowl. Compete. <span className={styles.accent}>Champion.</span>
          </h1>
          <p className={styles.heroSub}>
            16 state-of-the-art lanes, exclusive member tournaments, and easy slot booking.
            Join our community and take your game to the next level.
          </p>
          <div className={styles.heroBtns}>
            <button onClick={handleCTA} className={styles.heroBtn}>
              {currentUser ? 'Go to Dashboard' : 'Become a Member'}
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/public-booking')}
              className={styles.heroBtnGhost}
            >
              Book as Guest
            </button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <Bowling size={64} className={styles.heroBowling} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>16</span>
              <span className={styles.heroStatLabel}>Bowling Lanes</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1hr</span>
              <span className={styles.heroStatLabel}>Per Slot</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>3+</span>
              <span className={styles.heroStatLabel}>Tournament Formats</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything You Need</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#dbeafe', color: '#1d4ed8' }}>
              <Calendar size={24} />
            </div>
            <h3>Easy Slot Booking</h3>
            <p>Book 1-hour slots across all 16 lanes. Members get priority, while remaining slots open to the public 24 hours before.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#fae8ff', color: '#7e22ce' }}>
              <Trophy size={24} />
            </div>
            <h3>Member Tournaments</h3>
            <p>Participate in Single Elimination, Round-Robin, and custom format tournaments exclusively for yearly members.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#dcfce7', color: '#15803d' }}>
              <Shield size={24} />
            </div>
            <h3>Yearly Membership</h3>
            <p>Subscribe yearly for $299 and unlock exclusive tournament access, priority bookings, and member-only perks.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#fef3c7', color: '#b45309' }}>
              <Clock size={24} />
            </div>
            <h3>Public Walk-ins</h3>
            <p>Any unbooked slot in the next 24 hours is publicly available. No account needed — just your name and contact info.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#fee2e2', color: '#b91c1c' }}>
              <Users size={24} />
            </div>
            <h3>Member Portal</h3>
            <p>Full self-service dashboard — view upcoming bookings, tournament brackets, match schedules, and subscription status.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#f1f5f9', color: '#475569' }}>
              <Bowling size={24} />
            </div>
            <h3>Admin Control</h3>
            <p>Complete admin panel for slot management, tournament creation, member administration, and booking oversight.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2>Ready to Roll?</h2>
        <p>Join today and get access to exclusive tournaments and priority lane booking.</p>
        <div className={styles.ctaBtns}>
          <button onClick={handleCTA} className={styles.heroBtn}>
            Get Started — $299/year
            <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/public-booking')} className={styles.heroBtnGhost} style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
            Book as Guest
          </button>
        </div>
        <p className={styles.ctaNote}>Demo credentials: admin@bowlpro.com / admin123 | alice@example.com / password123</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Bowling size={20} />
          <span>BowlPro</span>
        </div>
        <p>© 2025 BowlPro. All rights reserved.</p>
      </footer>
    </div>
  );
}
