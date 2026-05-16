import { loadState, saveState } from '@/lib/storage';
import type { AppState } from '@/types';

export function seedInitialData() {
  const existing = loadState<AppState>();
  if (existing && existing.users && existing.users.length > 0) {
    return;
  }

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return fmt(d);
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00',
  ];

  const lanes = [1, 2, 3, 4, 5, 6, 7, 8];

  const slots = dates.flatMap((date) =>
    timeSlots.flatMap((time) =>
      lanes.map((lane) => ({
        id: crypto.randomUUID(),
        date,
        time,
        lane,
        status: 'available' as const,
        price: lane <= 4 ? 15 : 20,
      }))
    )
  );

  const adminUser = {
    id: crypto.randomUUID(),
    name: 'Admin User',
    email: 'admin@bowlpro.com',
    password: 'admin123',
    role: 'admin' as const,
    membershipType: 'premium' as const,
    joinDate: '2023-01-01',
    status: 'active' as const,
  };

  const memberUser = {
    id: crypto.randomUUID(),
    name: 'Jane Member',
    email: 'member@bowlpro.com',
    password: 'member123',
    role: 'member' as const,
    membershipType: 'basic' as const,
    joinDate: '2024-03-15',
    status: 'active' as const,
  };

  const extraMembers = [
    { name: 'Alice Johnson', email: 'alice@example.com', membershipType: 'premium' as const },
    { name: 'Bob Smith', email: 'bob@example.com', membershipType: 'basic' as const },
    { name: 'Carol White', email: 'carol@example.com', membershipType: 'vip' as const },
  ].map((m) => ({
    id: crypto.randomUUID(),
    ...m,
    password: 'pass123',
    role: 'member' as const,
    joinDate: '2024-01-10',
    status: 'active' as const,
  }));

  const tournament = {
    id: crypto.randomUUID(),
    name: 'Spring Championship 2025',
    description: 'Annual spring bowling championship open to all members.',
    date: dates[3],
    startTime: '10:00',
    endTime: '18:00',
    lanes: [5, 6, 7, 8],
    maxParticipants: 32,
    registeredParticipants: [memberUser.id],
    prizePool: 500,
    status: 'upcoming' as const,
    entryFee: 25,
  };

  const notification = {
    id: crypto.randomUUID(),
    title: 'Welcome to BowlPro!',
    message: 'Welcome to the BowlPro bowling reservation system. Book your lanes and join tournaments!',
    targetRole: 'all' as const,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const seedState: AppState = {
    users: [adminUser, memberUser, ...extraMembers],
    slots,
    bookings: [],
    tournaments: [tournament],
    notifications: [notification],
    currentUserId: null,
  };

  saveState<AppState>(seedState);
}
