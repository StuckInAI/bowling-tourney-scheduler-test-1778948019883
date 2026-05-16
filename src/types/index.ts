export type UserRole = 'member' | 'admin';
export type SubscriptionStatus = 'active' | 'expired' | 'none';
export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';
export type BookingStatus = 'confirmed' | 'cancelled';
export type TournamentFormat = 'single-elimination' | 'round-robin' | 'custom';
export type InviteStatus = 'pending' | 'accepted' | 'declined';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry?: string;
  phone?: string;
  joinedAt: string;
};

export type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
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
  userPhone?: string;
  date: string;
  time: string;
  lane: number;
  status: BookingStatus;
  confirmationCode: string;
  createdAt: string;
  notes?: string;
};

export type Participant = {
  userId: string;
  status: InviteStatus;
};

export type Tournament = {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  startDate: string;
  endDate: string;
  participants: Participant[];
  status: 'draft' | 'active' | 'completed';
  prize?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  targetUserId?: string;
  targetRole: 'all' | UserRole;
  createdAt: string;
  read: boolean;
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
  updateSlot: (id: string, updates: Partial<Slot>) => void;
  generateDaySlots: (date: string) => void;
  deleteSlot: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  handleInvite: (tournamentId: string, userId: string, status: InviteStatus) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
};