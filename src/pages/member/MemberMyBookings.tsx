import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function MemberMyBookings() {
  const { currentUser, bookings, updateBooking } = useAppContext();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id);

  const handleCancel = (id: string) => {
    const booking = myBookings.find(b => b.id === id);
    if (booking) {
      updateBooking({ ...booking, status: 'cancelled' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a5f' }}>My Bookings</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>View and manage your lane reservations</p>
      </div>

      {myBookings.length === 0 ? (
        <Card>
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>You have no bookings yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myBookings.map(b => (
            <Card key={b.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Lane {b.laneNumber ?? b.lane}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    📅 {formatDate(new Date(b.date))} · {b.time ?? `${b.startTime ?? ''}–${b.endTime ?? ''}`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'danger'}>{b.status}</Badge>
                  {b.status === 'confirmed' && (
                    <Button size="sm" variant="danger" onClick={() => handleCancel(b.id)}>Cancel</Button>
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
