export type UserRole = 'admin' | 'member';
export type SubscriptionType = 'yearly';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  subscriptionStatus?: 'active' | 'inactive';
  subscriptionExpiry?: string;
  joinedAt?: string;
}

export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';

export interface Slot {
  id: string;
  lane: number;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  bookedBy?: string;
}

export interface Booking {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  slotId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  lane: number;
  time?: string;
  status: 'confirmed' | 'cancelled';
  confirmationCode?: string;
  createdAt: string;
  type?: 'member' | 'outsider';
  outsiderName?: string;
  outsiderEmail?: string;
  outsiderPhone?: string;
}

export type TournamentFormat = 'single-elimination' | 'round-robin' | 'custom';
export type TournamentStatus = 'draft' | 'active' | 'completed';

export interface TournamentParticipant {
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface TournamentMatch {
  id: string;
  round: number;
  participant1Id: string;
  participant2Id: string;
  winnerId?: string;
  score?: string;
  slotId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  participants: TournamentParticipant[];
  matches?: TournamentMatch[];
  status: TournamentStatus;
  prize?: string;
  maxParticipants?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetRole?: 'all' | 'admin' | 'member';
  userId?: string;
  createdAt: string;
  read: boolean;
}

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  login: (email: string, password?: string) => User | null;
  register: (data: Partial<User> & { name: string; email: string; password: string }) => User | null;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  updateUser: (user: User) => void;
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  generateDaySlots: (date: string) => void;
  deleteSlot: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  updateSubscription: (userId: string, type: SubscriptionType) => void;
}
