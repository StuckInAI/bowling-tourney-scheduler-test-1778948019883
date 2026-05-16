import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Slot } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import SlotGrid from '@/components/ui/SlotGrid';
import { formatDate } from '@/lib/utils';

export default function MemberBookingPage() {
  const { currentUser, slots, addBooking, updateSlot } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !currentUser) return;

    const booking = {
      id: `booking-${crypto.randomUUID()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      type: 'member' as const,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);

    const newCount = selectedSlot.bookedCount + 1;
    updateSlot({
      ...selectedSlot,
      bookedCount: newCount,
      status: newCount >= selectedSlot.capacity ? 'full' : 'booked_member',
    });

    setConfirmOpen(false);
    setSuccessMsg(`Booking confirmed for Lane ${selectedSlot.lane} on ${formatDate(new Date(selectedSlot.date + 'T12:00:00'))} at ${selectedSlot.startTime}`);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Book a Lane</h1>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {successMsg}
        </div>
      )}

      <SlotGrid slots={slots} onSelectSlot={handleSelectSlot} />

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Booking">
        <div className="p-6 space-y-4">
          {selectedSlot && (
            <>
              <Card className="bg-slate-50">
                <h3 className="font-bold">Selected: Lane {selectedSlot.lane}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {formatDate(new Date(selectedSlot.date + 'T12:00:00'))} · {selectedSlot.startTime} – {selectedSlot.endTime}
                </p>
                <p className="text-sm font-medium mt-2">Price: ${selectedSlot.price}</p>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm Booking</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
