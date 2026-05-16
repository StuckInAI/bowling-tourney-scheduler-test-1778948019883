import { useState, useCallback } from 'react';
import type { AppState, AppContextType, User, Slot, Booking, Tournament, Notification } from '@/types';
import { loadState, saveState } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export function useStore(): AppContextType {
  const [state, setState] = useState<AppState>(() => loadState());

  const persist = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const login = useCallback((email: string, password: string): User | null => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    persist(prev => ({ ...prev, currentUser: user }));
    return user;
  }, [state.users, persist]);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    if (state.users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password,
      role: 'member',
      subscriptionTier: 'none',
      createdAt: new Date().toISOString(),
    };
    persist(prev => ({ ...prev, users: [...prev.users, newUser], currentUser: newUser }));
    return true;
  }, [state.users, persist]);

  const logout = useCallback(() => {
    persist(prev => ({ ...prev, currentUser: null }));
  }, [persist]);

  const addSlot = useCallback((slot: Omit<Slot, 'id'>) => {
    const newSlot: Slot = { ...slot, id: generateId() };
    persist(prev => ({ ...prev, slots: [...prev.slots, newSlot] }));
  }, [persist]);

  const updateSlot = useCallback((id: string, updates: Partial<Slot>) => {
    persist(prev => ({
      ...prev,
      slots: prev.slots.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [persist]);

  const deleteSlot = useCallback((id: string) => {
    persist(prev => ({ ...prev, slots: prev.slots.filter(s => s.id !== id) }));
  }, [persist]);

  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    persist(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
      slots: prev.slots.map(s =>
        s.id === booking.slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s
      ),
    }));
  }, [persist]);

  const cancelBooking = useCallback((id: string) => {
    persist(prev => {
      const booking = prev.bookings.find(b => b.id === id);
      return {
        ...prev,
        bookings: prev.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b),
        slots: booking
          ? prev.slots.map(s => s.id === booking.slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s)
          : prev.slots,
      };
    });
  }, [persist]);

  const addTournament = useCallback((tournament: Omit<Tournament, 'id' | 'createdAt'>) => {
    const newTournament: Tournament = {
      ...tournament,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    persist(prev => ({ ...prev, tournaments: [...prev.tournaments, newTournament] }));
  }, [persist]);

  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    persist(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, [persist]);

  const deleteTournament = useCallback((id: string) => {
    persist(prev => ({ ...prev, tournaments: prev.tournaments.filter(t => t.id !== id) }));
  }, [persist]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    persist(prev => ({ ...prev, notifications: [...prev.notifications, newNotification] }));
  }, [persist]);

  const markNotificationRead = useCallback((id: string) => {
    persist(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }, [persist]);

  return {
    ...state,
    login,
    register,
    logout,
    addSlot,
    updateSlot,
    deleteSlot,
    addBooking,
    cancelBooking,
    addTournament,
    updateTournament,
    deleteTournament,
    addNotification,
    markNotificationRead,
  };
}
