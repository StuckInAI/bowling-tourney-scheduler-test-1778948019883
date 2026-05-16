import styles from './SlotGrid.module.css';
import Badge from '@/components/ui/Badge';
import type { Slot, Lane } from '@/types';
import { formatTime } from '@/lib/utils';
import type { BadgeVariant } from '@/components/ui/SlotGrid';

export type { BadgeVariant };

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9); // 9am - 9pm

function getSlotVariant(status: Slot['status']): BadgeVariant {
  switch (status) {
    case 'available':       return 'success';
    case 'booked_member':   return 'info';
    case 'booked_outsider': return 'warning';
    case 'tournament':      return 'purple';
    case 'blocked':         return 'neutral';
    default:               return 'neutral';
  }
}

function getSlotLabel(status: Slot['status']): string {
  switch (status) {
    case 'available':       return 'Free';
    case 'booked_member':   return 'Member';
    case 'booked_outsider': return 'Guest';
    case 'tournament':      return 'Tourn.';
    case 'blocked':         return 'Blocked';
    default:               return status;
  }
}

type SlotCellProps = {
  slot: Slot | undefined;
  onClick?: (slot: Slot) => void;
  selectable?: boolean;
};

function SlotCell({ slot, onClick, selectable }: SlotCellProps) {
  if (!slot) {
    return <div className={styles.cellEmpty} />;
  }
  const clickable = selectable && slot.status === 'available';
  return (
    <div
      className={`${styles.cell} ${styles[slot.status]} ${clickable ? styles.clickable : ''}`}
      onClick={() => clickable && onClick && onClick(slot)}
      title={`${slot.startTime} - ${slot.endTime}: ${slot.status}`}
    >
      <Badge variant={getSlotVariant(slot.status)}>{getSlotLabel(slot.status)}</Badge>
    </div>
  );
}

type SlotGridProps = {
  lanes: Lane[];
  slots: Slot[];
  date: string;
  onSlotClick?: (slot: Slot) => void;
  selectable?: boolean;
};

export default function SlotGrid({ lanes, slots, date, onSlotClick, selectable }: SlotGridProps) {
  const getSlot = (laneId: string, hour: number): Slot | undefined =>
    slots.find(
      (s) =>
        s.date === date &&
        s.laneId === laneId &&
        s.startTime === `${String(hour).padStart(2, '0')}:00`
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.timeHeader}>Time</th>
              {lanes.map((lane) => (
                <th key={lane.id} className={styles.laneHeader}>
                  {lane.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className={styles.timeCell}>
                  {formatTime(`${String(hour).padStart(2, '0')}:00`)}
                </td>
                {lanes.map((lane) => (
                  <td key={lane.id} className={styles.td}>
                    <SlotCell
                      slot={getSlot(lane.id, hour)}
                      onClick={onSlotClick}
                      selectable={selectable}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}><Badge variant="success">Free</Badge> Available</span>
        <span className={styles.legendItem}><Badge variant="info">Member</Badge> Member Booked</span>
        <span className={styles.legendItem}><Badge variant="warning">Guest</Badge> Outsider Booked</span>
        <span className={styles.legendItem}><Badge variant="purple">Tourn.</Badge> Tournament</span>
        <span className={styles.legendItem}><Badge variant="neutral">Blocked</Badge> Blocked</span>
      </div>
    </div>
  );
}
