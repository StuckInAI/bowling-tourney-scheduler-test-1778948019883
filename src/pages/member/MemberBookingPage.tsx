import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import SlotGrid from '@/components/ui/SlotGrid';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import type { Slot } from '@/types';

export default function MemberBookingPage() {
  const { slots, addBooking, currentUser } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredSlots = slots.filter(s => s.date === selectedDate);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot || !currentUser) return;
    addBooking({
      userId: currentUser.id,
      slotId: selectedSlot.id,
      status: 'confirmed',
    });
    setShowModal(false);
    setSelectedSlot(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Book a Slot</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3">
          Booking confirmed successfully!
        </div>
      )}

      <Card>
        <div className="mb-4">
          <Input
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
        <SlotGrid slots={filteredSlots} onSlotClick={handleSlotClick} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Booking"
      >
        {selectedSlot && (
          <div className="p-6 space-y-4">
            <p className="text-slate-600">
              Lane <strong>{selectedSlot.lane}</strong> on <strong>{selectedSlot.date}</strong>
              {' '}from <strong>{selectedSlot.startTime}</strong> to <strong>{selectedSlot.endTime}</strong>
            </p>
            <p className="text-slate-600">Price: <strong>${selectedSlot.price}</strong></p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
