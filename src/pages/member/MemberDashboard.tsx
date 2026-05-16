import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '@/lib/utils';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments, slots } = useAppContext();
  const navigate = useNavigate();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id && b.status !== 'cancelled');
  const upcomingBookings = myBookings.filter(b => b.date >= new Date().toISOString().split('T')[0]).slice(0, 3);
  const myTournaments = tournaments.filter(t => currentUser && t.registeredParticipants.includes(currentUser.id));
  const availableSlots = slots.filter(s => s.status === 'available' && s.date >= new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back, {currentUser?.name?.split(' ')[0]}! 🎳</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Here's your bowling overview.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{myBookings.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Total Bookings</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{upcomingBookings.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Upcoming</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{myTournaments.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Tournaments</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{availableSlots.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Available Slots</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Upcoming Bookings */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700 }}>Upcoming Bookings</h2>
            <Button size="sm" variant="ghost" onClick={() => navigate('/member/my-bookings')}>View All</Button>
          </div>
          {upcomingBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-gray-400)' }}>
              <div style={{ fontSize: '2rem' }}>🎳</div>
              <p style={{ marginTop: '0.5rem' }}>No upcoming bookings</p>
              <Button size="sm" style={{ marginTop: '0.75rem' } as React.CSSProperties} onClick={() => navigate('/member/booking')}>Book a Lane</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingBookings.map(b => (
                <div key={b.id} style={{ padding: '0.75rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Lane {b.laneNumber}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{formatDate(b.date)} · {formatTime(b.startTime)}</div>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tournaments */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700 }}>My Tournaments</h2>
            <Button size="sm" variant="ghost" onClick={() => navigate('/member/tournaments')}>Browse</Button>
          </div>
          {myTournaments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-gray-400)' }}>
              <div style={{ fontSize: '2rem' }}>🏆</div>
              <p style={{ marginTop: '0.5rem' }}>No tournaments joined</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myTournaments.slice(0, 3).map(t => (
                <div key={t.id} style={{ padding: '0.75rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>{formatDate(t.date)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
