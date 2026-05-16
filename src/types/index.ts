export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscriptionTier: 'none' | 'basic' | 'premium';
  createdAt: string;
}

export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
  capacity: number;
  bookedCount: number;
  status: 'available' | 'full' | 'closed';
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
  createdAt: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export type TournamentStatus = 'upcoming' | 'active' | 'completed' | 'draft' | 'cancelled';

export interface TournamentParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  status: 'confirmed' | 'registered' | 'eliminated' | 'winner';
  joinedAt: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  score?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  format: string;
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string | 'all';
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AppState {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUser: User | null;
}

export interface AppContextType extends AppState {
  login: (email: string, password: string) => User | null;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addSlot: (slot: Omit<Slot, 'id'>) => void;
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  deleteSlot: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id' | 'createdAt'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
}
