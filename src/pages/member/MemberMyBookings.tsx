import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { CalendarX } from 'lucide-react';

export default function MemberMyBookings() {
  const { currentUser, bookings, cancelBooking } = useAppContext();

  const myBookings = bookings
    .filter((b) => b.userId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Bookings</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Manage your lane reservations.</p>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {myBookings.length > 0 ? (
          myBookings.map((b) => (
            <Card key={b.id} padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Lane {b.lane}</div>
                  <div style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem' }}>
                    {formatDate(new Date(b.date))} at {b.time || `${b.startTime} - ${b.endTime}`}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'danger'}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </Badge>

                  {b.status === 'confirmed' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => cancelBooking(b.id)}
                    >
                      <CalendarX size={14} />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-gray-500)' }}>You haven't made any bookings yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}