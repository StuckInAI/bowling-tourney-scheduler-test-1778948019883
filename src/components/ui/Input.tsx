import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={cn(
          'border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
