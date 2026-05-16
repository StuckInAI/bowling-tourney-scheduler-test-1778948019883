import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Trophy, Clock } from 'lucide-react';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments } = useAppContext();

  const myBookings = bookings.filter(
    (b) => b.userId === currentUser?.id && b.status === 'confirmed'
  ).slice(0, 3);

  const upcomingTournaments = tournaments.filter(
    (t) => t.status === 'upcoming'
  ).slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Welcome back, {currentUser?.name}!</h1>
        <p style={{ color: '#64748b' }}>Here's what's happening at the club.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Calendar style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Your Next Bookings</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myBookings.length > 0 ? (
              myBookings.map((b) => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>Lane {b.lane}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatDate(new Date(b.date))}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.time || `${b.startTime}–${b.endTime}`}</div>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>No upcoming bookings.</p>
            )}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Trophy style={{ color: 'var(--color-accent-dark)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Upcoming Tournaments</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingTournaments.length > 0 ? (
              upcomingTournaments.map((t) => (
                <div key={t.id} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{formatDate(new Date(t.date))}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.participants.length} / {t.maxParticipants} participants</div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>No tournaments scheduled.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}