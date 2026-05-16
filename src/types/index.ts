export type UserRole = 'member' | 'admin';
export type SubscriptionType = 'basic' | 'premium' | 'vip';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscription: SubscriptionType;
  subscriptionTier: SubscriptionType;
  joinedAt: string;
};

export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'tournament' | 'blocked';

export type Slot = {
  id: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  lane: number;
  status: SlotStatus;
  bookingId?: string;
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
  time: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled';
  type: string;
  confirmationCode: string;
  createdAt: string;
  entryFee?: number;
};

export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export type Tournament = {
  id: string;
  name: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prize: string;
  lanes: number[];
  registeredUserIds: string[];
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | UserRole;
  createdAt: string;
  readBy: string[];
};
