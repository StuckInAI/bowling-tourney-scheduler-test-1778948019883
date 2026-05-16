import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { formatDate, formatTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

export default function PublicBookingPage() {
  const { slots, addBooking } = useAppContext();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const availableSlots = slots.filter(
    s => s.date === selectedDate && s.status === 'available'
  );

  const handleBook = () => {
    if (!selectedSlot || !guestName || !guestEmail) return;
    const slot = slots.find(s => s.id === selectedSlot);
    if (!slot) return;

    const booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot,
      userId: 'guest',
      userName: guestName,
      userEmail: guestEmail,
      userType: 'outsider' as const,
      laneNumber: slot.laneNumber,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setBooked(true);
  };

  if (booked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)', padding: '1rem' }}>
        <Card style={{ textAlign: 'center', maxWidth: 400, width: '100%' } as React.CSSProperties}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Your lane has been reserved. See you on the lanes!</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-gray-50)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>← Back</button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>🎳 Book a Lane</h1>
        </div>

        <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Your Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Name" value={guestName} onChange={e => setGuestName(e.target.value)} required placeholder="John Doe" />
            <Input label="Email" type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
        </Card>

        <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Select Date</h2>
          <Input
            type="date"
            value={selectedDate}
            onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
            min={new Date().toISOString().split('T')[0]}
          />
        </Card>

        <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Available Slots for {formatDate(selectedDate)}</h2>
          {availableSlots.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>No available slots for this date.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  style={{
                    padding: '0.75rem',
                    border: `2px solid ${selectedSlot === slot.id ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: selectedSlot === slot.id ? 'var(--color-primary)' : 'white',
                    color: selectedSlot === slot.id ? 'white' : 'var(--color-gray-800)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>Lane {slot.laneNumber}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
                  <div style={{ marginTop: '0.5rem' }}><Badge variant="success">Available</Badge></div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Button
          fullWidth
          size="lg"
          disabled={!selectedSlot || !guestName || !guestEmail}
          onClick={handleBook}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}
