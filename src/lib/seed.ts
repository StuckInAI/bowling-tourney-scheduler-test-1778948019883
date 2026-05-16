import { setItem, getItem } from '@/lib/storage';
import type {
  User,
  Lane,
  Slot,
  Booking,
  Tournament,
  TournamentParticipant,
  TournamentMatch,
  Notification,
  Subscription,
} from '@/types';
import { generateId, generateConfirmationCode, addHours, formatDate } from '@/lib/utils';

export function seedInitialData(): void {
  if (getItem<boolean>('seeded')) return;

  // Lanes
  const lanes: Lane[] = Array.from({ length: 16 }, (_, i) => ({
    id: `lane-${i + 1}`,
    number: i + 1,
    name: `Lane ${i + 1}`,
  }));
  setItem('lanes', lanes);

  // Admin user
  const adminUser: User = {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@bowlpro.com',
    password: 'admin123',
    role: 'admin',
    phone: '555-0100',
    createdAt: new Date().toISOString(),
  };

  // Member users
  const now = new Date();
  const subEnd = new Date(now);
  subEnd.setFullYear(subEnd.getFullYear() + 1);

  const members: User[] = [
    {
      id: 'member-001',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'member',
      phone: '555-0101',
      createdAt: new Date().toISOString(),
      subscription: {
        id: 'sub-001',
        userId: 'member-001',
        status: 'active',
        startDate: now.toISOString(),
        endDate: subEnd.toISOString(),
        plan: 'yearly',
        amount: 299,
      },
    },
    {
      id: 'member-002',
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
      role: 'member',
      phone: '555-0102',
      createdAt: new Date().toISOString(),
      subscription: {
        id: 'sub-002',
        userId: 'member-002',
        status: 'active',
        startDate: now.toISOString(),
        endDate: subEnd.toISOString(),
        plan: 'yearly',
        amount: 299,
      },
    },
    {
      id: 'member-003',
      name: 'Carol Davis',
      email: 'carol@example.com',
      password: 'password123',
      role: 'member',
      phone: '555-0103',
      createdAt: new Date().toISOString(),
      subscription: {
        id: 'sub-003',
        userId: 'member-003',
        status: 'active',
        startDate: now.toISOString(),
        endDate: subEnd.toISOString(),
        plan: 'yearly',
        amount: 299,
      },
    },
    {
      id: 'member-004',
      name: 'Dan Wilson',
      email: 'dan@example.com',
      password: 'password123',
      role: 'member',
      phone: '555-0104',
      createdAt: new Date().toISOString(),
      subscription: {
        id: 'sub-004',
        userId: 'member-004',
        status: 'expired',
        startDate: new Date(now.getTime() - 400 * 86400000).toISOString(),
        endDate: new Date(now.getTime() - 35 * 86400000).toISOString(),
        plan: 'yearly',
        amount: 299,
      },
    },
    {
      id: 'member-005',
      name: 'Eva Martinez',
      email: 'eva@example.com',
      password: 'password123',
      role: 'member',
      phone: '555-0105',
      createdAt: new Date().toISOString(),
      subscription: {
        id: 'sub-005',
        userId: 'member-005',
        status: 'active',
        startDate: now.toISOString(),
        endDate: subEnd.toISOString(),
        plan: 'yearly',
        amount: 299,
      },
    },
    {
      id: 'member-006',
      name: 'Frank Lee',
      email: 'frank@example.com',
      password: 'password123',
      role: 'member',
      phone: '555-0106',
      createdAt: new Date().toISOString(),
      subscription: {
        id: 'sub-006',
        userId: 'member-006',
        status: 'active',
        startDate: now.toISOString(),
        endDate: subEnd.toISOString(),
        plan: 'yearly',
        amount: 299,
      },
    },
  ];

  const users: User[] = [adminUser, ...members];
  setItem('users', users);

  // Generate slots for today + next 7 days
  const slots: Slot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const dateStr = formatDate(date);

    for (let lane = 1; lane <= 16; lane++) {
      for (let hour = 9; hour < 22; hour++) {
        const slotId = generateId();
        const startH = hour.toString().padStart(2, '0');
        const endH = (hour + 1).toString().padStart(2, '0');
        slots.push({
          id: slotId,
          laneId: `lane-${lane}`,
          date: dateStr,
          startTime: `${startH}:00`,
          endTime: `${endH}:00`,
          status: 'available',
        });
      }
    }
  }

  // Seed some bookings
  const bookings: Booking[] = [];

  // Member booking - today lane 1, 10am
  const todayStr = formatDate(today);
  const memberSlot = slots.find(
    (s) => s.date === todayStr && s.laneId === 'lane-1' && s.startTime === '10:00'
  );
  if (memberSlot) {
    memberSlot.status = 'booked_member';
    bookings.push({
      id: generateId(),
      slotId: memberSlot.id,
      type: 'member',
      userId: 'member-001',
      confirmationCode: generateConfirmationCode(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    });
  }

  // Outsider booking - today lane 3, 2pm
  const outsiderSlot = slots.find(
    (s) => s.date === todayStr && s.laneId === 'lane-3' && s.startTime === '14:00'
  );
  if (outsiderSlot) {
    outsiderSlot.status = 'booked_outsider';
    bookings.push({
      id: generateId(),
      slotId: outsiderSlot.id,
      type: 'outsider',
      outsiderName: 'John Public',
      outsiderEmail: 'john@public.com',
      outsiderPhone: '555-9999',
      confirmationCode: generateConfirmationCode(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    });
  }

  // Tournament slots - tomorrow lane 5-8, noon
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);
  const tournamentSlots = slots.filter(
    (s) =>
      s.date === tomorrowStr &&
      ['lane-5', 'lane-6', 'lane-7', 'lane-8'].includes(s.laneId) &&
      s.startTime >= '12:00' &&
      s.startTime <= '15:00'
  );
  tournamentSlots.forEach((s) => {
    s.status = 'tournament';
  });

  setItem('slots', slots);
  setItem('bookings', bookings);

  // Tournaments
  const tournament1: Tournament = {
    id: 'tournament-001',
    name: 'Spring Championship 2025',
    format: 'single_elimination',
    status: 'active',
    startDate: tomorrowStr,
    endDate: tomorrowStr,
    description: 'Annual spring single elimination championship',
    maxParticipants: 8,
    laneIds: ['lane-5', 'lane-6', 'lane-7', 'lane-8'],
    createdAt: new Date().toISOString(),
  };

  const tournament2: Tournament = {
    id: 'tournament-002',
    name: 'Members Round Robin',
    format: 'round_robin',
    status: 'draft',
    startDate: formatDate(addHours(today, 7 * 24)),
    endDate: formatDate(addHours(today, 8 * 24)),
    description: 'Round robin for all active members',
    maxParticipants: 6,
    laneIds: ['lane-9', 'lane-10'],
    createdAt: new Date().toISOString(),
  };

  setItem('tournaments', [tournament1, tournament2]);

  // Tournament participants
  const participants: TournamentParticipant[] = [
    { id: generateId(), tournamentId: 'tournament-001', userId: 'member-001', inviteStatus: 'accepted', invitedAt: new Date().toISOString() },
    { id: generateId(), tournamentId: 'tournament-001', userId: 'member-002', inviteStatus: 'accepted', invitedAt: new Date().toISOString() },
    { id: generateId(), tournamentId: 'tournament-001', userId: 'member-003', inviteStatus: 'pending', invitedAt: new Date().toISOString() },
    { id: generateId(), tournamentId: 'tournament-001', userId: 'member-005', inviteStatus: 'declined', invitedAt: new Date().toISOString(), respondedAt: new Date().toISOString() },
    { id: generateId(), tournamentId: 'tournament-001', userId: 'member-006', inviteStatus: 'accepted', invitedAt: new Date().toISOString() },
    { id: generateId(), tournamentId: 'tournament-002', userId: 'member-001', inviteStatus: 'pending', invitedAt: new Date().toISOString() },
    { id: generateId(), tournamentId: 'tournament-002', userId: 'member-002', inviteStatus: 'pending', invitedAt: new Date().toISOString() },
  ];
  setItem('tournament_participants', participants);

  // Tournament matches
  const matches: TournamentMatch[] = [
    {
      id: generateId(),
      tournamentId: 'tournament-001',
      round: 1,
      matchNumber: 1,
      participant1Id: 'member-001',
      participant2Id: 'member-002',
      status: 'scheduled',
    },
    {
      id: generateId(),
      tournamentId: 'tournament-001',
      round: 1,
      matchNumber: 2,
      participant1Id: 'member-006',
      participant2Id: undefined,
      status: 'bye',
    },
  ];
  setItem('tournament_matches', matches);

  // Notifications
  const notifications: Notification[] = [
    {
      id: generateId(),
      type: 'booking_confirmation',
      recipientEmail: 'alice@example.com',
      subject: 'Booking Confirmed - Lane 1, 10:00 AM',
      body: 'Your booking for Lane 1 on ' + todayStr + ' at 10:00 AM has been confirmed.',
      sentAt: new Date().toISOString(),
      status: 'sent',
    },
    {
      id: generateId(),
      type: 'tournament_invite',
      recipientEmail: 'alice@example.com',
      subject: 'Tournament Invitation - Spring Championship 2025',
      body: 'You have been invited to the Spring Championship 2025.',
      sentAt: new Date().toISOString(),
      status: 'sent',
    },
    {
      id: generateId(),
      type: 'outsider_booking',
      recipientEmail: 'john@public.com',
      subject: 'Booking Confirmed - Confirmation Code: BP-XY123',
      body: 'Your booking for Lane 3 on ' + todayStr + ' at 2:00 PM is confirmed. Code: BP-XY123',
      sentAt: new Date().toISOString(),
      status: 'sent',
    },
  ];
  setItem('notifications', notifications);

  setItem('seeded', true);
}

export function resetData(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('bowlpro_'));
  keys.forEach((k) => localStorage.removeItem(k));
}
