import { createContext, useContext } from 'react';
import { useStore } from '@/hooks/useStore';
import type { AppState, User, Booking, Slot, Tournament, Notification } from '@/types';

type AppContextType = {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  // Derived data
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  // Actions
  addBooking: (booking: Booking) => void;
  updateSlot: (slotId: string, updates: Partial<Slot>) => void;
  cancelBooking: (bookingId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  joinTournament: (tournamentId: string, userId: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();

  const slots = store.state.slots ?? [];
  const bookings = store.state.bookings ?? [];
  const tournaments = store.state.tournaments ?? [];
  const notifications = store.state.notifications ?? [];

  const addBooking = (booking: Booking) => {
    store.updateState((prev) => ({
      ...prev,
      bookings: [...(prev.bookings ?? []), booking],
    }));
  };

  const updateSlot = (slotId: string, updates: Partial<Slot>) => {
    store.updateState((prev) => ({
      ...prev,
      slots: (prev.slots ?? []).map((s) => (s.id === slotId ? { ...s, ...updates } : s)),
    }));
  };

  const cancelBooking = (bookingId: string) => {
    store.updateState((prev) => ({
      ...prev,
      bookings: (prev.bookings ?? []).map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ),
    }));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    store.updateState((prev) => ({
      ...prev,
      users: (prev.users ?? []).map((u) => (u.id === userId ? { ...u, ...updates } : u)),
      currentUser: prev.currentUser?.id === userId ? { ...prev.currentUser, ...updates } : prev.currentUser,
    }));
  };

  const joinTournament = (tournamentId: string, userId: string) => {
    store.updateState((prev) => ({
      ...prev,
      tournaments: (prev.tournaments ?? []).map((t) =>
        t.id === tournamentId
          ? { ...t, participants: [...(t.participants ?? []), userId] }
          : t
      ),
    }));
  };

  const value: AppContextType = {
    ...store,
    currentUser: store.currentUser ?? null,
    slots,
    bookings,
    tournaments,
    notifications,
    addBooking,
    updateSlot,
    cancelBooking,
    updateUser,
    joinTournament,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
