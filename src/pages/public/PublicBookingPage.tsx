import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import type { Slot } from '@/types';

export default function PublicBookingPage() {
  const { slots, addBooking, updateSlot } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [confirmed, setConfirmed] = useState(false);

  const availableSlots = slots.filter(s => s.status === 'available');

  const handleBook = () => {
    if (!selectedSlot || !guestInfo.name || !guestInfo.email) return;

    addBooking({
      id: crypto.randomUUID(),
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      laneNumber: selectedSlot.laneNumber,
      lane: selectedSlot.laneNumber,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      guestName: guestInfo.name,
      guestEmail: guestInfo.email,
      guestPhone: guestInfo.phone,
    });

    updateSlot({ ...selectedSlot, status: 'booked_outsider' });
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Card style={{ maxWidth: 480, width: '100%', textAlign: 'center' } as React.CSSProperties}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e3a5f' }}>Booking Confirmed!</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your bowling slot has been successfully booked.</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: '#1e3a5f', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a5f', marginTop: '0.5rem' }}>Book a Lane</h1>
          <p style={{ color: '#64748b' }}>Select an available slot and fill in your details</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedSlot ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          <Card>
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Available Slots</h2>
            {availableSlots.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No available slots at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 400, overflowY: 'auto' }}>
                {availableSlots.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '0.75rem 1rem',
                      border: `2px solid ${selectedSlot?.id === slot.id ? '#1e3a5f' : '#e2e8f0'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: selectedSlot?.id === slot.id ? '#eff6ff' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>Lane {slot.laneNumber} · {formatDate(new Date(slot.date))}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{slot.time} · ${slot.price}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {selectedSlot && (
            <Card>
              <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a5f' }}>Your Details</h2>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <div><strong>Lane:</strong> {selectedSlot.laneNumber}</div>
                <div><strong>Date:</strong> {formatDate(new Date(selectedSlot.date))}</div>
                <div><strong>Time:</strong> {selectedSlot.time}</div>
                <div><strong>Price:</strong> ${selectedSlot.price}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <Input label="Full Name" value={guestInfo.name} onChange={e => setGuestInfo(p => ({ ...p, name: e.target.value }))} required />
                <Input label="Email" type="email" value={guestInfo.email} onChange={e => setGuestInfo(p => ({ ...p, email: e.target.value }))} required />
                <Input label="Phone" value={guestInfo.phone} onChange={e => setGuestInfo(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <Button fullWidth onClick={handleBook} disabled={!guestInfo.name || !guestInfo.email}>
                Confirm Booking
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
