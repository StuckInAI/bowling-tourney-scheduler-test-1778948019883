import type { AppState, User, Slot, Tournament, Notification } from '@/types';
import { loadState, saveState } from '@/lib/storage';

const SEED_KEY = 'bowling_seeded_v2';

export function seedInitialData() {
  if (localStorage.getItem(SEED_KEY)) return;

  const existing = loadState();
  if (existing && existing.users.length > 0) {
    localStorage.setItem(SEED_KEY, 'true');
    return;
  }

  const users: User[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bowlpro.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'member123',
      role: 'member',
      subscriptionTier: 'premium',
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'member123',
      role: 'member',
      subscriptionTier: 'basic',
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: 'member123',
      role: 'member',
      subscriptionTier: 'vip',
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  const today = new Date();
  const slots: Slot[] = [];

  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    for (let lane = 1; lane <= 8; lane++) {
      const times = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
        { start: '18:00', end: '19:00' },
        { start: '19:00', end: '20:00' },
        { start: '20:00', end: '21:00' },
      ];

      times.forEach(({ start, end }) => {
        slots.push({
          id: `slot-${dateStr}-lane${lane}-${start}`,
          date: dateStr,
          startTime: start,
          endTime: end,
          lane,
          status: 'available',
        });
      });
    }
  }

  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Summer Championship 2025',
      description: 'Annual summer bowling championship. Top prizes for top scorers!',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'open',
      maxParticipants: 32,
      participants: ['member-1', 'member-3'],
      prize: '$500 + Trophy',
      entryFee: 25,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tournament-2',
      name: 'Beginner Friendly Cup',
      description: 'Perfect for new bowlers! Fun and competitive.',
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'open',
      maxParticipants: 16,
      participants: [],
      prize: 'Medals + Vouchers',
      entryFee: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tournament-3',
      name: 'Pro League Spring 2025',
      description: 'Professional league tournament. Registration closed.',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'closed',
      maxParticipants: 24,
      participants: ['member-1', 'member-2', 'member-3'],
      prize: '$1000 + Championship Belt',
      entryFee: 50,
      createdAt: new Date().toISOString(),
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'Welcome to BowlPro!',
      message: 'Welcome to our bowling reservation system. Book your lanes and join tournaments today!',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      title: 'Summer Championship Registration Open',
      message: 'Registration for the Summer Championship 2025 is now open. Limited spots available!',
      targetRole: 'member',
      createdAt: new Date().toISOString(),
    },
  ];

  const seedState: AppState = {
    users,
    slots,
    bookings: [],
    tournaments,
    notifications,
    currentUser: null,
  };

  saveState(seedState);
  localStorage.setItem(SEED_KEY, 'true');
}
