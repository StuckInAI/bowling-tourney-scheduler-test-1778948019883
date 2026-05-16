import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { loadState, saveState } from '@/lib/storage';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';

type AppState = {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUserId: string | null;
  seeded?: boolean;
};

type AppContextType = {
  currentUser: User | null;
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  updateSlot: (slot: Slot) => void;
  addSlot: (slot: Slot) => void;
  deleteSlot: (slotId: string) => void;
  addTournament: (tournament: Tournament) => void;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (tournamentId: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string, userId: string) => void;
  updateUser: (user: User) => void;
};

const AppContext = createContext<AppContextType | null>(null);

function getInitialState(): AppState {
  return loadState() || {
    users: [],
    slots: [],
    bookings: [],
    tournaments: [],
    notifications: [],
    currentUserId: null,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState);
  }, []);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) ?? null;

  const login = useCallback((email: string, password: string) => {
    const user = state.users.find((u) => u.email === email && u.password === password);
    if (!user) return false;
    persist({ ...state, currentUserId: user.id });
    return true;
  }, [state, persist]);

  const logout = useCallback(() => {
    persist({ ...state, currentUserId: null });
  }, [state, persist]);

  const register = useCallback((name: string, email: string, password: string) => {
    if (state.users.find((u) => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'member',
      subscription: 'basic',
      subscriptionTier: 'basic',
      joinedAt: new Date().toISOString(),
    };
    persist({ ...state, users: [...state.users, newUser] });
    return true;
  }, [state, persist]);

  const addBooking = useCallback((booking: Booking) => {
    const updatedSlots = state.slots.map((s) =>
      s.id === booking.slotId
        ? { ...s, status: (booking.userType === 'member' ? 'booked_member' : 'booked_outsider') as Slot['status'], bookingId: booking.id }
        : s
    );
    persist({ ...state, bookings: [...state.bookings, booking], slots: updatedSlots });
  }, [state, persist]);

  const cancelBooking = useCallback((bookingId: string) => {
    const booking = state.bookings.find((b) => b.id === bookingId);
    const updatedBookings = state.bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    );
    const updatedSlots = booking
      ? state.slots.map((s) => s.id === booking.slotId ? { ...s, status: 'available' as const, bookingId: undefined } : s)
      : state.slots;
    persist({ ...state, bookings: updatedBookings, slots: updatedSlots });
  }, [state, persist]);

  const updateSlot = useCallback((slot: Slot) => {
    persist({ ...state, slots: state.slots.map((s) => s.id === slot.id ? slot : s) });
  }, [state, persist]);

  const addSlot = useCallback((slot: Slot) => {
    persist({ ...state, slots: [...state.slots, slot] });
  }, [state, persist]);

  const deleteSlot = useCallback((slotId: string) => {
    persist({ ...state, slots: state.slots.filter((s) => s.id !== slotId) });
  }, [state, persist]);

  const addTournament = useCallback((tournament: Tournament) => {
    persist({ ...state, tournaments: [...state.tournaments, tournament] });
  }, [state, persist]);

  const updateTournament = useCallback((tournament: Tournament) => {
    persist({ ...state, tournaments: state.tournaments.map((t) => t.id === tournament.id ? tournament : t) });
  }, [state, persist]);

  const deleteTournament = useCallback((tournamentId: string) => {
    persist({ ...state, tournaments: state.tournaments.filter((t) => t.id !== tournamentId) });
  }, [state, persist]);

  const addNotification = useCallback((notification: Notification) => {
    persist({ ...state, notifications: [...state.notifications, notification] });
  }, [state, persist]);

  const markNotificationRead = useCallback((notificationId: string, userId: string) => {
    persist({
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === notificationId && !n.readBy.includes(userId)
          ? { ...n, readBy: [...n.readBy, userId] }
          : n
      ),
    });
  }, [state, persist]);

  const updateUser = useCallback((user: User) => {
    persist({ ...state, users: state.users.map((u) => u.id === user.id ? user : u) });
  }, [state, persist]);

  return (
    <AppContext.Provider value={{
      currentUser, users: state.users, slots: state.slots, bookings: state.bookings,
      tournaments: state.tournaments, notifications: state.notifications,
      login, logout, register, addBooking, cancelBooking,
      updateSlot, addSlot, deleteSlot, addTournament, updateTournament, deleteTournament,
      addNotification, markNotificationRead, updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
