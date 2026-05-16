import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SlotGrid from '@/components/ui/SlotGrid';
import { formatDate } from '@/lib/utils';
import type { SlotStatus } from '@/types';

export default function AdminSlots() {
  const { slots, updateSlot, generateDaySlots, deleteSlot } = useAppContext();
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [showGenModal, setShowGenModal] = useState(false);

  const filteredSlots = slots.filter((s) => s.date === filterDate);

  const handleGenerate = () => {
    generateDaySlots(filterDate);
    setShowGenModal(false);
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lane Scheduling</h1>
          <p className="text-slate-500">Manage 16 lanes and hourly slots.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-40"
          />
          <Button onClick={() => setShowGenModal(true)}>Generate Day</Button>
        </div>
      </div>

      <Card>
        <p className="mb-4 text-slate-500 text-sm">
          Displaying slots for {formatDate(new Date(filterDate))}
        </p>
        {filteredSlots.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-slate-500 mb-4">No slots generated for this day.</p>
            <Button onClick={handleGenerate}>Auto-generate 16 lanes</Button>
          </div>
        ) : (
          <SlotGrid 
            slots={filteredSlots} 
            onSlotClick={(s) => {
              const nextStatus: Record<SlotStatus, SlotStatus> = {
                'available': 'blocked',
                'blocked': 'tournament',
                'tournament': 'available',
                'booked_member': 'booked_member',
                'booked_outsider': 'booked_outsider'
              };
              if (s.status !== 'booked_member' && s.status !== 'booked_outsider') {
                updateSlot(s.id, { status: nextStatus[s.status] });
              }
            }}
          />
        )}
      </Card>

      <Modal isOpen={showGenModal} onClose={() => setShowGenModal(false)} title="Generate Slots">
        <div className="p-4 flex flex-col gap-4">
          <p>This will generate 16 lanes with hourly slots (09:00 - 22:00) for {filterDate}. Existing unbooked slots for this day will be reset.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowGenModal(false)}>Cancel</Button>
            <Button onClick={handleGenerate}>Proceed</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}