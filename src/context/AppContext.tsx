import { createContext, useContext, type ReactNode } from 'react';
import { useStore } from '@/hooks/useStore';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';

type AppContextType = {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (name: string, email: string, password: string) => User | null;
  updateUser: (user: User) => void;

  // Slots
  slots: Slot[];
  addSlot: (slot: Omit<Slot, 'id'>) => void;
  updateSlot: (slot: Slot) => void;
  deleteSlot: (id: string) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;

  // Tournaments
  tournaments: Tournament[];
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (id: string) => void;
  registerForTournament: (tournamentId: string, userId: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  deleteNotification: (id: string) => void;

  // Users (admin)
  users: User[];
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
