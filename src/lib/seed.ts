import { saveState, loadState } from '@/lib/storage';
import type { AppState } from '@/types';

const now = new Date();
const today = now.toISOString().split('T')[0];

function addDays(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function seedInitialData(): void {
  const existing = loadState<AppState>();
  if (existing && existing.users && existing.users.length > 0) return;

  const state: AppState = {
    currentUser: null,
    users: [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@bowlpro.com',
        password: 'admin123',
        role: 'admin',
        joinedAt: today,
      },
      {
        id: 'member-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'member123',
        role: 'member',
        membershipType: 'premium',
        membershipExpiry: addDays(today, 30),
        phone: '555-0101',
        joinedAt: addDays(today, -60),
      },
      {
        id: 'member-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'member123',
        role: 'member',
        membershipType: 'basic',
        membershipExpiry: addDays(today, 15),
        phone: '555-0102',
        joinedAt: addDays(today, -30),
      },
    ],
    slots: [
      { id: 's1', lane: 1, date: today, startTime: '09:00', endTime: '10:00', status: 'available', price: 20 },
      { id: 's2', lane: 1, date: today, startTime: '10:00', endTime: '11:00', status: 'booked', price: 20 },
      { id: 's3', lane: 2, date: today, startTime: '09:00', endTime: '10:00', status: 'available', price: 20 },
      { id: 's4', lane: 2, date: today, startTime: '10:00', endTime: '11:00', status: 'maintenance', price: 20 },
      { id: 's5', lane: 3, date: today, startTime: '09:00', endTime: '10:00', status: 'available', price: 25 },
      { id: 's6', lane: 3, date: today, startTime: '10:00', endTime: '11:00', status: 'available', price: 25 },
      { id: 's7', lane: 1, date: addDays(today, 1), startTime: '09:00', endTime: '10:00', status: 'available', price: 20 },
      { id: 's8', lane: 2, date: addDays(today, 1), startTime: '09:00', endTime: '10:00', status: 'available', price: 20 },
    ],
    bookings: [
      {
        id: 'b1',
        userId: 'member-1',
        slotId: 's2',
        bookedAt: today,
        status: 'confirmed',
      },
    ],
    tournaments: [
      {
        id: 't1',
        name: 'Summer Championship',
        date: addDays(today, 7),
        startTime: '10:00',
        endTime: '18:00',
        maxParticipants: 16,
        registeredParticipants: ['member-1'],
        entryFee: 50,
        prize: '$500 + Trophy',
        status: 'upcoming',
        description: 'Annual summer bowling championship open to all members.',
      },
    ],
    notifications: [
      {
        id: 'n1',
        title: 'Welcome to BowlPro!',
        message: 'Thank you for joining our bowling reservation system.',
        createdAt: today,
        recipientType: 'all',
      },
    ],
  };

  saveState(state);
}
