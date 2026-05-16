import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { CalendarDays, Trophy, BookOpen } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { TournamentStatus } from '@/types';

export default function MemberDashboard() {
  const { currentUser, bookings, tournaments, slots } = useAppContext();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id && b.status !== 'cancelled');
  const upcomingTournaments = tournaments.filter(
    (t) => t.status === 'upcoming' || t.status === 'ongoing'
  );
  const availableSlots = slots.filter(s => s.status === 'available');

  const statusVariant = (s: TournamentStatus): 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'purple' => {
    if (s === 'upcoming') return 'info';
    if (s === 'ongoing') return 'success';
    if (s === 'completed') return 'neutral';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Welcome back, {currentUser?.name}!</h1>
        <p className="text-slate-500 text-sm mt-1">Here's your bowling activity overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><BookOpen size={20} /></div>
            <span className="text-sm font-medium text-slate-500">My Bookings</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{myBookings.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-50 text-green-600"><CalendarDays size={20} /></div>
            <span className="text-sm font-medium text-slate-500">Available Slots</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{availableSlots.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><Trophy size={20} /></div>
            <span className="text-sm font-medium text-slate-500">Tournaments</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{upcomingTournaments.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Upcoming Tournaments</h2>
          <Link to="/member/tournaments" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        {upcomingTournaments.length === 0 ? (
          <p className="text-sm text-slate-400">No upcoming tournaments.</p>
        ) : (
          <div className="space-y-3">
            {upcomingTournaments.slice(0, 3).map(t => (
              <div key={t.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0">
                <div>
                  <div className="font-medium text-sm text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.startDate} &ndash; {t.endDate}</div>
                </div>
                <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
