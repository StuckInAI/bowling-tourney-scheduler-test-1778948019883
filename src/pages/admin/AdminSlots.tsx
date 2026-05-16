import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import type { Slot } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

function statusVariant(status: Slot['status']): BadgeVariant {
  if (status === 'available') return 'success';
  if (status === 'full') return 'warning';
  return 'danger';
}

const emptyForm = {
  date: '',
  startTime: '',
  endTime: '',
  lane: 1,
  capacity: 6,
  bookedCount: 0,
  status: 'available' as Slot['status'],
  price: 20,
};

export default function AdminSlots() {
  const { slots, addSlot, updateSlot, deleteSlot } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingSlot(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (slot: Slot) => {
    setEditingSlot(slot);
    setForm({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      lane: slot.lane,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount,
      status: slot.status,
      price: slot.price,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingSlot) {
      updateSlot(editingSlot.id, form);
    } else {
      addSlot(form);
    }
    setModalOpen(false);
  };

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Slot Management</h1>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Slot
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {slots.map(slot => (
          <Card key={slot.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-800">
                Lane {slot.lane} &mdash; {slot.date}
              </span>
              <span className="text-sm text-slate-500">
                {slot.startTime} &ndash; {slot.endTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant(slot.status)}>{slot.status}</Badge>
              <span className="text-sm">{slot.bookedCount}/{slot.capacity} booked</span>
              <span className="text-sm font-medium">${slot.price}</span>
              <Button size="sm" variant="secondary" onClick={() => openEdit(slot)}>
                <Edit2 size={14} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteSlot(slot.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
        {slots.length === 0 && (
          <Card className="text-center text-slate-400 py-12">No slots yet.</Card>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSlot ? 'Edit Slot' : 'Add Slot'}>
        <div className="p-6 flex flex-col gap-4">
          <Input label="Date" type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} />
          <Input label="Start Time" type="time" value={form.startTime} onChange={e => handleChange('startTime', e.target.value)} />
          <Input label="End Time" type="time" value={form.endTime} onChange={e => handleChange('endTime', e.target.value)} />
          <Input label="Lane" type="number" value={form.lane} onChange={e => handleChange('lane', Number(e.target.value))} />
          <Input label="Capacity" type="number" value={form.capacity} onChange={e => handleChange('capacity', Number(e.target.value))} />
          <Input label="Price ($)" type="number" value={form.price} onChange={e => handleChange('price', Number(e.target.value))} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={form.status}
              onChange={e => handleChange('status', e.target.value as Slot['status'])}
            >
              <option value="available">Available</option>
              <option value="full">Full</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
