import { loadState, saveState } from '@/lib/storage';
import type { User, Slot, Tournament, Notification } from '@/types';

const adminUser: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@bowlpro.com',
  password: 'admin123',
  role: 'admin',
  joinedAt: new Date().toISOString(),
};

const memberUsers: User[] = [
  {
    id: 'member-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'member123',
    role: 'member',
    membershipType: 'premium',
    subscriptionStatus: 'active',
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'member-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'member123',
    role: 'member',
    membershipType: 'standard',
    subscriptionStatus: 'active',
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'member-3',
    name: 'Carol White',
    email: 'carol@example.com',
    password: 'member123',
    role: 'member',
    membershipType: 'premium',
    subscriptionStatus: 'active',
    joinedAt: new Date().toISOString(),
  },
];

function generateSlots(): Slot[] {
  const slots: Slot[] = [];
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
    for (const startTime of times) {
      const [h, m] = startTime.split(':').map(Number);
      const endHour = h + 2;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      for (let lane = 1; lane <= 4; lane++) {
        slots.push({
          id: `slot-${dateStr}-${startTime}-${lane}`,
          date: dateStr,
          startTime,
          endTime,
          lane,
          capacity: 6,
          bookedCount: 0,
          status: 'available',
          price: 25,
        });
      }
    }
  }
  return slots;
}

const sampleTournament: Tournament = {
  id: 'tournament-1',
  name: 'Summer Championship 2025',
  description: 'Annual bowling championship open to all premium members.',
  format: 'single_elimination',
  startDate: '2025-07-01',
  endDate: '2025-07-07',
  maxParticipants: 16,
  participants: [],
  status: 'upcoming',
  entryFee: 50,
  prizePool: '$500',
  createdAt: new Date().toISOString(),
};

const sampleNotification: Notification = {
  id: 'notif-1',
  title: 'Welcome to BowlPro!',
  message: 'Thank you for joining BowlPro. Book your first lane today!',
  type: 'info',
  targetRole: 'all',
  createdAt: new Date().toISOString(),
};

export function seedInitialData() {
  const existing = loadState();
  if (existing && existing.users && existing.users.length > 0) return;

  const state = {
    users: [adminUser, ...memberUsers],
    slots: generateSlots(),
    bookings: [],
    tournaments: [sampleTournament],
    notifications: [sampleNotification],
    currentUser: null,
  };

  saveState(state);
}
