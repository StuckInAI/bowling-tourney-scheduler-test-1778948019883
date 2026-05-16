import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import styles from '@/pages/public/LandingPage.module.css';

export default function PublicBookingPage() {
  const { slots, createBooking, updateSlot } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const availableSlots = slots.filter(
    (s) => s.status === 'available'
  );

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSlot = slots.find((s) => s.id === selectedSlotId);
    if (!selectedSlot) return;

    createBooking({
      userName: name,
      userEmail: email,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    });

    // Mark slot as booked
    updateSlot(selectedSlot.id, { status: 'booked_outsider' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.hero} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Booking Confirmed!</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-gray-600)' }}>
            Thank you, {name}. Your lane reservation has been successfully placed.
          </p>
          <Button onClick={() => window.location.href = '/'}>Return Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.hero} style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
          Book a Lane
        </h1>
        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
          <Select
            label="Select Available Slot"
            required
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            placeholder="Choose a time and lane..."
            options={availableSlots.map((s) => ({
              value: s.id,
              label: `Lane ${s.lane} at ${s.startTime} (${formatDate(new Date(s.date))})`,
            }))}
          />
          <Button type="submit" fullWidth variant="primary" disabled={!selectedSlotId}>
            Confirm Reservation
          </Button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-gray-500)', textAlign: 'center' }}>
          Members enjoy discounted rates and priority booking. 
          <a href="/register" style={{ marginLeft: '0.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign up here
          </a>
        </p>
      </Card>
    </div>
  );
}