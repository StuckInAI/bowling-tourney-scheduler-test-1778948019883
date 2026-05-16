import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberMyBookings() {
  const { currentUser, bookings, cancelBooking } = useAppContext();

  const myBookings = bookings
    .filter(b => b.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-slate-500">View and manage your lane reservations.</p>
      </div>

      {myBookings.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🎳</div>
          <p className="text-slate-500">No bookings yet. Book your first lane!</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {myBookings.map(b => (
            <Card key={b.id}>
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🎳</div>
                  <div>
                    <div className="font-bold">Lane {b.lane}</div>
                    <div className="text-sm text-slate-500">
                      {formatDate(new Date(b.date + 'T12:00:00'))} · {b.startTime || b.time} – {b.endTime}
                    </div>
                    {b.confirmationCode && (
                      <div className="text-xs font-mono text-slate-400 mt-0.5">Code: {b.confirmationCode}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'danger'}>
                    {b.status}
                  </Badge>
                  {b.status === 'confirmed' && (
                    <Button
                      variant="danger"
                      size="sm"
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
