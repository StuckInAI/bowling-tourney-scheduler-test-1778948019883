import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments } = useAppContext();

  const myBookings = bookings
    .filter(b => b.userId === currentUser?.id && b.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const myTournaments = tournaments.filter(t =>
    t.participants.some(p => p.userId === currentUser?.id)
  );

  const pendingInvites = myTournaments.filter(t =>
    t.participants.find(p => p.userId === currentUser?.id)?.status === 'pending'
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}! 🎳</h1>
        <p className="text-slate-500">Here's your bowling activity at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="My Bookings" value={myBookings.length} icon="📋" color="blue" />
        <StatCard title="Tournaments" value={myTournaments.length} icon="🏆" color="purple" />
        <StatCard title="Pending Invites" value={pendingInvites.length} icon="📩" color="orange" />
        <StatCard
          title="Subscription"
          value={currentUser?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
          icon="💳"
          color={currentUser?.subscriptionStatus === 'active' ? 'green' : 'red'}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Upcoming Bookings</h2>
            <Link to="/member/booking"><Button size="sm">Book Lane</Button></Link>
          </div>
          {myBookings.length === 0 ? (
            <p className="text-slate-500 text-sm">No upcoming bookings.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {myBookings.map(b => (
                <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Lane {b.lane}</div>
                    <div className="text-xs text-slate-500">{formatDate(new Date(b.date + 'T12:00:00'))} · {b.time || b.startTime}</div>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Tournament Invites</h2>
            <Link to="/member/tournaments"><Button size="sm" variant="secondary">View All</Button></Link>
          </div>
          {pendingInvites.length === 0 ? (
            <p className="text-slate-500 text-sm">No pending tournament invites.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingInvites.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.format} · {formatDate(new Date(t.startDate + 'T12:00:00'))}</div>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
