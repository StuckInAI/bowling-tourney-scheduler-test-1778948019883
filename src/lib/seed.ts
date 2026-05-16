import { loadState, saveState } from './storage';
import type { User, Slot, Tournament, Notification } from '@/types';

export function seedInitialData() {
  const seeded = loadState('seeded', false);
  if (seeded) return;

  // Seed admin user
  const users: User[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bowlpro.com',
      password: 'admin123',
      role: 'admin',
      subscription: 'none',
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'member-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'member123',
      role: 'member',
      subscription: 'premium',
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'member123',
      role: 'member',
      subscription: 'basic',
      joinedAt: new Date().toISOString(),
    },
  ];

  // Seed slots for next 7 days
  const slots: Slot[] = [];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  const lanes = [1, 2, 3, 4, 5, 6, 7, 8];

  for (let d = 0; d < 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    for (const time of times) {
      for (const lane of lanes) {
        slots.push({
          id: `slot-${dateStr}-${time}-${lane}`,
          date: dateStr,
          time,
          lane,
          status: 'available',
        });
      }
    }
  }

  // Seed tournaments
  const now = new Date();
  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Summer Bowling Championship',
      description: 'Annual summer championship for all skill levels',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxParticipants: 32,
      currentParticipants: 12,
      registeredUserIds: ['member-1'],
      status: 'upcoming',
      prize: '$500 cash prize',
      entryFee: 25,
    },
    {
      id: 'tournament-2',
      name: 'Friday Night Strikes',
      description: 'Weekly casual tournament every Friday evening',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxParticipants: 16,
      currentParticipants: 8,
      registeredUserIds: [],
      status: 'upcoming',
      prize: 'Trophy + Free month membership',
    },
  ];

  // Seed notifications
  const notifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'Welcome to BowlPro!',
      message: 'Thank you for joining BowlPro. Book your first lane today!',
      type: 'info',
      targetRole: 'all',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      title: 'Summer Championship Registration Open',
      message: 'Register now for the Summer Bowling Championship. Limited spots available!',
      type: 'success',
      targetRole: 'member',
      createdAt: new Date().toISOString(),
    },
  ];

  saveState('users', users);
  saveState('slots', slots);
  saveState('tournaments', tournaments);
  saveState('notifications', notifications);
  saveState('seeded', true);
}
