export type UserRole = 'member' | 'admin';
export type SubscriptionType = 'none' | 'monthly' | 'yearly';
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
  address?: string;
  phone?: string;
  createdAt: string;
}

export interface Slot {
  id: string;
  date: string;
  time: string;
  laneNumber: number;
  lane?: number;
  startTime?: string;
  endTime?: string;
  price: number;
  duration: number;
  status: SlotStatus;
  type?: string;
}

export interface Booking {
  id: string;
  userId?: string;
  userName?: string;
  slotId: string;
  date: string;
  time: string;
  lane?: number;
  laneNumber?: number;
  startTime?: string;
  endTime?: string;
  status: BookingStatus;
  createdAt: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  description?: string;
  maxParticipants: number;
  registeredParticipants: string[];
  entryFee: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole: UserRole | 'all';
  createdAt: string;
}
