import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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

  const handleConfirm = () => {
    if (!selectedSlot || !name || !email) return;

    const slotTime = selectedSlot.startTime || selectedSlot.time;
    const slotEndTime = selectedSlot.endTime || '';

    const booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot.id,
      userId: 'guest-' + Date.now(),
      userName: name,
      userEmail: email,
      userType: 'outsider' as const,
      lane: selectedSlot.lane,
      date: selectedSlot.date,
      time: slotTime,
      startTime: slotTime,
      endTime: slotEndTime,
      status: 'confirmed' as const,
      type: 'public',
      confirmationCode: 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
            <p style={{ color: '#64748b' }}>Thank you, {name}. Your lane has been reserved.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>🎳 Book a Lane</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Reserve a bowling lane as a guest.</p>

        <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
          <h3 style={{ marginBottom: '1rem' }}>Your Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
        </Card>

        <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
          <h3 style={{ marginBottom: '1rem' }}>Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            min={today}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
          />
        </Card>

        {selectedDate && (
          <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
            <h3 style={{ marginBottom: '1rem' }}>Available Slots</h3>
            {availableSlots.length === 0 ? (
              <p style={{ color: '#64748b' }}>No available slots for this date.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '12px',
                      border: `2px solid ${selectedSlot?.id === slot.id ? '#1e3a5f' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedSlot?.id === slot.id ? '#eff6ff' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>Lane {slot.lane}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{slot.startTime || slot.time} – {slot.endTime}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {selectedSlot && (
          <Card>
            <h3 style={{ marginBottom: '1rem' }}>Confirm Booking</h3>
            <p style={{ marginBottom: '1rem', color: '#475569' }}>
              Confirm Booking — Lane {selectedSlot.lane} at {selectedSlot.startTime || selectedSlot.time}
            </p>
            <Button onClick={handleConfirm} disabled={!name || !email} fullWidth>
              Confirm Booking
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
