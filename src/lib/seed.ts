import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type { User, Slot, Tournament } from '@/types';

export function seedInitialData() {
  const users = loadFromStorage<User[]>('users', []);
  if (users.length > 0) return;

  const adminUser: User = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@bowlpro.com',
    password: 'admin123',
    role: 'admin',
    subscription: 'none',
    createdAt: new Date().toISOString(),
  };

  const memberUser: User = {
    id: 'member-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'member123',
    role: 'member',
    subscription: 'monthly',
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  saveToStorage('users', [adminUser, memberUser]);

  // Generate slots for the next 7 days
  const slots: Slot[] = [];
  const times = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' },
  ];
  const lanes = [1, 2, 3, 4, 5, 6];

  for (let d = 0; d < 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    for (const lane of lanes) {
      for (const time of times) {
        slots.push({
          id: crypto.randomUUID(),
          date: dateStr,
          startTime: time.start,
          endTime: time.end,
          lane,
          status: 'available',
          type: 'standard',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  saveToStorage('slots', slots);

  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Summer Championship',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '18:00',
      status: 'upcoming',
      registrationOpen: true,
      maxParticipants: 32,
      registeredParticipants: [],
      description: 'Annual summer bowling championship open to all members.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tournament-2',
      name: 'Friday Night League',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '22:00',
      status: 'upcoming',
      registrationOpen: true,
      maxParticipants: 16,
      registeredParticipants: [],
      description: 'Weekly Friday night bowling league.',
      createdAt: new Date().toISOString(),
    },
  ];

  saveToStorage('tournaments', tournaments);
}
