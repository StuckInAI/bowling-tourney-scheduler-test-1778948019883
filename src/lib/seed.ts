import { loadState, saveState } from './storage';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';

export function seedInitialData() {
  const existing = loadState();
  if (existing?.seeded) return;

  const users: User[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bowlpro.com',
      password: 'admin123',
      role: 'admin',
      subscription: 'vip',
      subscriptionTier: 'vip',
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'member-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'member',
      subscription: 'premium',
      subscriptionTier: 'premium',
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'member-2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
      role: 'member',
      subscription: 'basic',
      subscriptionTier: 'basic',
      joinedAt: new Date().toISOString(),
    },
  ];

  const today = new Date();
  const slots: Slot[] = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    for (let lane = 1; lane <= 8; lane++) {
      for (let hour = 9; hour <= 20; hour++) {
        const startHour = hour.toString().padStart(2, '0');
        const endHour = (hour + 1).toString().padStart(2, '0');
        const startTime = `${startHour}:00`;
        const endTime = `${endHour}:00`;
        slots.push({
          id: `slot-${dateStr}-${lane}-${hour}`,
          date: dateStr,
          time: startTime,
          startTime,
          endTime,
          lane,
          status: 'available',
        });
      }
    }
  }

  const bookings: Booking[] = [];

  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Summer Bowling Championship',
      description: 'Annual summer tournament open to all members.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString().split('T')[0],
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15).toISOString().split('T')[0],
      status: 'upcoming',
      maxParticipants: 32,
      currentParticipants: 12,
      entryFee: 25,
      prize: '$500 cash prize',
      lanes: [1, 2, 3, 4],
      registeredUserIds: ['member-1'],
    },
    {
      id: 'tournament-2',
      name: 'Weekend League',
      description: 'Weekly competitive league for experienced bowlers.',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
      status: 'upcoming',
      maxParticipants: 16,
      currentParticipants: 8,
      entryFee: 15,
      prize: 'Trophy + $200',
      lanes: [5, 6],
      registeredUserIds: [],
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'Welcome to BowlPro!',
      message: 'Welcome to the BowlPro reservation system. Book your lanes and join tournaments today!',
      targetRole: 'all',
      createdAt: new Date().toISOString(),
      readBy: [],
    },
  ];

  saveState({
    users,
    slots,
    bookings,
    tournaments,
    notifications,
    currentUserId: null,
    seeded: true,
  });
}
