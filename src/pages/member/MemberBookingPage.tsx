import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Slot } from '@/types';

export default function MemberBookingPage() {
  const { slots, currentUser, addBooking, updateSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const availableSlots = slots.filter(
    (s) => s.date === selectedDate && s.status === 'available'
  );

  const handleBook = () => {
    if (!selectedSlot || !currentUser) return;

    const booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userType: 'member' as const,
      lane: selectedSlot.lane,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'confirmed' as const,
      type: 'member',
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    updateSlot(selectedSlot.id, { status: 'booked_member', bookedBy: currentUser.id });
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your lane has been reserved.</p>
          <Button onClick={() => { setConfirmed(false); setSelectedSlot(null); setSelectedDate(''); }}>
            Book Another
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Book a Lane</h1>

      <Card>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Select a Date</h2>
        <Input
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
          min={today}
        />
      </Card>

      {selectedDate && (
        <Card>
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
        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Confirm Booking</h2>
          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div><span style={{ fontWeight: 600 }}>Date:</span> {formatDate(new Date(selectedSlot.date))}</div>
              <div><span style={{ fontWeight: 600 }}>Lane:</span> {selectedSlot.lane}</div>
              <div><span style={{ fontWeight: 600 }}>Time:</span> {selectedSlot.startTime} – {selectedSlot.endTime}</div>
            </div>
          </div>
          <Badge variant="info">Member Booking</Badge>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={handleBook} fullWidth>
              Confirm Booking
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
