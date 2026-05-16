export type UserRole = 'admin' | 'member';
export type SubscriptionType = 'none' | 'basic' | 'premium';
export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscription: SubscriptionType;
  joinedAt: string;
  phone?: string;
}

export interface Slot {
  id: string;
  date: string;
  time: string;
  lane: number;
  status: SlotStatus;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  date: string;
  time: string;
  lane: number;
  status: BookingStatus;
  type: 'member' | 'outsider';
  name?: string;
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  description: string;
  maxParticipants: number;
  participants: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  prize?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  targetRole: 'all' | 'member' | 'admin';
}

export interface AppState {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUser?: User;
}
