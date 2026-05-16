import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Trophy, Star } from 'lucide-react';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments } = useAppContext();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id).slice(0, 5);
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3);

  const subLabel = currentUser?.subscription === 'none'
    ? 'No Active Plan'
    : `${currentUser?.subscription?.charAt(0).toUpperCase()}${currentUser?.subscription?.slice(1)} Plan`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back, {currentUser?.name}!</h1>
        <p style={{ color: '#64748b' }}>Manage your bookings and tournament registrations.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '0.5rem' }}><Star color="#eab308" /></div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Membership</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{subLabel}</p>
            </div>
          </div>
          <Badge variant={currentUser?.subscription === 'none' ? 'neutral' : 'purple'}>
            {currentUser?.subscription?.toUpperCase() || 'NONE'}
          </Badge>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '0.5rem' }}><Calendar color="#3b82f6" /></div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Recent Bookings</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{myBookings.length} total bookings</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myBookings.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Lane {b.laneNumber ?? b.lane} · {b.date}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.time || `${b.startTime}–${b.endTime}`}</div>
                </div>
                <Badge variant={b.status === 'confirmed' ? 'success' : 'neutral'}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '0.5rem' }}><Trophy color="#f59e0b" /></div>
            <div>
              <h3 style={{ fontWeight: 600 }}>Tournaments</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Join upcoming events</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingTournaments.map(t => (
              <div key={t.id} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{formatDate(new Date(t.date))}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.participants.length} / {t.maxParticipants} participants</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}