export type UserRole = 'admin' | 'member';

export type SlotStatus = 'available' | 'booked' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  membershipType?: 'basic' | 'premium' | 'vip';
  membershipExpiry?: string;
  phone?: string;
  joinedAt: string;
}

export interface Slot {
  id: string;
  lane: number;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  guestName?: string;
  guestEmail?: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  registeredParticipants: string[];
  entryFee: number;
  prize: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  recipientType: 'all' | 'members' | 'specific';
  recipientId?: string;
}

export interface AppState {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: AppNotification[];
  currentUser: User | null;
}

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: AppNotification[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  addSlot: (slot: Omit<Slot, 'id'>) => void;
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  deleteSlot: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'bookedAt'>) => void;
  cancelBooking: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  registerForTournament: (tournamentId: string, userId: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
}
