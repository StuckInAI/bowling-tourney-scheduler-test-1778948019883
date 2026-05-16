import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';

export default function AdminOverview() {
  const { users, slots, bookings, tournaments } = useAppContext();

  const members = users.filter(u => u.role === 'member');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');
  const availableSlots = slots.filter(s => s.status === 'available' && s.date === todayStr);
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Overview</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Bowling center at a glance.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{members.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Total Members</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{todayBookings.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Today's Bookings</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{availableSlots.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Available Slots</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{upcomingTournaments.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>Upcoming Tournaments</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Bookings */}
        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p style={{ color: 'var(--color-gray-400)', textAlign: 'center', padding: '1.5rem 0' }}>No bookings yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map(b => (
                <div key={b.id} style={{ padding: '0.75rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.userName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)' }}>Lane {b.laneNumber} · {formatDate(b.date)} {formatTime(b.startTime)}</div>
                  </div>
                  <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'neutral'}>{b.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tournaments */}
        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Tournaments</h2>
          {tournaments.length === 0 ? (
            <p style={{ color: 'var(--color-gray-400)', textAlign: 'center', padding: '1.5rem 0' }}>No tournaments.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tournaments.slice(0, 4).map(t => (
                <div key={t.id} style={{ padding: '0.75rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)' }}>{formatDate(t.date)} · {t.registeredParticipants.length}/{t.maxParticipants}</div>
                  </div>
                  <Badge variant={t.status === 'upcoming' ? 'info' : t.status === 'ongoing' ? 'success' : 'neutral'}>{t.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
