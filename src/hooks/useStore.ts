import { useState, useCallback, useEffect } from 'react';
import type { User, Slot, Booking, Tournament, Notification, AppContextType, InviteStatus } from '@/types';
import { loadState, saveState } from '@/lib/storage';

export function useStore(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', null));
  const [users, setUsers] = useState<User[]>(() => loadState('users', []));
  const [slots, setSlots] = useState<Slot[]>(() => loadState('slots', []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('bookings', []));
  const [tournaments, setTournaments] = useState<Tournament[]>(() => loadState('tournaments', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('notifications', []));

  useEffect(() => {
    saveState('currentUser', currentUser);
    saveState('users', users);
    saveState('slots', slots);
    saveState('bookings', bookings);
    saveState('tournaments', tournaments);
    saveState('notifications', notifications);
  }, [currentUser, users, slots, bookings, tournaments, notifications]);

  const login = useCallback((email: string, password: string): boolean => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name, email, password,
      role: 'member',
      subscriptionStatus: 'none',
      joinedAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  }, [users]);

  const updateUser = useCallback((user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentUser?.id === user.id) setCurrentUser(user);
  }, [currentUser]);

  const updateSlot = useCallback((id: string, updates: Partial<Slot>) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const generateDaySlots = useCallback((date: string) => {
    const newSlots: Slot[] = [];
    for (let h = 9; h < 22; h++) {
      const startTime = `${h.toString().padStart(2, '0')}:00`;
      const endTime = `${(h + 1).toString().padStart(2, '0')}:00`;
      for (let lane = 1; lane <= 16; lane++) {
        newSlots.push({
          id: `slot-${date}-${lane}-${h}`,
          date, startTime, endTime, lane,
          status: 'available',
        });
      }
    }
    setSlots(prev => {
      const filtered = prev.filter(s => s.date !== date);
      return [...filtered, ...newSlots];
    });
  }, []);

  const deleteSlot = useCallback((id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  }, []);

  const addBooking = useCallback((booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = { ...booking, id: crypto.randomUUID() };
    setBookings(prev => [...prev, newBooking]);
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => {
      const booking = prev.find(b => b.id === id);
      if (booking) {
        setSlots(slotsPrev => slotsPrev.map(s => s.id === booking.slotId ? { ...s, status: 'available' } : s));
      }
      return prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    });
  }, []);

  const addTournament = useCallback((tournament: Omit<Tournament, 'id'>) => {
    setTournaments(prev => [...prev, { ...tournament, id: crypto.randomUUID() }]);
  }, []);

  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTournament = useCallback((id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleInvite = useCallback((tournamentId: string, userId: string, status: InviteStatus) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          participants: t.participants.map(p => p.userId === userId ? { ...p, status } : p)
        };
      }
      return t;
    }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    setNotifications(prev => [...prev, { ...notification, id: crypto.randomUUID(), read: false }]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return {
    currentUser, users, slots, bookings, tournaments, notifications,
    login, logout, register, updateUser, updateSlot, generateDaySlots, deleteSlot,
    addBooking, cancelBooking, addTournament, updateTournament, deleteTournament, handleInvite,
    addNotification, markNotificationRead
  };
}