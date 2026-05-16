import styles from './StatCard.module.css';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'orange';
  subtitle?: string;
};

export default function StatCard({ title, value, icon, color = 'blue', subtitle }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[color] ?? ''}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.body}>
        <div className={styles.value}>{value}</div>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
}
