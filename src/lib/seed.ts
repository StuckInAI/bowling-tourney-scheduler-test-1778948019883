import { saveState } from './storage';
import type { User, Slot, Tournament, Notification } from '@/types';

export function seedInitialData() {
  const isSeeded = localStorage.getItem('bowling_seeded') === 'true';
  if (isSeeded) return;

  const admin: User = {
    id: 'admin-1',
    name: 'Admin Boss',
    email: 'admin@bowling.com',
    password: 'admin123',
    role: 'admin',
    subscriptionStatus: 'active',
    joinedAt: new Date().toISOString(),
  };

  const member: User = {
    id: 'member-1',
    name: 'Jane Bowler',
    email: 'jane@bowler.com',
    password: 'password',
    role: 'member',
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    joinedAt: new Date().toISOString(),
  };

  const member2: User = {
    id: 'member-2',
    name: 'John Strike',
    email: 'john@bowler.com',
    password: 'password',
    role: 'member',
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    joinedAt: new Date().toISOString(),
  };

  const slots: Slot[] = [];
  const dates = [
    new Date().toISOString().split('T')[0],
    new Date(Date.now() + 86400000).toISOString().split('T')[0],
  ];

  dates.forEach(date => {
    for (let h = 9; h < 22; h++) {
      const startTime = `${h.toString().padStart(2, '0')}:00`;
      const endTime = `${(h + 1).toString().padStart(2, '0')}:00`;
      for (let lane = 1; lane <= 16; lane++) {
        slots.push({
          id: `slot-${date}-${lane}-${h}`,
          date,
          startTime,
          endTime,
          lane,
          status: 'available',
        });
      }
    }
  });

  const tournaments: Tournament[] = [
    {
      id: 'tour-1',
      name: 'Summer Invitational',
      description: 'The biggest event of the season.',
      format: 'single-elimination',
      startDate: dates[1],
      endDate: dates[1],
      participants: [
        { userId: member.id, status: 'pending' },
        { userId: member2.id, status: 'accepted' },
      ],
      status: 'draft',
      prize: '$1000',
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'Welcome!',
      message: 'Welcome to our Bowling Management System.',
      type: 'info',
      targetRole: 'all',
      createdAt: new Date().toISOString(),
      read: false,
    },
  ];

  saveState('users', [admin, member, member2]);
  saveState('slots', slots);
  saveState('tournaments', tournaments);
  saveState('notifications', notifications);
  saveState('bookings', []);
  localStorage.setItem('bowling_seeded', 'true');
}
