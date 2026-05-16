export type UserRole = 'admin' | 'member';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';

export type TournamentFormat = 'single_elimination' | 'round_robin' | 'custom';

export type TournamentStatus = 'draft' | 'active' | 'completed';

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export type BookingType = 'member' | 'outsider';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  plan: 'yearly';
  amount: number;
}

export interface Lane {
  id: string;
  number: number;
  name: string;
}

export interface Slot {
  id: string;
  laneId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  slotId: string;
  type: BookingType;
  userId?: string;
  outsiderName?: string;
  outsiderEmail?: string;
  outsiderPhone?: string;
  confirmationCode: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  description?: string;
  maxParticipants: number;
  laneIds: string[];
  createdAt: string;
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  inviteStatus: InviteStatus;
  invitedAt: string;
  respondedAt?: string;
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  slotId?: string;
  participant1Id?: string;
  participant2Id?: string;
  winnerId?: string;
  score1?: number;
  score2?: number;
  status: 'scheduled' | 'completed' | 'bye';
}

export interface Notification {
  id: string;
  type: string;
  recipientEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
