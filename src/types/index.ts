export type UserRole = 'member' | 'admin';

export type SubscriptionTier = 'basic' | 'premium' | 'vip';

export type SubscriptionStatus = 'active' | 'inactive' | 'expired';

export type TournamentStatus = 'open' | 'closed' | 'completed';

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiry?: string;
  createdAt: string;
  phone?: string;
  address?: string;
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
  userType: 'member' | 'outsider';
  lane: number;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  type: string;
  confirmationCode: string;
  createdAt: string;
};

export type Tournament = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  maxParticipants: number;
  participants: string[];
  prize?: string;
  entryFee?: number;
  createdAt: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  targetRole?: UserRole;
  targetUserId?: string;
  createdAt: string;
  read?: boolean;
};

export type AppState = {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUser: User | null;
};
