import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import type { SlotStatus } from '@/types';

export default function AdminSlots() {
  const { slots, addSlot, updateSlot, deleteSlot } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    lane: '1',
    status: 'available' as SlotStatus,
    notes: '',
  });

  const filteredSlots = slots.filter((s) => s.date === filterDate);

  const handleAdd = () => {
    if (!form.date || !form.startTime || !form.endTime) return;
    addSlot({
      id: crypto.randomUUID(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      lane: Number(form.lane),
      status: form.status,
      notes: form.notes,
    });
    setShowModal(false);
  };

  const statusVariant = (status: SlotStatus) => {
    switch (status) {
      case 'available': return 'success';
      case 'booked_member': return 'info';
      case 'booked_outsider': return 'warning';
      case 'tournament': return 'purple';
      case 'blocked': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Slot Management</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            label="Filter by Date"
          />
          <Button onClick={() => setShowModal(true)}>+ Add Slot</Button>
        </div>
      </div>

      <Card>
        <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
          Showing {filteredSlots.length} slots for {formatDate(new Date(filterDate))}
        </p>
        {filteredSlots.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No slots for this date.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredSlots.map((slot) => (
              <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Lane {slot.lane}</span>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{slot.startTime} – {slot.endTime}</span>
                  <Badge variant={statusVariant(slot.status)}>{slot.status.replace('_', ' ')}</Badge>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Select
                    value={slot.status}
                    onChange={(e) => updateSlot(slot.id, { status: e.target.value as SlotStatus })}
                    options={[
                      { value: 'available', label: 'Available' },
                      { value: 'booked_member', label: 'Booked (Member)' },
                      { value: 'booked_outsider', label: 'Booked (Outsider)' },
                      { value: 'tournament', label: 'Tournament' },
                      { value: 'blocked', label: 'Blocked' },
                    ]}
                  />
                  <Button size="sm" variant="danger" onClick={() => deleteSlot(slot.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Slot">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm(p => ({ ...p, startTime: e.target.value }))} required />
            <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm(p => ({ ...p, endTime: e.target.value }))} required />
          </div>
          <Input label="Lane Number" type="number" value={form.lane} onChange={(e) => setForm(p => ({ ...p, lane: e.target.value }))} required />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm(p => ({ ...p, status: e.target.value as SlotStatus }))}
            options={[
              { value: 'available', label: 'Available' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'tournament', label: 'Tournament' },
            ]}
          />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Slot</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
