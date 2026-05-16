import type { Slot, SlotStatus } from '@/types';

export interface SlotGridProps {
  slots: Slot[];
  onSlotClick?: (slot: Slot) => void;
}

function getStatusLabel(status: SlotStatus): string {
  switch (status) {
    case 'available': return 'Available';
    case 'booked': return 'Booked';
    case 'maintenance': return 'Maintenance';
    default: return status;
  }
}

function getStatusSymbol(status: SlotStatus): string {
  switch (status) {
    case 'available': return '✓';
    case 'booked': return '●';
    case 'maintenance': return 'X';
    default: return '?';
  }
}

export default function SlotGrid({ slots, onSlotClick }: SlotGridProps) {
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No slots available for the selected date.
      </div>
    );
  }

  const lanes = Array.from(new Set(slots.map(s => s.lane))).sort((a, b) => a - b);
  const times = Array.from(new Set(slots.map(s => s.startTime))).sort();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200">
              Time \ Lane
            </th>
            {lanes.map(lane => (
              <th
                key={lane}
                className="px-3 py-2 text-center text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200"
              >
                Lane {lane}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 whitespace-nowrap">
                {time}
              </td>
              {lanes.map(lane => {
                const slot = slots.find(s => s.lane === lane && s.startTime === time);
                if (!slot) {
                  return (
                    <td key={lane} className="px-3 py-2 border border-slate-200 text-center text-xs text-slate-300">
                      —
                    </td>
                  );
                }
                const isAvailable = slot.status === 'available';
                const isBooked = slot.status === 'booked';
                const isMaintenance = slot.status === 'maintenance';
                return (
                  <td
                    key={lane}
                    className={[
                      'px-3 py-2 border border-slate-200 text-center text-xs font-medium transition-colors',
                      isAvailable && onSlotClick ? 'cursor-pointer hover:bg-blue-50' : '',
                      isAvailable ? 'bg-green-50 text-green-700' : '',
                      isBooked ? 'bg-red-50 text-red-600' : '',
                      isMaintenance ? 'bg-slate-100 text-slate-400' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => isAvailable && onSlotClick && onSlotClick(slot)}
                    title={getStatusLabel(slot.status)}
                  >
                    <div>{getStatusSymbol(slot.status)}</div>
                    <div className="text-slate-400">${slot.price}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block"></span> Available</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 inline-block"></span> Booked</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200 inline-block"></span> Maintenance</span>
      </div>
    </div>
  );
}
