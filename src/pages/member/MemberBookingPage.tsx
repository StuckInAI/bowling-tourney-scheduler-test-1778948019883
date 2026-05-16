import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Slot } from '@/types';
import SlotGrid from '@/components/ui/SlotGrid';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function MemberBookingPage() {
  const { slots, addBooking, currentUser } = useAppContext();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [success, setSuccess] = useState(false);

  const filteredSlots = slots.filter(s => s.date === date);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'available') setSelectedSlot(slot);
  };

  const handleBook = () => {
    if (!selectedSlot || !currentUser) return;
    addBooking({
      slotId: selectedSlot.id,
      userId: currentUser.id,
      userName: currentUser.name,
      status: 'confirmed',
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
    });
    setSuccess(true);
    setSelectedSlot(null);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Book a Lane</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
          Booking confirmed! Check "My Bookings" for details.
        </div>
      )}

      <Card>
        <div className="mb-4">
          <Input
            label="Select Date"
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setSelectedSlot(null); }}
          />
        </div>
        <SlotGrid slots={filteredSlots} onSlotClick={handleSlotClick} selectedSlotId={selectedSlot?.id} />
      </Card>

      {selectedSlot && (
        <Card>
          <h2 className="text-lg font-semibold mb-2">Confirm Booking</h2>
          <div className="text-sm text-slate-600 space-y-1 mb-4">
            <div>Date: <strong>{selectedSlot.date}</strong></div>
            <div>Time: <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong></div>
            <div>Lane: <strong>{selectedSlot.lane}</strong></div>
            <div>Price: <strong>${selectedSlot.price}</strong></div>
          </div>
          <Button onClick={handleBook}>Confirm Booking</Button>
        </Card>
      )}
    </div>
  );
}
