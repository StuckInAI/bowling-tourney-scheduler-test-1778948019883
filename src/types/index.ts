export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  membershipType?: 'standard' | 'premium';
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  joinedAt: string;
  phone?: string;
}

export type SlotStatus = 'available' | 'full' | 'closed' | 'booked_member' | 'booked_outsider' | 'tournament';

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  capacity: number;
  bookedCount: number;
  status: SlotStatus;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  type: 'member' | 'outsider';
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export type TournamentStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'league';

export interface TournamentParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  participants: TournamentParticipant[];
  status: TournamentStatus;
  entryFee: number;
  prizePool: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetRole: 'all' | 'member' | 'admin';
  createdAt: string;
  read?: boolean;
}
