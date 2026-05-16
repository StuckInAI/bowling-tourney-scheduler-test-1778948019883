import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import SlotGrid from '@/components/ui/SlotGrid';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import type { Slot } from '@/types';

export default function PublicBookingPage() {
  const { slots, addBooking } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const filteredSlots = slots.filter(s => s.date === selectedDate);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const validate = () => {
    const errs: { name?: string; email?: string } = {};
    if (!guestName.trim()) errs.name = 'Name is required';
    if (!guestEmail.trim()) errs.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(guestEmail)) errs.email = 'Invalid email';
    return errs;
  };

  const handleConfirmBooking = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!selectedSlot) return;
    addBooking({
      userId: 'guest',
      slotId: selectedSlot.id,
      status: 'confirmed',
      guestName,
      guestEmail,
    });
    setShowModal(false);
    setSelectedSlot(null);
    setGuestName('');
    setGuestEmail('');
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-700">🎳 BowlPro</Link>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Book a Bowling Slot</h1>
        <p className="text-slate-500">Select a date and available slot below. No account required for guest bookings.</p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3">
            Booking confirmed! Check your email for details.
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
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Guest Booking"
      >
        {selectedSlot && (
          <div className="p-6 space-y-4">
            <p className="text-slate-600">
              Lane <strong>{selectedSlot.lane}</strong> on <strong>{selectedSlot.date}</strong>
              {' '}from <strong>{selectedSlot.startTime}</strong> to <strong>{selectedSlot.endTime}</strong>
              {' '}— <strong>${selectedSlot.price}</strong>
            </p>
            <Input
              label="Your Name"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              error={errors.name}
              placeholder="John Doe"
            />
            <Input
              label="Your Email"
              type="email"
              value={guestEmail}
              onChange={e => setGuestEmail(e.target.value)}
              error={errors.email}
              placeholder="john@example.com"
            />
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
