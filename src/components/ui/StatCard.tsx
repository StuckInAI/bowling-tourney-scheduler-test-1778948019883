import type { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
  sub?: string;
};

export default function StatCard({ label, value, icon: Icon, color = 'blue', sub }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${styles[color]}`}>
        <Icon size={22} />
      </div>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {sub && <span className={styles.sub}>{sub}</span>}
      </div>
    </div>
  );
}
