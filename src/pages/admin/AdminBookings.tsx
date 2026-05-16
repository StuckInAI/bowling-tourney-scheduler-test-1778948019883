import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function AdminBookings() {
  const { bookings, cancelBooking } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'member' | 'outsider' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const filtered = bookings
    .filter(b => {
      if (filter === 'cancelled') return b.status === 'cancelled';
      if (filter === 'member') return b.type === 'member' && b.status === 'confirmed';
      if (filter === 'outsider') return b.type === 'outsider' && b.status === 'confirmed';
      return true;
    })
    .filter(b => {
      const name = (b.userName || b.outsiderName || '').toLowerCase();
      const email = (b.userEmail || b.outsiderEmail || '').toLowerCase();
      return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-slate-500">{bookings.length} total bookings.</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded-md px-3 py-2 text-sm w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'member', 'outsider', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500">No bookings found.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(b => (
            <Card key={b.id}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{b.type === 'outsider' ? '🚶' : '👤'}</div>
                  <div>
                    <div className="font-bold">{b.userName || b.outsiderName || 'Unknown'}</div>
                    <div className="text-sm text-slate-500">{b.userEmail || b.outsiderEmail}</div>
                    <div className="text-xs text-slate-400">
                      Lane {b.lane} · {formatDate(new Date(b.date + 'T12:00:00'))} · {b.startTime || b.time} – {b.endTime}
                    </div>
                    {b.confirmationCode && (
                      <div className="text-xs font-mono text-slate-400">Code: {b.confirmationCode}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={b.type === 'outsider' ? 'warning' : 'info'}>
                    {b.type || 'member'}
                  </Badge>
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'danger'}>
                    {b.status}
                  </Badge>
                  {b.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
