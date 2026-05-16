import { useState, useCallback } from 'react';
import type { AppState, User, Slot, Booking, Tournament, Notification } from '@/types';
import { loadState, saveState } from '@/lib/storage';

const initialState: AppState = {
  users: [],
  slots: [],
  bookings: [],
  tournaments: [],
  notifications: [],
  currentUser: null,
};

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    return saved ?? initialState;
  });

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  // Auth
  const login = useCallback((email: string, password: string): User | null => {
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      const next = { ...state, currentUser: user };
      persist(next);
      return user;
    }
    return null;
  }, [state, persist]);

  const logout = useCallback(() => {
    persist({ ...state, currentUser: null });
  }, [state, persist]);

  const register = useCallback((data: Omit<User, 'id' | 'createdAt' | 'role'>): User => {
    const user: User = {
      ...data,
      id: crypto.randomUUID(),
      role: 'member',
      createdAt: new Date().toISOString(),
      subscriptionTier: 'basic',
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const next = { ...state, users: [...state.users, user], currentUser: user };
    persist(next);
    return user;
  }, [state, persist]);

  // Users
  const addUser = useCallback((user: User) => {
    persist({ ...state, users: [...state.users, user] });
  }, [state, persist]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    const users = state.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    const currentUser = state.currentUser?.id === id
      ? { ...state.currentUser, ...updates }
      : state.currentUser;
    persist({ ...state, users, currentUser });
  }, [state, persist]);

  const deleteUser = useCallback((id: string) => {
    persist({ ...state, users: state.users.filter((u) => u.id !== id) });
  }, [state, persist]);

  // Slots
  const addSlot = useCallback((slot: Slot) => {
    persist({ ...state, slots: [...state.slots, slot] });
  }, [state, persist]);

  const updateSlot = useCallback((id: string, updates: Partial<Slot>) => {
    persist({
      ...state,
      slots: state.slots.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  }, [state, persist]);

  const deleteSlot = useCallback((id: string) => {
    persist({ ...state, slots: state.slots.filter((s) => s.id !== id) });
  }, [state, persist]);

  // Bookings
  const addBooking = useCallback((booking: Booking) => {
    persist({ ...state, bookings: [...state.bookings, booking] });
  }, [state, persist]);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    persist({
      ...state,
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    });
  }, [state, persist]);

  const cancelBooking = useCallback((id: string) => {
    persist({
      ...state,
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' } : b
      ),
    });
  }, [state, persist]);

  // Tournaments
  const addTournament = useCallback((tournament: Tournament) => {
    persist({ ...state, tournaments: [...state.tournaments, tournament] });
  }, [state, persist]);

  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    persist({
      ...state,
      tournaments: state.tournaments.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    });
  }, [state, persist]);

  const deleteTournament = useCallback((id: string) => {
    persist({ ...state, tournaments: state.tournaments.filter((t) => t.id !== id) });
  }, [state, persist]);

  const joinTournament = useCallback((tournamentId: string, userId: string) => {
    persist({
      ...state,
      tournaments: state.tournaments.map((t) =>
        t.id === tournamentId && !t.participants.includes(userId)
          ? { ...t, participants: [...t.participants, userId] }
          : t
      ),
    });
  }, [state, persist]);

  // Notifications
  const addNotification = useCallback((notification: Notification) => {
    persist({ ...state, notifications: [...state.notifications, notification] });
  }, [state, persist]);

  const deleteNotification = useCallback((id: string) => {
    persist({ ...state, notifications: state.notifications.filter((n) => n.id !== id) });
  }, [state, persist]);

  const initializeState = useCallback((data: Partial<AppState>) => {
    const next = { ...state, ...data };
    persist(next);
  }, [state, persist]);

  return {
    ...state,
    login,
    logout,
    register,
    addUser,
    updateUser,
    deleteUser,
    addSlot,
    updateSlot,
    deleteSlot,
    addBooking,
    updateBooking,
    cancelBooking,
    addTournament,
    updateTournament,
    deleteTournament,
    joinTournament,
    addNotification,
    deleteNotification,
    initializeState,
  };
}
