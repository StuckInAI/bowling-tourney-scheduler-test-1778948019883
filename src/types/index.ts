export type UserRole = 'admin' | 'member';

export type SubscriptionType = 'none' | 'basic' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscription: SubscriptionType;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  lane: number;
  laneNumber?: number;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  status: BookingStatus;
  isGuest?: boolean;
}

export type TournamentStatus = 'upcoming' | 'active' | 'draft' | 'completed';

export interface Participant {
  userId: string;
  name: string;
  registeredAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: TournamentStatus;
  maxParticipants: number;
  participants: Participant[];
  currentParticipants: number;
  registeredUserIds: string[];
}

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (user: User) => void;
  registerForTournament: (tournamentId: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (bookingId: string) => void;
}