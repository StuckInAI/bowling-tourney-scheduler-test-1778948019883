import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SlotGrid from '@/components/ui/SlotGrid';
import { formatDate, generateConfirmationCode } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function MemberBookingPage() {
  const { currentUser, slots, addBooking, updateSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const dateSlots = slots.filter(s => s.date === selectedDate);
  const selectedSlotObj = slots.find(s => s.id === selectedSlot);

  const isSubscribed = currentUser?.subscriptionStatus === 'active';

  const handleBook = () => {
    if (!selectedSlotObj || !currentUser || !isSubscribed) return;

    addBooking({
      slotId: selectedSlotObj.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      date: selectedSlotObj.date,
      time: selectedSlotObj.startTime,
      lane: selectedSlotObj.lane,
      status: 'confirmed',
      confirmationCode: generateConfirmationCode(),
      createdAt: new Date().toISOString(),
    });

    updateSlot(selectedSlotObj.id, { status: 'booked_member', bookedBy: currentUser.id });
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

  if (success) {
    return (
      <Card className="text-center p-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Lane Reserved!</h2>
        <p className="text-slate-600 mb-6">
          Lane {selectedSlotObj?.lane} on {selectedSlotObj ? formatDate(new Date(selectedSlotObj.date)) : ''} at {selectedSlotObj?.startTime}
        </p>
        <Button onClick={() => { setSuccess(false); setSelectedSlot(null); }}>Book Another</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Book a Lane</h1>
        <input
          type="date"
          className="border rounded-md px-3 py-2"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      <SlotGrid
        slots={dateSlots}
        onSlotClick={(slot) => {
          if (slot.status === 'available') setSelectedSlot(slot.id);
        }}
        selectedSlotId={selectedSlot}
      />

      {selectedSlotObj && (
        <Card className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">Selected: Lane {selectedSlotObj.lane}</h3>
            <p className="text-sm text-slate-500">{formatDate(new Date(selectedSlotObj.date))} at {selectedSlotObj.startTime}</p>
          </div>
          <Button onClick={handleBook}>Confirm Booking</Button>
        </Card>
      )}
    </div>
  );
}