import type { Slot } from '@/types';

export interface SlotGridProps {
  slots: Slot[];
  onSlotClick: (slot: Slot) => void;
  selectedSlotId?: string;
}

export default function SlotGrid({ slots, onSlotClick, selectedSlotId }: SlotGridProps) {
  const getSlotStyle = (slot: Slot, isSelected: boolean) => {
    if (slot.status === 'closed') {
      return 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200';
    }
    if (slot.status === 'full') {
      return 'bg-red-50 text-red-400 cursor-not-allowed border border-red-200';
    }
    if (isSelected) {
      return 'bg-blue-600 text-white border border-blue-700 cursor-pointer';
    }
    return 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 cursor-pointer';
  };

  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">No slots available for the selected date.</p>
      </div>
    );
  }

  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = `Lane ${slot.lane}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([lane, laneSlots]) => (
        <div key={lane}>
          <h3 className="text-sm font-semibold text-slate-600 mb-2">{lane}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {laneSlots.map(slot => {
              const isSelected = slot.id === selectedSlotId;
              return (
                <button
                  key={slot.id}
                  disabled={slot.status === 'closed' || slot.status === 'full'}
                  onClick={() => onSlotClick(slot)}
                  className={`p-3 rounded-lg text-xs font-medium transition-all ${getSlotStyle(slot, isSelected)}`}
                >
                  <div>{slot.startTime} - {slot.endTime}</div>
                  <div className="mt-1 opacity-75">
                    {slot.status === 'closed' ? 'Closed' :
                     slot.status === 'full' ? 'Full' :
                     `${slot.capacity - slot.bookedCount} left`}
                  </div>
                  <div className="mt-0.5 font-semibold">${slot.price}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
