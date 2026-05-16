export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  membershipType?: 'basic' | 'premium' | 'vip';
  memberSince?: string;
  subscriptionExpiry?: string;
}

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  laneNumber: number;
  capacity: number;
  bookedCount: number;
  price: number;
  status: 'available' | 'full' | 'closed';
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  laneNumber: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  players: number;
  totalPrice: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  registeredParticipants: string[];
  entryFee: number;
  prize: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'members' | 'admin';
  createdAt: string;
  read: boolean;
}

export interface StoreState {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUser: User | null;
}
