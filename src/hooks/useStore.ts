import { useState, useCallback } from 'react';
import type { User, Slot, Booking, Tournament, Notification, AppContextType } from '@/types';
import { loadState, saveState } from '@/lib/storage';

export function useStore(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', null));
  const [users, setUsers] = useState<User[]>(() => loadState('users', []));
  const [slots, setSlots] = useState<Slot[]>(() => loadState('slots', []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('bookings', []));
  const [tournaments, setTournaments] = useState<Tournament[]>(() => loadState('tournaments', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('notifications', []));

  const persist = useCallback(<T>(key: string, value: T) => {
    saveState(key, value);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const allUsers: User[] = loadState('users', []);
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      saveState('currentUser', found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    saveState('currentUser', null);
  }, []);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    const allUsers: User[] = loadState('users', []);
    if (allUsers.find(u => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'member',
      subscription: 'none',
      joinedAt: new Date().toISOString(),
    };
    const updated = [...allUsers, newUser];
    setUsers(updated);
    saveState('users', updated);
    setCurrentUser(newUser);
    saveState('currentUser', newUser);
    return true;
  }, []);

  const updateUser = useCallback((user: User) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === user.id ? user : u);
      persist('users', updated);
      return updated;
    });
    setCurrentUser(prev => {
      if (prev?.id === user.id) {
        persist('currentUser', user);
        return user;
      }
      return prev;
    });
  }, [persist]);

  const updateSlot = useCallback((slot: Partial<Slot> & { id: string }) => {
    setSlots(prev => {
      const updated = prev.map(s => s.id === slot.id ? { ...s, ...slot } : s);
      persist('slots', updated);
      return updated;
    });
  }, [persist]);

  const addSlot = useCallback((slot: Omit<Slot, 'id'>) => {
    const newSlot: Slot = { ...slot, id: crypto.randomUUID() };
    setSlots(prev => {
      const updated = [...prev, newSlot];
      persist('slots', updated);
      return updated;
    });
  }, [persist]);

  const deleteSlot = useCallback((id: string) => {
    setSlots(prev => {
      const updated = prev.filter(s => s.id !== id);
      persist('slots', updated);
      return updated;
    });
  }, [persist]);

  const addBooking = useCallback((booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = { ...booking, id: crypto.randomUUID() };
    setBookings(prev => {
      const updated = [...prev, newBooking];
      persist('bookings', updated);
      return updated;
    });
  }, [persist]);

  const updateBooking = useCallback((booking: Partial<Booking> & { id: string }) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === booking.id ? { ...b, ...booking } : b);
      persist('bookings', updated);
      return updated;
    });
  }, [persist]);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      persist('bookings', updated);
      return updated;
    });
  }, [persist]);

  const addTournament = useCallback((tournament: Omit<Tournament, 'id'>) => {
    const newT: Tournament = { ...tournament, id: crypto.randomUUID() };
    setTournaments(prev => {
      const updated = [...prev, newT];
      persist('tournaments', updated);
      return updated;
    });
  }, [persist]);

  const updateTournament = useCallback((tournament: Partial<Tournament> & { id: string }) => {
    setTournaments(prev => {
      const updated = prev.map(t => t.id === tournament.id ? { ...t, ...tournament } : t);
      persist('tournaments', updated);
      return updated;
    });
  }, [persist]);

  const deleteTournament = useCallback((id: string) => {
    setTournaments(prev => {
      const updated = prev.filter(t => t.id !== id);
      persist('tournaments', updated);
      return updated;
    });
  }, [persist]);

  const registerForTournament = useCallback((tournamentId: string, userId: string) => {
    setTournaments(prev => {
      const updated = prev.map(t => {
        if (t.id === tournamentId && !t.registeredUserIds.includes(userId)) {
          return {
            ...t,
            registeredUserIds: [...t.registeredUserIds, userId],
            currentParticipants: t.currentParticipants + 1,
          };
        }
        return t;
      });
      persist('tournaments', updated);
      return updated;
    });
  }, [persist]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newN: Notification = { ...notification, id: crypto.randomUUID() };
    setNotifications(prev => {
      const updated = [...prev, newN];
      persist('notifications', updated);
      return updated;
    });
  }, [persist]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      persist('notifications', updated);
      return updated;
    });
  }, [persist]);

  return {
    currentUser,
    users,
    slots,
    bookings,
    tournaments,
    notifications,
    login,
    logout,
    register,
    updateUser,
    updateSlot,
    addSlot,
    deleteSlot,
    addBooking,
    updateBooking,
    cancelBooking,
    addTournament,
    updateTournament,
    deleteTournament,
    registerForTournament,
    addNotification,
    deleteNotification,
  };
}
