import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SlotGrid from '@/components/ui/SlotGrid';
import { formatDate, generateConfirmationCode } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { Slot } from '@/types';

export default function MemberBookingPage() {
  const { currentUser, slots, addBooking, updateSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [success, setSuccess] = useState(false);

  const dateSlots = slots.filter(s => s.date === selectedDate);
  const isSubscribed = currentUser?.subscriptionStatus === 'active';

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
    }
  };

  const handleBook = () => {
    if (!selectedSlot || !currentUser || !isSubscribed) return;

    addBooking({
      slotId: selectedSlot.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      status: 'confirmed',
      confirmationCode: generateConfirmationCode(),
      type: 'member',
      createdAt: new Date().toISOString(),
    });

    updateSlot(selectedSlot.id, { status: 'booked_member', bookedBy: currentUser.id });
    setSuccess(true);
  };

  if (!isSubscribed) {
    return (
      <Card className="text-center p-12">
        <h2 className="text-xl font-bold mb-4">Subscription Required</h2>
        <p className="text-slate-600 mb-6">You need an active yearly subscription to book lanes online.</p>
        <Link to="/member/subscription">
          <Button>View Subscription Plans</Button>
        </Link>
      </Card>
    );
  }

  if (success && selectedSlot) {
    return (
      <Card className="text-center p-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Lane Reserved!</h2>
        <p className="text-slate-600 mb-6">
          Lane {selectedSlot.lane} on {formatDate(new Date(selectedSlot.date + 'T12:00:00'))} at {selectedSlot.startTime}
        </p>
        <Button onClick={() => { setSuccess(false); setSelectedSlot(null); }}>Book Another</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Book a Lane</h1>
        <input
          type="date"
          className="border rounded-md px-3 py-2 text-sm"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      {dateSlots.length === 0 ? (
        <Card>
          <p className="text-center text-slate-500 py-8">No slots available for this date. Please try another date.</p>
        </Card>
      ) : (
        <SlotGrid
          slots={dateSlots}
          onSlotClick={handleSlotClick}
          selectedSlotId={selectedSlot?.id}
        />
      )}

      {selectedSlot && (
        <Card className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="font-bold">Selected: Lane {selectedSlot.lane}</h3>
            <p className="text-sm text-slate-500">
              {formatDate(new Date(selectedSlot.date + 'T12:00:00'))} at {selectedSlot.startTime} – {selectedSlot.endTime}
            </p>
          </div>
          <Button onClick={handleBook}>Confirm Booking</Button>
        </Card>
      )}
    </div>
  );
}
