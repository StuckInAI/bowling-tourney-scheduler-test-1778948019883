import { loadData, saveData } from '@/lib/storage';
import type { User, Slot, Tournament } from '@/types';

export function seedInitialData() {
  const seeded = loadData<boolean>('seeded', false);
  if (seeded) return;

  // Seed admin user
  const users: User[] = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@bowlpro.com',
      password: 'admin123',
      role: 'admin',
      subscriptionTier: 'none',
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'member123',
      role: 'member',
      subscriptionTier: 'basic',
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];
  saveData('users', users);

  // Seed slots for next 7 days
  const slots: Slot[] = [];
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    for (let lane = 1; lane <= 4; lane++) {
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
      times.forEach((t, i) => {
        slots.push({
          id: `slot-${dateStr}-lane${lane}-${i}`,
          date: dateStr,
          startTime: t.start,
          endTime: t.end,
          lane,
          capacity: 6,
          bookedCount: 0,
          status: 'available',
          price: lane <= 2 ? 15 : 20,
        });
      });
    }
  }
  saveData('slots', slots);

  // Seed a tournament
  const tournaments: Tournament[] = [
    {
      id: 'tournament-1',
      name: 'Summer Bowl Championship',
      description: 'Annual summer bowling championship for all skill levels.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '18:00',
      maxParticipants: 16,
      entryFee: 25,
      prize: '$500 Cash Prize',
      status: 'upcoming',
      participants: [],
      matches: [],
      createdAt: new Date().toISOString(),
    },
  ];
  saveData('tournaments', tournaments);
  saveData('seeded', true);
}
