export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  membershipType?: 'basic' | 'premium' | 'vip';
  membershipExpiry?: string;
  createdAt: string;
  notificationsEnabled?: boolean;
}

export type SlotStatus = 'available' | 'booked' | 'maintenance';

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  status: SlotStatus;
  price: number;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  slotId: string;
  slotDate: string;
  slotTime: string;
  lane: number;
  status: BookingStatus;
  price: number;
  createdAt: string;
  isGuest?: boolean;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface TournamentParticipant {
  userId: string;
  name: string;
  userName: string;
  userEmail: string;
  status: 'registered' | 'waitlisted' | 'withdrawn';
  joinedAt: string;
}

export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  prizePool: string;
  entryFee: number;
  status: TournamentStatus;
  format: string;
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  createdAt: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  player1: string;
  player2: string;
  winner?: string;
  score?: string;
  scheduledAt: string;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetRole: UserRole | 'all';
  createdAt: string;
  read?: boolean;
}

export interface AppState {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUser: User | null;
}
