import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import type { Booking } from '@/types';

export default function PublicBookingPage() {
  const { slots, addBooking, updateSlot } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const availableSlots = slots.filter(s => s.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSlot = slots.find(s => s.id === selectedSlotId);
    if (!selectedSlot) return;

    const booking: Omit<Booking, 'id'> = {
      slotId: selectedSlot.id,
      userId: 'guest',
      userName: name,
      userEmail: email,
      date: selectedSlot.date,
      time: selectedSlot.time,
      lane: selectedSlot.lane,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notes,
    };

    addBooking(booking);
    updateSlot({ id: selectedSlot.id, status: 'booked_outsider' });
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Card className="" padding="lg">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Your lane has been reserved successfully.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-gray-50)' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <Card padding="lg">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🎳 Book a Lane</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Reserve your bowling lane as a guest</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
            <Select
              label="Select Slot"
              value={selectedSlotId}
              onChange={e => setSelectedSlotId(e.target.value)}
              required
              placeholder="Choose an available slot..."
              options={availableSlots.map(s => ({ value: s.id, label: `Lane ${s.lane} – ${s.date} ${s.time}` }))}
            />
            <Input label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requests?" />
            <Button type="submit" fullWidth disabled={!selectedSlotId}>Confirm Booking</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
