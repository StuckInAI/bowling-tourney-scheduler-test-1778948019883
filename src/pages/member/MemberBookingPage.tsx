import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { formatDate, formatTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

export default function MemberBookingPage() {
  const { currentUser, slots, addBooking } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [booked, setBooked] = useState(false);

  const availableSlots = slots.filter(
    s => s.date === selectedDate && s.status === 'available'
  );

  const slot = slots.find(s => s.id === selectedSlot);

  const handleBook = () => {
    if (!selectedSlot || !currentUser || !slot) return;
    const booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userType: 'member' as const,
      laneNumber: slot.laneNumber,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setShowConfirm(false);
    setSelectedSlot(null);
    setBooked(true);
    setTimeout(() => setBooked(false), 4000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Book a Lane 🎳</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Select a date and available slot.</p>
      </div>

      {booked && (
        <div style={{ padding: '1rem', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: '#15803d', fontWeight: 600 }}>
          ✅ Booking confirmed! Check My Bookings to view it.
        </div>
      )}

      <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Select Date</h2>
        <Input
          type="date"
          value={selectedDate}
          onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
          min={new Date().toISOString().split('T')[0]}
        />
      </Card>

      <Card>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Available Slots — {formatDate(selectedDate)}</h2>
        {availableSlots.length === 0 ? (
          <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>No available slots for this date.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {availableSlots.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedSlot(s.id); setShowConfirm(true); }}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${selectedSlot === s.id ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 700 }}>Lane {s.laneNumber}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--color-gray-600)' }}>{formatTime(s.startTime)} - {formatTime(s.endTime)}</div>
                <div style={{ marginTop: '0.5rem' }}><Badge variant="success">Available</Badge></div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Booking">
        {slot && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--color-gray-500)' }}>Lane:</span> <strong>{slot.laneNumber}</strong></div>
                <div><span style={{ color: 'var(--color-gray-500)' }}>Date:</span> <strong>{formatDate(slot.date)}</strong></div>
                <div><span style={{ color: 'var(--color-gray-500)' }}>Time:</span> <strong>{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</strong></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button onClick={handleBook}>Confirm</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
