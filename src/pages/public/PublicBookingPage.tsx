import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Slot } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SlotGrid from '@/components/ui/SlotGrid';

export default function PublicBookingPage() {
  const { slots, addBooking, updateSlot } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', phone: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const validate = () => {
    const e: { name?: string; email?: string } = {};
    if (!guestForm.name.trim()) e.name = 'Name is required';
    if (!guestForm.email.trim()) e.email = 'Email is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!selectedSlot || !validate()) return;

    const booking = {
      id: `booking-${crypto.randomUUID()}`,
      userId: 'guest',
      userName: guestForm.name,
      userEmail: guestForm.email,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      type: 'outsider' as const,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      guestName: guestForm.name,
      guestEmail: guestForm.email,
      guestPhone: guestForm.phone,
    };

    addBooking(booking);

    const newCount = selectedSlot.bookedCount + 1;
    updateSlot({
      ...selectedSlot,
      bookedCount: newCount,
      status: newCount >= selectedSlot.capacity ? 'full' : 'booked_outsider',
    });

    setSuccessMsg(`Booking confirmed for Lane ${selectedSlot.lane} on ${selectedSlot.date} at ${selectedSlot.startTime}!`);
    setSelectedSlot(null);
    setGuestForm({ name: '', email: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">🎳 BowlPro</span>
        <a href="/login" className="text-sm text-blue-600 hover:underline">Member Login</a>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Public Lane Booking</h1>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            {successMsg}
          </div>
        )}

        <Card>
          <h2 className="font-semibold mb-4">Your Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Full Name *"
              value={guestForm.name}
              onChange={e => setGuestForm(f => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />
            <Input
              label="Email *"
              type="email"
              value={guestForm.email}
              onChange={e => setGuestForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Phone"
              value={guestForm.phone}
              onChange={e => setGuestForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </Card>

        <SlotGrid slots={slots} onSelectSlot={handleSelectSlot} />

        {selectedSlot && (
          <Card className="border-blue-300 bg-blue-50">
            <p className="text-sm">
              <strong>Selected:</strong> Lane {selectedSlot.lane} · {selectedSlot.startTime} – {selectedSlot.endTime} on {selectedSlot.date}
            </p>
            <Button className="mt-3" onClick={handleConfirm}>Confirm Booking</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
