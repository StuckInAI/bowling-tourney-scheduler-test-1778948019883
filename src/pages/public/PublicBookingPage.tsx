import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { isWithinNext24Hours, generateConfirmationCode, formatDate } from '@/lib/utils';
import type { Slot } from '@/types';
import { Link } from 'react-router-dom';

export default function PublicBookingPage() {
  const { slots, addBooking, updateSlot } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');

  const availableSlots = slots.filter(
    s => s.status === 'available' && isWithinNext24Hours(s.date, s.startTime)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) { setError('Please select a slot.'); return; }
    if (!form.name || !form.email || !form.phone) { setError('Please fill in all fields.'); return; }

    const code = generateConfirmationCode();
    addBooking({
      slotId: selectedSlot.id,
      outsiderName: form.name,
      outsiderEmail: form.email,
      outsiderPhone: form.phone,
      userName: form.name,
      userEmail: form.email,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      lane: selectedSlot.lane,
      status: 'confirmed',
      confirmationCode: code,
      type: 'outsider',
      createdAt: new Date().toISOString(),
    });
    updateSlot(selectedSlot.id, { status: 'booked_outsider' });
    setSuccess(code);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-4">Your confirmation code is:</p>
          <div className="text-3xl font-mono font-bold text-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-6">{success}</div>
          <p className="text-sm text-slate-500 mb-6">Save this code. You'll need it to check in at the venue.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-slate-500 hover:underline text-sm">← Back to Home</Link>
          <h1 className="text-3xl font-bold mt-2">Walk-in Slot Booking</h1>
          <p className="text-slate-500">Available slots in the next 24 hours across all 16 lanes. No account required.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Slot List */}
          <div>
            <h2 className="font-semibold mb-3 text-slate-700">Available Slots ({availableSlots.length})</h2>
            {availableSlots.length === 0 ? (
              <Card>
                <p className="text-center text-slate-500 py-8">No available slots in the next 24 hours.</p>
              </Card>
            ) : (
              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                {availableSlots.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedSlot?.id === slot.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'bg-white hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-sm">Lane {slot.lane}</div>
                    <div className="text-xs text-slate-500">{formatDate(new Date(slot.date + 'T12:00:00'))} · {slot.startTime} – {slot.endTime}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div>
            <h2 className="font-semibold mb-3 text-slate-700">Your Details</h2>
            <Card>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {selectedSlot && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <strong>Selected:</strong> Lane {selectedSlot.lane} · {selectedSlot.startTime} – {selectedSlot.endTime}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555 0000"
                    required
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Confirm Booking</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
