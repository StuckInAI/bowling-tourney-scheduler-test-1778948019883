import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberMyBookings() {
  const { bookings, currentUser, cancelBooking } = useAppContext();

  const myBookings = bookings.filter((b) => b.userId === currentUser?.id);

  const statusVariant = (status: string) => {
    if (status === 'confirmed') return 'success';
    if (status === 'cancelled') return 'danger';
    return 'neutral';
  };

  if (myBookings.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h2>No Bookings Yet</h2>
          <p style={{ color: '#64748b' }}>You haven't made any bookings yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Bookings</h1>
      {myBookings.map((b) => (
        <Card key={b.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Lane {b.lane}</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                📅 {formatDate(new Date(b.date))} · {b.startTime}–{b.endTime}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <Badge variant={statusVariant(b.status) as any}>{b.status}</Badge>
              {b.status === 'confirmed' && (
                <Button size="sm" variant="danger" onClick={() => cancelBooking(b.id)}>Cancel</Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
