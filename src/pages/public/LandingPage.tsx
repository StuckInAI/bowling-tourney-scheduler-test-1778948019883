import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span>🎳</span>
          <span>BowlPro</span>
        </div>
        <div className="flex gap-3">
          <Link to="/public-booking">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Walk-in Booking</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Join Now</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <div className="text-7xl mb-6">🎳</div>
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Reserve Your Lane.<br />Dominate the Alley.
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          BowlPro manages 16 professional bowling lanes with instant online booking, yearly memberships, and competitive tournaments.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link to="/public-booking">
            <Button variant="secondary" size="lg">Walk-in Slots</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          { icon: '🎯', title: '16 Premium Lanes', desc: 'State-of-the-art bowling lanes available for booking 7 days a week, 9am to 10pm.' },
          { icon: '🏆', title: 'Tournaments', desc: 'Compete in single-elimination, round-robin, and custom format tournaments.' },
          { icon: '⚡', title: 'Instant Booking', desc: 'Members book slots in seconds. Walk-ins can grab available slots within 24 hours.' },
        ].map(f => (
          <div key={f.title} className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to bowl?</h2>
        <p className="text-slate-400 mb-8">Join today and get access to exclusive member rates and tournament invites.</p>
        <Link to="/register">
          <Button size="lg">Create Member Account</Button>
        </Link>
      </section>

      <footer className="border-t border-white/10 text-center py-6 text-slate-500 text-sm">
        © {new Date().getFullYear()} BowlPro. All rights reserved.
      </footer>
    </div>
  );
}
