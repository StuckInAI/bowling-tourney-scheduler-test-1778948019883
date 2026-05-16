export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  subscriptionExpiry?: string;
  joinedAt: string;
}

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  capacity: number;
  booked: number;
  isAvailable: boolean;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  confirmationCode?: string;
  createdAt: string;
}

export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface TournamentParticipant {
  userId: string;
  name: string;
  status: 'registered' | 'confirmed' | 'eliminated' | 'winner';
}

export interface TournamentMatch {
  id: string;
  participant1Id: string;
  participant2Id: string;
  winnerId?: string;
  scheduledAt?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: TournamentStatus;
  maxParticipants: number;
  participants: TournamentParticipant[];
  matches?: TournamentMatch[];
  format?: string;
  entryFee?: number;
  prize?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | UserRole;
  createdAt: string;
  readBy: string[];
}

export interface AppContextType {
  users: User[];
  currentUser: User | null;
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  updateUser: (id: string, updates: Partial<User>) => void;
  addSlot: (slot: Omit<Slot, 'id'>) => void;
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  deleteSlot: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id' | 'createdAt'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'readBy'>) => void;
  markNotificationRead: (notificationId: string, userId: string) => void;
  updateSubscription: (userId: string, status: 'active' | 'inactive' | 'expired', expiry?: string) => void;
}
