import { useAppContext } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments } = useAppContext();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id && b.status === 'confirmed');
  const upcomingBookings = myBookings.slice(0, 3);
  const openTournaments = tournaments.filter((t) => t.registrationOpen).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '0.25rem' }}>
          Welcome back, {currentUser?.name}!
        </h2>
        <p style={{ color: '#64748b' }}>
          {currentUser?.subscription !== 'none'
            ? `Active ${currentUser?.subscription} subscription`
            : 'No active subscription'}
          {currentUser?.subscriptionExpiry
            ? ` · Expires: ${formatDate(new Date(currentUser.subscriptionExpiry))}`
            : ''}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a5f' }}>{myBookings.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Active Bookings</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a5f' }}>{openTournaments.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Open Tournaments</div>
        </Card>
        <Card>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a5f', textTransform: 'capitalize' }}>
            {currentUser?.subscription || 'None'}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Subscription</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Upcoming Bookings</h3>
          {upcomingBookings.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No upcoming bookings.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingBookings.map(b => (
                <div key={b.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Lane {b.lane} · {b.date}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.time}</div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Open Tournaments</h3>
          {openTournaments.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No open tournaments.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {openTournaments.map(t => (
                <div key={t.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.date}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.registeredParticipants.length} / {t.maxParticipants} participants</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
