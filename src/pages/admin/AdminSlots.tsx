import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import type { Slot } from '@/types';

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'blocked', label: 'Blocked' },
];

const TIME_OPTIONS = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  const val = `${String(h).padStart(2, '0')}:${m}`;
  return { value: val, label: val };
});

export default function AdminSlots() {
  const { slots, addSlot, updateSlot, deleteSlot } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [editSlot, setEditSlot] = useState<Slot | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ laneNumber: '', startTime: '09:00', endTime: '10:00', status: 'available' });

  const daySlots = slots.filter(s => s.date === selectedDate).sort((a, b) => a.laneNumber - b.laneNumber || a.startTime.localeCompare(b.startTime));

  const resetForm = () => setForm({ laneNumber: '', startTime: '09:00', endTime: '10:00', status: 'available' });

  const handleAdd = () => {
    const slot: Slot = {
      id: crypto.randomUUID(),
      date: selectedDate,
      laneNumber: parseInt(form.laneNumber),
      startTime: form.startTime,
      endTime: form.endTime,
      status: form.status as Slot['status'],
      createdAt: new Date().toISOString(),
    };
    addSlot(slot);
    setShowAdd(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editSlot) return;
    updateSlot(editSlot.id, { laneNumber: parseInt(form.laneNumber), startTime: form.startTime, endTime: form.endTime, status: form.status as Slot['status'] });
    setEditSlot(null);
    resetForm();
  };

  const openEdit = (slot: Slot) => {
    setEditSlot(slot);
    setForm({ laneNumber: String(slot.laneNumber), startTime: slot.startTime, endTime: slot.endTime, status: slot.status });
  };

  const statusVariant: Record<string, 'success' | 'danger' | 'warning' | 'neutral' | 'purple'> = {
    available: 'success',
    booked_member: 'info' as 'neutral',
    booked_outsider: 'warning',
    tournament: 'purple',
    blocked: 'danger',
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Slot Management</h1>
          <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Manage lane availability.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAdd(true); }}>+ Add Slot</Button>
      </div>

      <Card style={{ marginBottom: '1.5rem' } as React.CSSProperties}>
        <Input type="date" label="Select Date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      </Card>

      <Card>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Slots for {formatDate(selectedDate)}</h2>
        {daySlots.length === 0 ? (
          <p style={{ color: 'var(--color-gray-400)', textAlign: 'center', padding: '2rem 0' }}>No slots for this date.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {daySlots.map(s => (
              <div key={s.id} style={{ padding: '0.75rem 1rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Lane {s.laneNumber}</span>
                  <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>{s.startTime} – {s.endTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant={statusVariant[s.status] ?? 'neutral'}>{s.status}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteId(s.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Slot">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Lane Number" type="number" value={form.laneNumber} onChange={e => setForm(p => ({ ...p, laneNumber: e.target.value }))} required />
          <Select label="Start Time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} options={TIME_OPTIONS} />
          <Select label="End Time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} options={TIME_OPTIONS} />
          <Select label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.laneNumber}>Add Slot</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editSlot} onClose={() => setEditSlot(null)} title="Edit Slot">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Lane Number" type="number" value={form.laneNumber} onChange={e => setForm(p => ({ ...p, laneNumber: e.target.value }))} required />
          <Select label="Start Time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} options={TIME_OPTIONS} />
          <Select label="End Time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} options={TIME_OPTIONS} />
          <Select label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setEditSlot(null)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Slot">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Are you sure you want to delete this slot?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (deleteId) { deleteSlot(deleteId); setDeleteId(null); } }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
