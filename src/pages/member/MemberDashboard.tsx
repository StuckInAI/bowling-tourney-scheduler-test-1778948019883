import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments, notifications } = useAppContext();

  const myBookings = bookings
    .filter((b) => b.userId === currentUser?.id && b.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const openTournaments = tournaments.filter((t) => t.status === 'open').slice(0, 3);

  const myNotifications = notifications
    .filter((n) => !n.targetRole || n.targetRole === 'member')
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back, {currentUser?.name?.split(' ')[0]}! 🎳</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Here's what's happening with your account.</p>
      </div>

      {currentUser?.subscriptionTier && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Your Subscription</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {currentUser.subscriptionExpiry
                  ? `Expires: ${formatDate(new Date(currentUser.subscriptionExpiry))}`
                  : 'No expiry set'}
              </div>
            </div>
            <Badge variant={currentUser.subscriptionTier === 'vip' ? 'purple' : currentUser.subscriptionTier === 'premium' ? 'info' : 'neutral'}>
              {currentUser.subscriptionTier.toUpperCase()}
            </Badge>
          </div>
        </Card>
      )}

      <Card>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Upcoming Bookings</h2>
        {myBookings.length === 0 ? (
          <p style={{ color: '#64748b' }}>No upcoming bookings. <a href="/member/booking" style={{ color: '#1e3a5f' }}>Book a lane</a>.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myBookings.map((b) => (
              <div key={b.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600 }}>Lane {b.lane}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{formatDate(new Date(b.date))} · {b.startTime}–{b.endTime}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Open Tournaments</h2>
        {openTournaments.length === 0 ? (
          <p style={{ color: '#64748b' }}>No open tournaments right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {openTournaments.map((t) => (
              <div key={t.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.participants.length} / {t.maxParticipants} participants</div>
                </div>
                <Badge variant="success">Open</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {myNotifications.length > 0 && (
        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myNotifications.map((n) => (
              <div key={n.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600 }}>{n.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{n.message}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
