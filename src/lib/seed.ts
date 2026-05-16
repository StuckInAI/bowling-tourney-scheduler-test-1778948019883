import type { AppState, User, Slot, Tournament } from '@/types';
import { loadState, saveState } from '@/lib/storage';

export function seedInitialData() {
  const existing = loadState();
  if (existing && existing.users.length > 0) return;

  const now = new Date().toISOString();

  const users: User[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bowlpro.com',
      password: 'admin123',
      role: 'admin',
      createdAt: now,
      notificationsEnabled: true,
    },
    {
      id: 'member-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'member123',
      role: 'member',
      phone: '555-0101',
      membershipType: 'premium',
      membershipExpiry: '2025-12-31',
      createdAt: now,
      notificationsEnabled: true,
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'member123',
      role: 'member',
      phone: '555-0102',
      membershipType: 'basic',
      membershipExpiry: '2025-06-30',
      createdAt: now,
      notificationsEnabled: false,
    },
  ];

  const slots: Slot[] = [];
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    for (let lane = 1; lane <= 4; lane++) {
      const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
      times.forEach((startTime, i) => {
        const endHour = parseInt(startTime.split(':')[0]) + 2;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        slots.push({
          id: `slot-${d}-${lane}-${i}`,
          date: dateStr,
          startTime,
          endTime,
          lane,
          status: Math.random() > 0.7 ? 'booked' : 'available',
          price: lane <= 2 ? 25 : 30,
          createdAt: now,
        });
      });
    }
  }

  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Spring Championship',
      description: 'Annual spring bowling championship open to all members.',
      startDate: '2025-04-01',
      endDate: '2025-04-07',
      registrationDeadline: '2025-03-25',
      maxParticipants: 32,
      prizePool: '1000',
      entryFee: 20,
      status: 'upcoming',
      format: 'Single Elimination',
      participants: [],
      matches: [],
      createdAt: now,
    },
    {
      id: 'tournament-2',
      name: 'Summer Bowl Bash',
      description: 'Fun summer tournament with prizes for all skill levels.',
      startDate: '2025-07-10',
      endDate: '2025-07-12',
      registrationDeadline: '2025-07-01',
      maxParticipants: 16,
      prizePool: '500',
      entryFee: 10,
      status: 'upcoming',
      format: 'Round Robin',
      participants: [],
      matches: [],
      createdAt: now,
    },
  ];

  const state: AppState = {
    users,
    slots,
    bookings: [],
    tournaments,
    notifications: [
      {
        id: 'notif-1',
        title: 'Welcome to BowlPro!',
        message: 'Thank you for joining. Explore our lanes and upcoming tournaments.',
        type: 'info',
        targetRole: 'all',
        createdAt: now,
      },
    ],
    currentUser: null,
  };

  saveState(state);
}
