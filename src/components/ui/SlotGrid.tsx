import styles from './SlotGrid.module.css';
import type { Slot } from '@/types';

type SlotGridProps = {
  slots: Slot[];
  onSlotClick?: (slot: Slot) => void;
  showLegend?: boolean;
};

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00',
];

const LANES = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SlotGrid({ slots, onSlotClick, showLegend = true }: SlotGridProps) {
  const getSlot = (lane: number, time: string) =>
    slots.find((s) => s.lane === lane && s.startTime === time);

  return (
    <div className={styles.wrapper}>
      {showLegend && (
        <div className={styles.legend}>
          {(['available', 'booked_member', 'booked_outsider', 'tournament', 'blocked'] as const).map((status) => (
            <div key={status} className={styles.legendItem}>
              <div className={`${styles.cell} ${styles[status]}`} style={{ width: 16, height: 16, minHeight: 'unset' }} />
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
              {LANES.map((lane) => (
                <th key={lane} className={styles.laneHeader}>Lane {lane}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time}>
                <td className={styles.timeCell}>{time}</td>
                {LANES.map((lane) => {
                  const slot = getSlot(lane, time);
                  return (
                    <td key={lane} className={styles.td}>
                      {slot ? (
                        <div
                          className={`${styles.cell} ${styles[slot.status]} ${onSlotClick ? styles.clickable : ''}`}
                          onClick={() => onSlotClick?.(slot)}
                          title={`Lane ${lane} ${time} - ${slot.status}`}
                        />
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
