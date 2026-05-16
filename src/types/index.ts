export type UserRole = 'member' | 'admin';
export type SubscriptionType = 'none' | 'basic' | 'premium' | 'vip';
export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscription: SubscriptionType;
  subscriptionTier: SubscriptionType;
  joinedAt: string;
  phone?: string;
}

export interface Slot {
  id: string;
  date: string;
  time: string;
  laneNumber: number;
  status: SlotStatus;
  bookedBy?: string;
  bookedByName?: string;
  bookingType?: 'member' | 'outsider';
  tournamentId?: string;
  price: number;
  duration: number;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  date: string;
  time: string;
  laneNumber: number;
  status: BookingStatus;
  createdAt: string;
  price: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  registeredUserIds: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  prize?: string;
  entryFee?: number;
  requiredSubscription?: SubscriptionType;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole: UserRole | 'all';
  createdAt: string;
  read?: boolean;
}
