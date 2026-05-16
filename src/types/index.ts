export type UserRole = 'admin' | 'member';
export type SubscriptionType = 'none' | 'basic' | 'premium' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  joinedAt: string;
  subscription: SubscriptionType;
  subscriptionStatus: 'active' | 'expired' | 'canceled';
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  prize?: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Slot {
  id: string;
  laneId: number;
  startTime: string;
  endTime: string;
  date: string;
  isBooked: boolean;
  bookedByType?: 'member' | 'outsider' | 'tournament' | 'blocked';
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  slotId: string;
  laneId: number;
  startTime: string;
  endTime: string;
  date: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  type: 'member' | 'outsider';
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export type LoginCredentials = {
  email: string;
  password?: string;
};