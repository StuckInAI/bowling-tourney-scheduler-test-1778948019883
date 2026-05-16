import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import SlotGrid from '@/components/ui/SlotGrid';
import type { Slot } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function MemberBookingPage() {
  const { slots, addBooking, currentUser } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !currentUser) return;
    addBooking({
      userId: currentUser.id,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      status: 'confirmed',
    });
    setConfirmed(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">Book a Slot</h1>
      <SlotGrid slots={slots} onSlotClick={handleSlotClick} selectedSlotId={selectedSlot?.id} />

      <Modal
        isOpen={!!selectedSlot && !confirmed}
        onClose={() => setSelectedSlot(null)}
        title="Confirm Booking"
      >
        {selectedSlot && (
          <div className="p-6 flex flex-col gap-4">
            <p className="text-slate-700">
              You are booking <strong>Lane {selectedSlot.lane}</strong> on{' '}
              <strong>{selectedSlot.date}</strong> from{' '}
              <strong>{selectedSlot.startTime}</strong> to{' '}
              <strong>{selectedSlot.endTime}</strong>.
            </p>
            <p className="text-slate-500 text-sm">Price: <strong>${selectedSlot.price}</strong></p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setSelectedSlot(null)}>Cancel</Button>
              <Button onClick={handleConfirm}>Confirm Booking</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={confirmed}
        onClose={() => { setSelectedSlot(null); setConfirmed(false); }}
        title="Booking Confirmed!"
      >
        <div className="p-6">
          <p className="text-slate-700 mb-4">Your booking has been confirmed. Check your bookings page for details.</p>
          <Button className="w-full" onClick={() => { setSelectedSlot(null); setConfirmed(false); }}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
