import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import SlotGrid from '@/components/ui/SlotGrid';
import type { Slot } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';

export default function PublicBookingPage() {
  const { slots, addBooking } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    addBooking({
      userId: 'guest',
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      status: 'confirmed',
      guestName,
      guestEmail,
      guestPhone,
    });
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-800">🎳 BowlPro</Link>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="secondary" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Book a Lane</h1>
        <p className="text-slate-500 mb-6">Select an available slot below to make a guest booking.</p>
        <SlotGrid slots={slots} onSlotClick={handleSlotClick} selectedSlotId={selectedSlot?.id} />
      </div>

      <Modal
        isOpen={!!selectedSlot && !confirmed}
        onClose={() => setSelectedSlot(null)}
        title="Guest Booking"
      >
        {selectedSlot && (
          <div className="p-6 flex flex-col gap-4">
            <Card className="p-3 bg-slate-50">
              <p className="text-sm text-slate-600">
                <strong>Lane {selectedSlot.lane}</strong> &mdash; {selectedSlot.date}<br />
                {selectedSlot.startTime} &ndash; {selectedSlot.endTime}
              </p>
            </Card>
            <Input
              label="Your Name"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              type="email"
              value={guestEmail}
              onChange={e => setGuestEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Phone"
              type="tel"
              value={guestPhone}
              onChange={e => setGuestPhone(e.target.value)}
              placeholder="+1 555 0000"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setSelectedSlot(null)}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={!guestName}>Confirm Booking</Button>
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
          <p className="text-slate-700 mb-4">Thank you, {guestName}! Your lane has been booked.</p>
          <Button className="w-full" onClick={() => { setSelectedSlot(null); setConfirmed(false); }}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
