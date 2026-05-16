import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { formatDate } from '@/lib/utils';

export default function AdminOverview() {
  const { users, bookings, tournaments, slots } = useAppContext();

  const members = users.filter((u) => u.role === 'member');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const availableSlots = slots.filter((s) => s.status === 'available');
  const openTournaments = tournaments.filter((t) => t.status === 'open');

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard title="Total Members" value={members.length} icon="👥" color="blue" />
        <StatCard title="Confirmed Bookings" value={confirmedBookings.length} icon="📋" color="green" />
        <StatCard title="Available Slots" value={availableSlots.length} icon="🎳" color="purple" />
        <StatCard title="Open Tournaments" value={openTournaments.length} icon="🏆" color="orange" />
      </div>

      <Card>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p style={{ color: '#64748b' }}>No bookings yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentBookings.map((b) => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{b.userName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Lane {b.lane} · {formatDate(new Date(b.date))}</div>
                </div>
                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '999px', background: b.status === 'confirmed' ? '#dcfce7' : '#fee2e2', color: b.status === 'confirmed' ? '#15803d' : '#b91c1c' }}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
