import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments } = useAppContext();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id).slice(0, 3);
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3);

  const subLabel = currentUser?.subscription === 'none'
    ? 'No Subscription'
    : `${currentUser?.subscription?.charAt(0).toUpperCase()}${currentUser?.subscription?.slice(1)}`
      + (currentUser?.subscriptionExpiry
        ? ` · Expires: ${formatDate(new Date(currentUser.subscriptionExpiry))}`
        : '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a5f' }}>Welcome back, {currentUser?.name}! 🎳</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Here's your bowling overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Subscription</div>
          <div style={{ fontWeight: 700, color: '#1e3a5f' }}>{subLabel}</div>
        </Card>
        <Card>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>My Bookings</div>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1e3a5f' }}>{bookings.filter(b => b.userId === currentUser?.id).length}</div>
        </Card>
        <Card>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Tournaments Available</div>
          <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1e3a5f' }}>{upcomingTournaments.length}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Recent Bookings</h2>
          {myBookings.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No bookings yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myBookings.map(b => (
                <div key={b.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Lane {b.laneNumber ?? b.lane} · {b.date}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.time ?? `${b.startTime}–${b.endTime}`}</div>
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'danger'}>{b.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Upcoming Tournaments</h2>
          {upcomingTournaments.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No upcoming tournaments.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingTournaments.map(t => (
                <div key={t.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{formatDate(new Date(t.date))}</div>
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
