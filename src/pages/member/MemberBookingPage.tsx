import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { generateConfirmationCode } from '@/lib/utils';
import type { Booking } from '@/types';
import SlotGrid from '@/components/ui/SlotGrid';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

export default function MemberBookingPage() {
  const { currentUser, slots, addBooking, updateSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<(typeof slots)[0] | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [booked, setBooked] = useState(false);

  const filteredSlots = slots.filter(s => s.date === selectedDate);

  const handleSlotClick = (slot: (typeof slots)[0]) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !currentUser) return;
    const booking: Booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userType: 'member',
      lane: selectedSlot.lane,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      time: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
      status: 'confirmed',
      type: selectedSlot.type,
      confirmationCode: generateConfirmationCode(),
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    updateSlot({ id: selectedSlot.id, status: 'booked_member', bookedBy: currentUser.id });
    setBooked(true);
  };

  if (booked && selectedSlot) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803d', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your lane has been reserved successfully.</p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div><strong>Lane:</strong> {selectedSlot.lane}</div>
            <div><strong>Date:</strong> {selectedSlot.date}</div>
            <div><strong>Time:</strong> {selectedSlot.startTime} – {selectedSlot.endTime}</div>
          </div>
        </div>
        <Button onClick={() => { setBooked(false); setSelectedSlot(null); setShowConfirm(false); }}>Book Another Slot</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '1.5rem' }}>Book a Lane</h2>
      <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
        <Input
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <SlotGrid slots={filteredSlots} onSlotClick={handleSlotClick} />
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Booking">
        {selectedSlot && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
              <div><strong>Lane:</strong> {selectedSlot.lane}</div>
              <div><strong>Date:</strong> {selectedSlot.date}</div>
              <div><strong>Time:</strong> {selectedSlot.startTime} – {selectedSlot.endTime}</div>
              <div><strong>Type:</strong> {selectedSlot.type}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button onClick={handleConfirm}>Confirm Booking</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
