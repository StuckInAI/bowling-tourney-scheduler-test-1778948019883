import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Booking } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SlotGrid from '@/components/ui/SlotGrid';
import { formatDate } from '@/lib/utils';

export default function MemberBookingPage() {
  const { currentUser, slots, addBooking, updateSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const dateSlots = slots.filter(s => s.date === selectedDate);
  const selectedSlotObj = slots.find(s => s.id === selectedSlot);

  const handleBook = () => {
    if (!selectedSlotObj || !currentUser) return;

    const booking: Omit<Booking, 'id'> = {
      slotId: selectedSlotObj.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      date: selectedSlotObj.date,
      time: selectedSlotObj.time,
      lane: selectedSlotObj.lane,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    updateSlot({ id: selectedSlotObj.id, status: 'booked_member', bookedBy: currentUser.id });
    setSuccess(true);
  };

  if (success) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2>Booking Confirmed!</h2>
          <p style={{ color: 'var(--color-gray-600)', marginTop: '0.5rem' }}>
            Lane {selectedSlotObj?.lane} on {selectedSlotObj ? formatDate(new Date(selectedSlotObj.date)) : ''} at {selectedSlotObj?.time}
          </p>
          <Button onClick={() => { setSuccess(false); setSelectedSlot(null); }} style={{ marginTop: '1rem' }}>Book Another</Button>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Book a Lane</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Select a date and available slot</p>
      </div>

      <Card>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--color-gray-300)', borderRadius: 6 }}
        />
      </Card>

      <SlotGrid
        slots={dateSlots}
        onSlotClick={(slot) => {
          if (slot.status === 'available') setSelectedSlot(slot.id);
        }}
        selectedSlotId={selectedSlot}
      />

      {selectedSlotObj && (
        <Card>
          <h3 style={{ marginBottom: '0.5rem' }}>Selected Slot</h3>
          <p>Lane {selectedSlotObj.lane} at {selectedSlotObj.time}</p>
          <Button onClick={handleBook} style={{ marginTop: '1rem' }}>Confirm Booking</Button>
        </Card>
      )}
    </div>
  );
}
