import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import type { Slot } from '@/types';

export default function PublicBookingPage() {
  const { slots, addBooking } = useAppContext();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const availableSlots = slots.filter(
    (s) => s.date === selectedDate && s.status === 'available'
  );

  const handleBook = () => {
    if (!selectedSlot || !name || !email) return;

    const booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot.id,
      userId: `guest-${crypto.randomUUID()}`,
      userName: name,
      userEmail: email,
      userType: 'outsider' as const,
      lane: selectedSlot.lane,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'confirmed' as const,
      type: 'public',
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <Card className="" padding="lg">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your lane has been reserved. See you on the lanes!</p>
            <Button onClick={() => { setConfirmed(false); setSelectedSlot(null); setSelectedDate(''); setName(''); setEmail(''); }}>
              Book Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', color: '#1e3a5f', marginBottom: '0.5rem' }}>🎳 Guest Lane Booking</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Book a bowling lane without an account. Quick and easy!</p>

        <Card padding="md">
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Step 1: Select a Date</h2>
          <Input
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
            min={today}
          />
        </Card>

        {selectedDate && (
          <Card padding="md" className="" >
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Available Slots for {formatDate(new Date(selectedDate))}</h2>
            {availableSlots.length === 0 ? (
              <p style={{ color: '#64748b' }}>No available slots for this date.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `2px solid ${selectedSlot?.id === slot.id ? '#1e3a5f' : '#e2e8f0'}`,
                      background: selectedSlot?.id === slot.id ? '#dbeafe' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Lane {slot.lane}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{slot.startTime} – {slot.endTime}</div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        )}

        {selectedSlot && (
          <Card padding="md">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Step 3: Your Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
              <Button onClick={handleBook} disabled={!name || !email} fullWidth>
                Confirm Booking — Lane {selectedSlot.lane} at {selectedSlot.startTime}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
