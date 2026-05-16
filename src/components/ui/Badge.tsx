import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'info' && 'bg-blue-100 text-blue-800',
        variant === 'warning' && 'bg-yellow-100 text-yellow-800',
        variant === 'danger' && 'bg-red-100 text-red-800',
        variant === 'neutral' && 'bg-slate-100 text-slate-700',
        variant === 'purple' && 'bg-purple-100 text-purple-800',
        className
      )}
    >
      {children}
    </span>
  );
}
