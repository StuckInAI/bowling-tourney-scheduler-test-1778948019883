import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { Users, CalendarDays, Trophy, BookOpen } from 'lucide-react';

export default function AdminOverview() {
  const { users, slots, bookings, tournaments } = useAppContext();

  const members = users.filter(u => u.role === 'member');
  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={members.length} icon={<Users size={22} />} color="blue" />
        <StatCard title="Available Slots" value={slots.filter(s => s.status === 'available').length} icon={<CalendarDays size={22} />} color="green" />
        <StatCard title="Active Bookings" value={activeBookings.length} icon={<BookOpen size={22} />} color="purple" />
        <StatCard title="Upcoming Tournaments" value={upcomingTournaments.length} icon={<Trophy size={22} />} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          {activeBookings.length === 0 ? (
            <p className="text-slate-500 text-sm">No active bookings.</p>
          ) : (
            <div className="space-y-2">
              {activeBookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div style={{ fontWeight: 600 }}>{b.userName || b.outsiderName || 'Guest'}</div>
                    <div className="text-xs text-slate-500">{b.date} • Lane {b.lane}</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Confirmed</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Members</h2>
          {members.length === 0 ? (
            <p className="text-slate-500 text-sm">No members yet.</p>
          ) : (
            <div className="space-y-2">
              {members.slice(0, 5).map(m => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div className="text-xs text-slate-500">{m.email}</div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{m.subscriptionTier}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
