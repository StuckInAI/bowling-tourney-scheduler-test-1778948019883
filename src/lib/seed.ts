import { loadState, saveState } from '@/lib/storage';
import type { User, Slot, Tournament } from '@/types';

export function seedInitialData() {
  const state = loadState();
  if (state.users.length > 0) return; // already seeded

  const users: User[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bowl.com',
      password: 'admin123',
      role: 'admin',
      subscriptionTier: 'none',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-1',
      name: 'Jane Member',
      email: 'member@bowl.com',
      password: 'member123',
      role: 'member',
      subscriptionTier: 'basic',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-2',
      name: 'Bob Smith',
      email: 'bob@bowl.com',
      password: 'bob123',
      role: 'member',
      subscriptionTier: 'premium',
      createdAt: new Date().toISOString(),
    },
  ];

  const today = new Date();
  const slots: Slot[] = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    for (let lane = 1; lane <= 4; lane++) {
      const times = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
      ];
      times.forEach(({ start, end }, i) => {
        slots.push({
          id: `slot-${d}-${lane}-${i}`,
          date: dateStr,
          startTime: start,
          endTime: end,
          lane,
          capacity: 6,
          bookedCount: 0,
          status: 'available',
          price: 20,
        });
      });
    }
  }

  const tournaments: Tournament[] = [
    {
      id: 'tourney-1',
      name: 'Summer Strike Championship',
      description: 'Annual summer bowling tournament',
      startDate: '2025-07-01',
      endDate: '2025-07-15',
      status: 'upcoming',
      maxParticipants: 16,
      entryFee: 25,
      prizePool: 500,
      format: 'single-elimination',
      participants: [
        {
          userId: 'member-1',
          userName: 'Jane Member',
          userEmail: 'member@bowl.com',
          status: 'registered',
          joinedAt: new Date().toISOString(),
        },
      ],
      matches: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tourney-2',
      name: 'Weekend Warriors Cup',
      description: 'Casual weekend tournament for all skill levels',
      startDate: '2025-08-10',
      endDate: '2025-08-10',
      status: 'draft',
      maxParticipants: 8,
      entryFee: 10,
      prizePool: 100,
      format: 'round-robin',
      participants: [],
      matches: [],
      createdAt: new Date().toISOString(),
    },
  ];

  saveState({
    ...state,
    users,
    slots,
    tournaments,
  });
}
