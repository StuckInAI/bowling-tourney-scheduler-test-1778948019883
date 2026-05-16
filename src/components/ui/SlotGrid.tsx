import styles from './SlotGrid.module.css';
import type { Slot } from '@/types';

type SlotCellProps = {
  slot: Slot;
  onClick?: (slot: Slot) => void;
  showLabel?: boolean;
};

function SlotCell({ slot, onClick, showLabel = true }: SlotCellProps) {
  const isClickable = !!onClick && slot.status === 'available';
  return (
    <div
      className={`${styles.cell} ${styles[slot.status]} ${isClickable ? styles.clickable : ''}`}
      onClick={isClickable ? () => onClick(slot) : undefined}
      title={`Lane ${slot.laneNumber} - ${slot.time} - ${slot.status}`}
    >
      {showLabel && <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{slot.status === 'available' ? '✓' : slot.status === 'booked_member' ? 'M' : slot.status === 'booked_outsider' ? 'O' : slot.status === 'tournament' ? 'T' : 'B'}</span>}
    </div>
  );
}

type SlotGridProps = {
  slots: Slot[];
  onSlotClick?: (slot: Slot) => void;
  showLegend?: boolean;
};

export function SlotGrid({ slots, onSlotClick, showLegend = true }: SlotGridProps) {
  const times = [...new Set(slots.map(s => s.time))].sort();
  const lanes = [...new Set(slots.map(s => s.laneNumber))].sort((a, b) => a - b);

  const slotMap = new Map<string, Slot>();
  slots.forEach(s => slotMap.set(`${s.time}-${s.laneNumber}`, s));

  return (
    <div className={styles.wrapper}>
      {showLegend && (
        <div className={styles.legend}>
          {(['available', 'booked_member', 'booked_outsider', 'tournament', 'blocked'] as const).map(status => (
            <div key={status} className={styles.legendItem}>
              <div className={`${styles.cell} ${styles[status]}`} style={{ width: 20, height: 20, minHeight: 'unset' }} />
              <span>{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.timeHeader}>Time</th>
              {lanes.map(lane => (
                <th key={lane} className={styles.laneHeader}>Lane {lane}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className={styles.timeCell}>{time}</td>
                {lanes.map(lane => {
                  const slot = slotMap.get(`${time}-${lane}`);
                  return (
                    <td key={lane} className={styles.td}>
                      {slot ? (
                        <SlotCell slot={slot} onClick={onSlotClick} />
                      ) : (
                        <div className={styles.cellEmpty} />
                      )}
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
