export type UserRole = 'member' | 'admin';
export type SubscriptionType = 'none' | 'monthly' | 'annual';
export type TournamentStatus = 'upcoming' | 'active' | 'completed';
export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscription: SubscriptionType;
  subscriptionExpiry?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  status: SlotStatus;
  bookedBy?: string;
  type: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'member' | 'outsider';
  lane: number;
  date: string;
  startTime: string;
  endTime: string;
  time: string;
  status: BookingStatus;
  type: string;
  confirmationCode: string;
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  status: TournamentStatus;
  registrationOpen: boolean;
  maxParticipants: number;
  registeredParticipants: string[];
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | UserRole;
  createdAt: string;
}
