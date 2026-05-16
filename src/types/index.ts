export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscriptionTier: 'none' | 'basic' | 'premium';
  subscriptionStatus: 'active' | 'inactive';
  subscriptionExpiry?: string;
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
  slotId: string;
  userId?: string;
  userName?: string;
  outsiderName?: string;
  outsiderEmail?: string;
  outsiderPhone?: string;
  confirmationCode?: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
  date: string;
  startTime: string;
  endTime: string;
  lane: number;
}

export interface TournamentParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  name: string;
  status: 'registered' | 'checked-in' | 'eliminated' | 'winner';
  joinedAt: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  participant1Id: string;
  participant2Id: string;
  winnerId?: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledTime?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  entryFee: number;
  prize?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  recipientType: 'all' | 'members' | 'specific';
  recipientId?: string;
  createdAt: string;
  read?: boolean;
}

export interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: AppNotification[];
  addSlot: (slot: Omit<Slot, 'id' | 'bookedCount'>) => void;
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  deleteSlot: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  cancelBooking: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id' | 'createdAt' | 'participants' | 'matches'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateSubscription: (userId: string, status: 'active' | 'inactive', tier: 'none' | 'basic' | 'premium', expiry?: string) => void;
  toggleUserStatus: (id: string) => void;
}
