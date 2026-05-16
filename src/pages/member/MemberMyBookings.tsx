import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function MemberMyBookings() {
  const { bookings, currentUser, cancelBooking } = useAppContext();
  const myBookings = bookings.filter(b => b.userId === currentUser?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
      {myBookings.length === 0 ? (
        <Card><p className="text-slate-500">No bookings yet.</p></Card>
      ) : (
        <div className="space-y-3">
          {myBookings.map(b => (
            <Card key={b.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{b.date} • {b.startTime} - {b.endTime}</div>
                  <div className="text-sm text-slate-500">Lane {b.lane}</div>
                  {b.confirmationCode && (
                    <div className="text-xs font-mono text-slate-400 mt-0.5">Code: {b.confirmationCode}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}>
                    {b.status}
                  </Badge>
                  {b.status === 'confirmed' && (
                    <Button size="sm" variant="danger" onClick={() => cancelBooking(b.id)}>Cancel</Button>
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
