import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments } = useAppContext();

  const myBookings = bookings
    .filter(b => b.userId === currentUser?.id && b.status === 'confirmed')
    .slice(0, 5);

  const myTournaments = tournaments.filter(
    t =>
      t.participants.find(p => p.userId === currentUser?.id) &&
      (t.status === 'upcoming' || t.status === 'active')
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {currentUser?.name}!</h1>
        <p className="text-slate-500 mt-1">Here's a summary of your activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">My Bookings</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{myBookings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Tournaments Joined</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{myTournaments.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Subscription</p>
          <p className="text-3xl font-bold text-slate-800 mt-1 capitalize">{currentUser?.subscriptionTier ?? 'None'}</p>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Bookings</h2>
        {myBookings.length === 0 ? (
          <p className="text-slate-400 text-sm">No bookings yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {myBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium text-slate-700">Lane {b.lane} &mdash; {b.startTime}–{b.endTime}</div>
                  <div className="text-xs text-slate-500">{formatDate(new Date(b.date + 'T12:00:00'))}</div>
                </div>
                <Badge variant={b.status === 'confirmed' ? 'success' : 'neutral'}>{b.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">My Tournaments</h2>
        {myTournaments.length === 0 ? (
          <p className="text-slate-400 text-sm">Not enrolled in any tournaments.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {myTournaments.map(t => (
              <div key={t.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium text-slate-700">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.startDate} &ndash; {t.endDate}</div>
                </div>
                <Badge variant={t.status === 'active' ? 'success' : 'info'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
