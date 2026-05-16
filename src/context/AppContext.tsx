import { createContext, useContext, type ReactNode } from 'react';
import { useStore } from '@/hooks/useStore';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';

type AppContextType = {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Users
  users: User[];
  updateUser: (updatedUser: Partial<User> & { id: string }) => void;

  // Slots
  slots: Slot[];
  addSlot: (slot: Slot) => void;
  updateSlot: (updatedSlot: Partial<Slot> & { id: string }) => void;
  deleteSlot: (id: string) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;

  // Tournaments
  tournaments: Tournament[];
  addTournament: (tournament: Tournament) => void;
  updateTournament: (updatedTournament: Partial<Tournament> & { id: string }) => void;
  deleteTournament: (id: string) => void;
  registerForTournament: (tournamentId: string, userId: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
