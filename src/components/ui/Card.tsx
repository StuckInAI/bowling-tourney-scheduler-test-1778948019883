import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
};

export default function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div className={clsx(styles.card, styles[padding], className)}>
      {children}
    </div>
  );
}
