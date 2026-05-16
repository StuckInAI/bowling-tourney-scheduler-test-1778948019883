import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function MemberMyBookings() {
  const { currentUser, bookings, cancelBooking } = useAppContext();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id);

  const getStatusVariant = (status: string) => {
    if (status === 'confirmed') return 'success';
    if (status === 'cancelled') return 'danger';
    return 'warning';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Bookings</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Your reservation history</p>
      </div>

      {myBookings.length === 0 ? (
        <Card>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', padding: '2rem' }}>No bookings yet.</p>
        </Card>
      ) : (
        myBookings.map(b => (
          <Card key={b.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Lane {b.lane}</div>
                <div style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem' }}>{formatDate(new Date(b.date))} at {b.time}</div>
                {b.notes && <div style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{b.notes}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge variant={getStatusVariant(b.status) as 'success' | 'danger' | 'warning'}>{b.status}</Badge>
                {b.status === 'confirmed' && (
                  <Button variant="danger" size="sm" onClick={() => cancelBooking(b.id)}>Cancel</Button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
