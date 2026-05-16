import type { Slot } from '@/types';
import { cn } from '@/lib/utils';

type SlotGridProps = {
  slots: Slot[];
  onSlotClick?: (slot: Slot) => void;
  selectedSlotId?: string | null;
  showLegend?: boolean;
};

export function SlotGrid({ slots, onSlotClick, selectedSlotId, showLegend = true }: SlotGridProps) {
  const times = Array.from(new Set(slots.map(s => s.startTime))).sort();
  const lanes = Array.from({ length: 16 }, (_, i) => i + 1);

  const getSlot = (time: string, lane: number) =>
    slots.find(s => s.startTime === time && s.lane === lane);

  const statusLabel = (status: Slot['status']) => {
    switch (status) {
      case 'available': return '';
      case 'booked_member': return 'M';
      case 'booked_outsider': return 'G';
      case 'tournament': return 'T';
      case 'blocked': return 'X';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {showLegend && (
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white border border-slate-200 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded" />
            <span>Member (M)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded" />
            <span>Guest (G)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded" />
            <span>Tournament (T)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded opacity-50" />
            <span>Blocked (X)</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-2 border font-medium text-slate-500 w-20 sticky left-0 bg-slate-50">Time</th>
              {lanes.map(lane => (
                <th key={lane} className="p-2 border font-medium text-slate-500">L{lane}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="p-2 border text-center font-medium sticky left-0 bg-white text-xs">{time}</td>
                {lanes.map(lane => {
                  const slot = getSlot(time, lane);
                  if (!slot) return <td key={lane} className="p-1 border bg-slate-50" />;

                  const isSelected = selectedSlotId === slot.id;
                  const isClickable = !!onSlotClick;

                  return (
                    <td
                      key={lane}
                      className={cn(
                        'p-1 border transition-colors',
                        isClickable && slot.status === 'available' ? 'cursor-pointer' : 'cursor-default',
                        slot.status === 'available' && isClickable && 'hover:bg-green-50',
                        slot.status === 'booked_member' && 'bg-blue-50 text-blue-700',
                        slot.status === 'booked_outsider' && 'bg-orange-50 text-orange-700',
                        slot.status === 'tournament' && 'bg-purple-50 text-purple-700',
                        slot.status === 'blocked' && 'bg-slate-100 text-slate-400',
                        isSelected && 'ring-2 ring-inset ring-green-500 bg-green-100'
                      )}
                      onClick={() => onSlotClick && onSlotClick(slot)}
                      title={`Lane ${slot.lane} | ${slot.startTime} - ${slot.endTime} | ${slot.status}`}
                    >
                      <div className="h-6 flex items-center justify-center text-[10px] font-bold">
                        {statusLabel(slot.status)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SlotGrid;
