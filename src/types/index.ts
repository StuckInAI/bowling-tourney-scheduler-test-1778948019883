export type UserRole = 'member' | 'admin';
export type SubscriptionType = 'none' | 'basic' | 'premium' | 'vip';
export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';
export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscription: SubscriptionType;
  phone?: string;
  joinedAt: string;
};

export type Slot = {
  id: string;
  date: string;
  time: string;
  lane: number;
  status: SlotStatus;
  bookedBy?: string;
  notes?: string;
};

export type Booking = {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  lane: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  bookedBy?: string;
};

export type Tournament = {
  id: string;
  name: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  registeredUserIds: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  prize?: string;
  entryFee?: number;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  targetRole: 'all' | UserRole;
  createdAt: string;
  read?: boolean;
};

export type AppContextType = {
  currentUser: User | null;
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  updateUser: (user: User) => void;
  updateSlot: (slot: Partial<Slot> & { id: string }) => void;
  addSlot: (slot: Omit<Slot, 'id'>) => void;
  deleteSlot: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (booking: Partial<Booking> & { id: string }) => void;
  cancelBooking: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  updateTournament: (tournament: Partial<Tournament> & { id: string }) => void;
  deleteTournament: (id: string) => void;
  registerForTournament: (tournamentId: string, userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  deleteNotification: (id: string) => void;
};
