import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { isWithinNext24Hours, generateConfirmationCode } from '@/lib/utils';
import type { Booking } from '@/types';

export default function PublicBookingPage() {
  const { slots, addBooking, updateSlot } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');

  // Filter for available slots in next 24 hours
  const availableNext24h = slots.filter(s => 
    s.status === 'available' && 
    isWithinNext24Hours(s.date, s.startTime)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSlot = slots.find(s => s.id === selectedSlotId);
    if (!selectedSlot) return;

    const confirmationCode = generateConfirmationCode();
    
    addBooking({
      slotId: selectedSlot.id,
      userId: 'outsider',
      userName: name,
      userEmail: email,
      userPhone: phone,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      lane: selectedSlot.lane,
      status: 'confirmed',
      confirmationCode,
      createdAt: new Date().toISOString(),
    });

    updateSlot(selectedSlot.id, { status: 'booked_outsider' });
    setCode(confirmationCode);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <Card className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎳</div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-6">Your reservation code is: <span className="font-mono font-bold text-primary">{code}</span></p>
          <p className="text-sm text-slate-500 mb-6">Please show this code at the counter. A confirmation email has been sent to {email}.</p>
          <Button onClick={() => navigate('/')} fullWidth>Return Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-xl w-full">
        <Card padding="lg">
          <h2 className="text-2xl font-bold text-center mb-1">Public Lane Booking</h2>
          <p className="text-center text-slate-500 mb-8">Available slots in the next 24 hours</p>
          
          {availableNext24h.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">Sorry, no lanes are currently available in the next 24 hours.</p>
              <Button onClick={() => navigate('/')} variant="secondary">Back</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <Input label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
              
              <Select
                label="Choose Lane & Time"
                value={selectedSlotId}
                onChange={e => setSelectedSlotId(e.target.value)}
                required
                options={availableNext24h.map(s => ({
                  value: s.id,
                  label: `Lane ${s.lane} at ${s.startTime} (${s.date})`
                }))}
              />
              
              <div className="mt-4">
                <Button type="submit" fullWidth size="lg">Confirm Booking</Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}