import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Slot, SlotStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

export default function AdminSlots() {
  const { slots, addSlots, updateSlot, deleteSlot } = useAppContext();
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; slot?: Slot } | null>(null);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', lane: '1', capacity: '6', price: '25' });

  const handleOpen = (mode: 'create' | 'edit', slot?: Slot) => {
    if (mode === 'edit' && slot) {
      setForm({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        lane: String(slot.lane),
        capacity: String(slot.capacity),
        price: String(slot.price),
      });
    } else {
      setForm({ date: '', startTime: '', endTime: '', lane: '1', capacity: '6', price: '25' });
    }
    setModal({ mode, slot });
  };

  const handleSave = () => {
    if (modal?.mode === 'edit' && modal.slot) {
      const canEdit = modal.slot.status !== 'booked_member' && modal.slot.status !== 'booked_outsider' && modal.slot.status !== 'tournament';
      if (!canEdit) return;
      updateSlot({
        ...modal.slot,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        lane: Number(form.lane),
        capacity: Number(form.capacity),
        price: Number(form.price),
      });
    } else {
      const newSlot: Slot = {
        id: `slot-${crypto.randomUUID()}`,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        lane: Number(form.lane),
        capacity: Number(form.capacity),
        bookedCount: 0,
        status: 'available' as SlotStatus,
        price: Number(form.price),
      };
      addSlots([newSlot]);
    }
    setModal(null);
  };

  const statusVariant = (s: SlotStatus) => {
    if (s === 'available') return 'success';
    if (s === 'full') return 'warning';
    if (s === 'closed') return 'neutral';
    if (s === 'booked_member') return 'info';
    if (s === 'booked_outsider') return 'purple';
    if (s === 'tournament') return 'danger';
    return 'neutral';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Slot Management</h1>
        <Button onClick={() => handleOpen('create')}>+ Add Slot</Button>
      </div>

      <div className="grid gap-3">
        {slots.map(slot => (
          <Card key={slot.id} className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant(slot.status)}>{slot.status}</Badge>
              <span className="font-medium">Lane {slot.lane}</span>
              <span className="text-sm text-slate-600">{slot.date} | {slot.startTime} – {slot.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{slot.bookedCount}/{slot.capacity} booked</span>
              <Button size="sm" variant="secondary" onClick={() => handleOpen('edit', slot)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => deleteSlot(slot.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'Add Slot' : 'Edit Slot'}>
        <div className="p-6 space-y-4">
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <Input label="Start Time" type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
          <Input label="End Time" type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
          <Input label="Lane" type="number" value={form.lane} onChange={e => setForm(f => ({ ...f, lane: e.target.value }))} />
          <Input label="Capacity" type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
          <Input label="Price ($)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
