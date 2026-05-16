import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { generateConfirmationCode } from '@/lib/utils';
import type { Booking } from '@/types';
import SlotGrid from '@/components/ui/SlotGrid';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function PublicBookingPage() {
  const { slots, addBooking, updateSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<(typeof slots)[0] | null>(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');
  const [confirmationCode, setConfirmationCode] = useState('');

  const filteredSlots = slots.filter(s => s.date === selectedDate && s.status === 'available');

  const handleSlotClick = (slot: (typeof slots)[0]) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    const code = generateConfirmationCode();
    const booking: Booking = {
      id: crypto.randomUUID(),
      slotId: selectedSlot.id,
      userId: 'guest',
      userName: guestInfo.name,
      userEmail: guestInfo.email,
      userType: 'outsider',
      lane: selectedSlot.lane,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      time: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
      status: 'confirmed',
      type: selectedSlot.type,
      confirmationCode: code,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    updateSlot({ id: selectedSlot.id, status: 'booked_outsider' });
    setConfirmationCode(code);
    setStep('confirm');
  };

  if (step === 'confirm' && confirmationCode) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#15803d', fontWeight: 700, marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your confirmation code:</p>
          <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '8px', padding: '1rem', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em', color: '#15803d', marginBottom: '1.5rem' }}>
            {confirmationCode}
          </div>
          <Button onClick={() => { setStep('select'); setSelectedSlot(null); setGuestInfo({ name: '', email: '' }); setConfirmationCode(''); }}>Book Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a5f' }}>🎳 Book a Lane</h1>
          <p style={{ color: '#64748b' }}>No account needed — reserve your lane as a guest.</p>
        </div>

        <Card className={undefined}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Input
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <SlotGrid slots={filteredSlots} onSlotClick={handleSlotClick} />
        </Card>

        {step === 'details' && selectedSlot && (
          <Card className={undefined}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Your Details</h3>
            <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Full Name" value={guestInfo.name} onChange={e => setGuestInfo(g => ({ ...g, name: e.target.value }))} required />
              <Input label="Email" type="email" value={guestInfo.email} onChange={e => setGuestInfo(g => ({ ...g, email: e.target.value }))} required />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setStep('select')}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          </Card>
        )}

        {step === 'confirm' && selectedSlot && (
          <Card className={undefined}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Confirm Booking</h3>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <div><strong>Name:</strong> {guestInfo.name}</div>
              <div><strong>Email:</strong> {guestInfo.email}</div>
              <div><strong>Lane:</strong> {selectedSlot.lane}</div>
              <div><strong>Date:</strong> {selectedSlot.date}</div>
              <div><strong>Time:</strong> {selectedSlot.startTime} – {selectedSlot.endTime}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setStep('details')}>Back</Button>
              <Button onClick={handleConfirm}>Confirm Booking</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
