import { useState, useCallback } from 'react';
import { loadState, saveState } from '@/lib/storage';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';

interface AppState {
  users: User[];
  slots: Slot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
  currentUser: User | null;
}

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

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // ── Users ──────────────────────────────────────────────────────────────────
  const addUser = useCallback((user: User) => {
    updateState(s => ({ ...s, users: [...s.users, user] }));
  }, [updateState]);

  const updateUser = useCallback((user: User) => {
    updateState(s => ({ ...s, users: s.users.map(u => u.id === user.id ? user : u) }));
  }, [updateState]);

  const deleteUser = useCallback((id: string) => {
    updateState(s => ({ ...s, users: s.users.filter(u => u.id !== id) }));
  }, [updateState]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = useCallback((email: string, password: string): User | null => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      updateState(s => ({ ...s, currentUser: user }));
      return user;
    }
    return null;
  }, [state.users, updateState]);

  const logout = useCallback(() => {
    updateState(s => ({ ...s, currentUser: null }));
  }, [updateState]);

  const register = useCallback((userData: Omit<User, 'id' | 'joinedAt'>): User => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      joinedAt: new Date().toISOString(),
    };
    updateState(s => ({ ...s, users: [...s.users, newUser] }));
    updateState(s => ({ ...s, currentUser: newUser }));
    return newUser;
  }, [updateState]);

  // ── Slots ──────────────────────────────────────────────────────────────────
  const addSlots = useCallback((newSlots: Slot[]) => {
    updateState(s => {
      const slots = s.slots;
      const toAdd = newSlots.filter(ns => !slots.find(s => s.id === ns.id && (s.status === 'booked_member' || s.status === 'booked_outsider' || s.status === 'tournament')));
      return { ...s, slots: [...slots.filter(s => !toAdd.find(ns => ns.id === s.id)), ...toAdd] };
    });
  }, [updateState]);

  const updateSlot = useCallback((slot: Slot) => {
    updateState(s => ({ ...s, slots: s.slots.map(sl => sl.id === slot.id ? slot : sl) }));
  }, [updateState]);

  const deleteSlot = useCallback((id: string) => {
    updateState(s => ({ ...s, slots: s.slots.filter(sl => sl.id !== id) }));
  }, [updateState]);

  // ── Bookings ───────────────────────────────────────────────────────────────
  const addBooking = useCallback((booking: Booking) => {
    updateState(s => ({ ...s, bookings: [...s.bookings, booking] }));
  }, [updateState]);

  const updateBooking = useCallback((booking: Booking) => {
    updateState(s => ({ ...s, bookings: s.bookings.map(b => b.id === booking.id ? booking : b) }));
  }, [updateState]);

  const cancelBooking = useCallback((id: string) => {
    updateState(s => ({
      ...s,
      bookings: s.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b),
    }));
  }, [updateState]);

  // ── Tournaments ────────────────────────────────────────────────────────────
  const addTournament = useCallback((tournament: Tournament) => {
    updateState(s => ({ ...s, tournaments: [...s.tournaments, tournament] }));
  }, [updateState]);

  const updateTournament = useCallback((tournament: Tournament) => {
    updateState(s => ({ ...s, tournaments: s.tournaments.map(t => t.id === tournament.id ? tournament : t) }));
  }, [updateState]);

  const deleteTournament = useCallback((id: string) => {
    updateState(s => ({ ...s, tournaments: s.tournaments.filter(t => t.id !== id) }));
  }, [updateState]);

  // ── Notifications ──────────────────────────────────────────────────────────
  const addNotification = useCallback((notification: Notification) => {
    updateState(s => ({ ...s, notifications: [...s.notifications, notification] }));
  }, [updateState]);

  const deleteNotification = useCallback((id: string) => {
    updateState(s => ({ ...s, notifications: s.notifications.filter(n => n.id !== id) }));
  }, [updateState]);

  const markNotificationRead = useCallback((id: string) => {
    updateState(s => ({
      ...s,
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }, [updateState]);

  // ── Seed ───────────────────────────────────────────────────────────────────
  const seedData = useCallback((data: Partial<AppState>) => {
    updateState(s => ({ ...s, ...data }));
  }, [updateState]);

  return {
    ...state,
    addUser,
    updateUser,
    deleteUser,
    login,
    logout,
    register,
    addSlots,
    updateSlot,
    deleteSlot,
    addBooking,
    updateBooking,
    cancelBooking,
    addTournament,
    updateTournament,
    deleteTournament,
    addNotification,
    deleteNotification,
    markNotificationRead,
    seedData,
  };
}
