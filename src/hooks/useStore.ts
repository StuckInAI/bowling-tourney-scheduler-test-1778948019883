import { useState, useCallback } from 'react';
import type { AppState, User, Slot, Booking, Tournament, AppNotification } from '@/types';
import { saveState, loadState } from '@/lib/storage';

const defaultState: AppState = {
  users: [],
  slots: [],
  bookings: [],
  tournaments: [],
  notifications: [],
  currentUser: null,
};

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState<AppState>();
    return saved ?? defaultState;
  });

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // Auth
  const login = useCallback((email: string, password: string): boolean => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (!user) return false;
    update(prev => ({ ...prev, currentUser: user }));
    return true;
  }, [state.users, update]);

  const logout = useCallback(() => {
    update(prev => ({ ...prev, currentUser: null }));
  }, [update]);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    if (state.users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'member',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    update(prev => ({ ...prev, users: [...prev.users, newUser] }));
    return true;
  }, [state.users, update]);

  // Slots
  const addSlot = useCallback((slot: Omit<Slot, 'id'>) => {
    const newSlot: Slot = { ...slot, id: `slot-${Date.now()}` };
    update(prev => ({ ...prev, slots: [...prev.slots, newSlot] }));
  }, [update]);

  const updateSlot = useCallback((id: string, updates: Partial<Slot>) => {
    update(prev => ({
      ...prev,
      slots: prev.slots.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [update]);

  const deleteSlot = useCallback((id: string) => {
    update(prev => ({ ...prev, slots: prev.slots.filter(s => s.id !== id) }));
  }, [update]);

  // Bookings
  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'bookedAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      bookedAt: new Date().toISOString().split('T')[0],
    };
    update(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
      slots: prev.slots.map(s => s.id === booking.slotId ? { ...s, status: 'booked' as const } : s),
    }));
  }, [update]);

  const cancelBooking = useCallback((id: string) => {
    update(prev => {
      const booking = prev.bookings.find(b => b.id === id);
      return {
        ...prev,
        bookings: prev.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b),
        slots: booking
          ? prev.slots.map(s => s.id === booking.slotId ? { ...s, status: 'available' as const } : s)
          : prev.slots,
      };
    });
  }, [update]);

  // Tournaments
  const addTournament = useCallback((tournament: Omit<Tournament, 'id'>) => {
    const newTournament: Tournament = { ...tournament, id: `tournament-${Date.now()}` };
    update(prev => ({ ...prev, tournaments: [...prev.tournaments, newTournament] }));
  }, [update]);

  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    update(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, [update]);

  const deleteTournament = useCallback((id: string) => {
    update(prev => ({ ...prev, tournaments: prev.tournaments.filter(t => t.id !== id) }));
  }, [update]);

  const registerForTournament = useCallback((tournamentId: string, userId: string) => {
    update(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t =>
        t.id === tournamentId && !t.registeredParticipants.includes(userId)
          ? { ...t, registeredParticipants: [...t.registeredParticipants, userId] }
          : t
      ),
    }));
  }, [update]);

  // Notifications
  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    update(prev => ({ ...prev, notifications: [...prev.notifications, newNotification] }));
  }, [update]);

  // Users
  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    update(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...updates } : u),
      currentUser: prev.currentUser?.id === id ? { ...prev.currentUser, ...updates } : prev.currentUser,
    }));
  }, [update]);

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
    addTournament,
    updateTournament,
    deleteTournament,
    registerForTournament,
    addNotification,
    updateUser,
  };
}
