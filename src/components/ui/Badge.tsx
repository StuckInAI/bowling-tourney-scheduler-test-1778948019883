import clsx from 'clsx';
import styles from './Badge.module.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[variant])}>{children}</span>
  );
}
