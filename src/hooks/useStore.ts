import { useState, useCallback } from 'react';
import type { AppState, User, Slot, Booking, Tournament, Notification, TournamentParticipant } from '@/types';
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
  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    const s = loadState() ?? initialState;
    const user = s.users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    const next = { ...s, currentUser: user };
    persist(next);
    return user;
  }, [persist]);

  const logout = useCallback(() => {
    const s = loadState() ?? initialState;
    persist({ ...s, currentUser: null });
  }, [persist]);

  const register = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'role'>): Promise<User | null> => {
    const s = loadState() ?? initialState;
    if (s.users.find(u => u.email === data.email)) return null;
    const user: User = {
      ...data,
      id: crypto.randomUUID(),
      role: 'member',
      createdAt: new Date().toISOString(),
    };
    persist({ ...s, users: [...s.users, user], currentUser: user });
    return user;
  }, [persist]);

  // Slots
  const addSlot = useCallback((slot: Omit<Slot, 'id' | 'createdAt'>) => {
    const s = loadState() ?? initialState;
    const newSlot: Slot = { ...slot, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    persist({ ...s, slots: [...s.slots, newSlot] });
  }, [persist]);

  const updateSlot = useCallback((id: string, patch: Partial<Slot>) => {
    const s = loadState() ?? initialState;
    persist({ ...s, slots: s.slots.map(sl => sl.id === id ? { ...sl, ...patch } : sl) });
  }, [persist]);

  const deleteSlot = useCallback((id: string) => {
    const s = loadState() ?? initialState;
    persist({ ...s, slots: s.slots.filter(sl => sl.id !== id) });
  }, [persist]);

  // Bookings
  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const s = loadState() ?? initialState;
    const newBooking: Booking = { ...booking, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const slots = s.slots.map(sl => sl.id === booking.slotId ? { ...sl, status: 'booked' as const } : sl);
    persist({ ...s, bookings: [...s.bookings, newBooking], slots });
  }, [persist]);

  const cancelBooking = useCallback((id: string) => {
    const s = loadState() ?? initialState;
    const booking = s.bookings.find(b => b.id === id);
    const slots = booking
      ? s.slots.map(sl => sl.id === booking.slotId ? { ...sl, status: 'available' as const } : sl)
      : s.slots;
    const bookings = s.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    persist({ ...s, bookings, slots });
  }, [persist]);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    const s = loadState() ?? initialState;
    persist({ ...s, bookings: s.bookings.map(b => b.id === id ? { ...b, status } : b) });
  }, [persist]);

  // Tournaments
  const addTournament = useCallback((tournament: Omit<Tournament, 'id' | 'createdAt' | 'participants' | 'matches'>) => {
    const s = loadState() ?? initialState;
    const newT: Tournament = {
      ...tournament,
      id: crypto.randomUUID(),
      participants: [],
      matches: [],
      createdAt: new Date().toISOString(),
    };
    persist({ ...s, tournaments: [...s.tournaments, newT] });
  }, [persist]);

  const updateTournament = useCallback((id: string, patch: Partial<Tournament>) => {
    const s = loadState() ?? initialState;
    persist({ ...s, tournaments: s.tournaments.map(t => t.id === id ? { ...t, ...patch } : t) });
  }, [persist]);

  const deleteTournament = useCallback((id: string) => {
    const s = loadState() ?? initialState;
    persist({ ...s, tournaments: s.tournaments.filter(t => t.id !== id) });
  }, [persist]);

  const joinTournament = useCallback((tournamentId: string, participant: TournamentParticipant) => {
    const s = loadState() ?? initialState;
    persist({
      ...s,
      tournaments: s.tournaments.map(t =>
        t.id === tournamentId
          ? { ...t, participants: [...t.participants, participant] }
          : t
      ),
    });
  }, [persist]);

  // Notifications
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const s = loadState() ?? initialState;
    const newN: Notification = { ...notification, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    persist({ ...s, notifications: [...s.notifications, newN] });
  }, [persist]);

  const deleteNotification = useCallback((id: string) => {
    const s = loadState() ?? initialState;
    persist({ ...s, notifications: s.notifications.filter(n => n.id !== id) });
  }, [persist]);

  // Users
  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    const s = loadState() ?? initialState;
    const users = s.users.map(u => u.id === id ? { ...u, ...patch } : u);
    const currentUser = s.currentUser?.id === id ? { ...s.currentUser, ...patch } : s.currentUser;
    persist({ ...s, users, currentUser });
  }, [persist]);

  const deleteUser = useCallback((id: string) => {
    const s = loadState() ?? initialState;
    persist({ ...s, users: s.users.filter(u => u.id !== id) });
  }, [persist]);

  return {
    ...state,
    login,
    logout,
    register,
    addSlot,
    updateSlot,
    deleteSlot,
    addBooking,
    cancelBooking,
    updateBookingStatus,
    addTournament,
    updateTournament,
    deleteTournament,
    joinTournament,
    addNotification,
    deleteNotification,
    updateUser,
    deleteUser,
  };
}
