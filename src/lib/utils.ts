import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(time: string): string {
  return time; // Simple string passthrough since we use 'HH:mm'
}

export function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function isWithinNext24Hours(dateStr: string, timeStr: string): boolean {
  const now = new Date();
  const slotDate = new Date(`${dateStr}T${timeStr}`);
  const diff = slotDate.getTime() - now.getTime();
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}