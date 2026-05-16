export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscriptionStatus?: 'active' | 'inactive';
}

export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';

export interface Slot {
  id: string;
  lane: number;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  time?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  participants: string[]; // Array of user IDs
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  createBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  registerForTournament: (tournamentId: string, userId: string) => void;
}