import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { formatDate, formatTime } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function MemberMyBookings() {
  const { currentUser, bookings, cancelBooking } = useAppContext();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const myBookings = bookings
    .filter(b => b.userId === currentUser?.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleCancel = () => {
    if (cancelId) {
      cancelBooking(cancelId);
      setCancelId(null);
    }
  };

  const statusVariant: Record<string, 'success' | 'danger' | 'neutral'> = {
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'neutral',
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Bookings</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>View and manage your lane reservations.</p>
      </div>

      {myBookings.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' } as React.CSSProperties}>
          <div style={{ fontSize: '3rem' }}>🎳</div>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>No bookings yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {myBookings.map(b => (
            <Card key={b.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Lane {b.laneNumber}</div>
                  <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formatDate(b.date)} · {formatTime(b.startTime)} – {formatTime(b.endTime)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant={statusVariant[b.status] ?? 'neutral'}>{b.status}</Badge>
                  {b.status === 'confirmed' && (
                    <Button size="sm" variant="danger" onClick={() => setCancelId(b.id)}>Cancel</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Booking">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Are you sure you want to cancel this booking?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setCancelId(null)}>Keep Booking</Button>
            <Button variant="danger" onClick={handleCancel}>Yes, Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
