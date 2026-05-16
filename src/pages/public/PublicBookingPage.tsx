import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Slot } from '@/types';
import SlotGrid from '@/components/ui/SlotGrid';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function PublicBookingPage() {
  const { slots, addBooking } = useAppContext();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const filteredSlots = slots.filter(s => s.date === date);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === 'available') setSelectedSlot(slot);
  };

  const handleBook = () => {
    if (!selectedSlot || !name.trim()) return;
    addBooking({
      slotId: selectedSlot.id,
      outsiderName: name,
      outsiderEmail: email,
      outsiderPhone: phone,
      status: 'confirmed',
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
    });
    setSuccess(true);
    setSelectedSlot(null);
    setName('');
    setEmail('');
    setPhone('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">🎳 Book a Lane</h1>
          <a href="/" className="text-blue-600 text-sm hover:underline">← Back to Home</a>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
            Booking confirmed! Please check your email for confirmation details.
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
            <h2 className="text-lg font-semibold mb-4">Your Details</h2>
            <div className="space-y-3">
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <Input label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
              <div className="text-sm text-slate-600 border-t pt-3">
                <div>Date: <strong>{selectedSlot.date}</strong></div>
                <div>Time: <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong></div>
                <div>Lane: <strong>{selectedSlot.lane}</strong></div>
                <div>Price: <strong>${selectedSlot.price}</strong></div>
              </div>
              <Button onClick={handleBook} disabled={!name.trim()}>Confirm Booking</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
