import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
};

export default function Card({ children, className, padding = 'md', style }: CardProps) {
  return (
    <div className={clsx(styles.card, styles[padding], className)} style={style}>
      {children}
    </div>
  );
}