import { useState, useEffect } from 'react';
import type { User, Slot, Booking, Tournament, Notification, AppContextType, SubscriptionType } from '@/types';

function storageGet<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

function storageSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export function useStore(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(storageGet<User>('currentUser'));
  const [users, setUsers] = useState<User[]>(storageGet<User[]>('users') || []);
  const [slots, setSlots] = useState<Slot[]>(storageGet<Slot[]>('slots') || []);
  const [bookings, setBookings] = useState<Booking[]>(storageGet<Booking[]>('bookings') || []);
  const [tournaments, setTournaments] = useState<Tournament[]>(storageGet<Tournament[]>('tournaments') || []);
  const [notifications, setNotifications] = useState<Notification[]>(storageGet<Notification[]>('notifications') || []);

  useEffect(() => { storageSet('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { storageSet('users', users); }, [users]);
  useEffect(() => { storageSet('slots', slots); }, [slots]);
  useEffect(() => { storageSet('bookings', bookings); }, [bookings]);
  useEffect(() => { storageSet('tournaments', tournaments); }, [tournaments]);
  useEffect(() => { storageSet('notifications', notifications); }, [notifications]);

  const login = (email: string, password?: string): User | null => {
    const user = users.find(u => u.email === email && (!password || u.password === password));
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const register = (data: Partial<User> & { name: string; email: string; password: string }): User | null => {
    if (users.find(u => u.email === data.email)) return null;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'member',
      subscriptionStatus: 'inactive',
      joinedAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => setCurrentUser(null);

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = { ...booking, id: `booking-${Date.now()}` };
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    // Also free up the slot
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setSlots(prev => prev.map(s => s.id === booking.slotId ? { ...s, status: 'available', bookedBy: undefined } : s));
    }
  };

  const updateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentUser?.id === user.id) setCurrentUser(user);
  };

  const updateSlot = (id: string, updates: Partial<Slot>) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const generateDaySlots = (date: string) => {
    const newSlots: Slot[] = [];
    for (let h = 9; h < 22; h++) {
      const startTime = `${h.toString().padStart(2, '0')}:00`;
      const endTime = `${(h + 1).toString().padStart(2, '0')}:00`;
      for (let lane = 1; lane <= 16; lane++) {
        newSlots.push({
          id: `slot-${date}-${lane}-${h}`,
          date,
          startTime,
          endTime,
          lane,
          status: 'available',
        });
      }
    }
    // Remove old available/blocked slots for that date, keep booked ones
    setSlots(prev => [
      ...prev.filter(s => s.date !== date || s.status === 'booked_member' || s.status === 'booked_outsider' || s.status === 'tournament'),
      ...newSlots.filter(ns => !slots.find(s => s.id === ns.id && (s.status === 'booked_member' || s.status === 'booked_outsider' || s.status === 'tournament')))
    ]);
  };

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const addTournament = (tournament: Omit<Tournament, 'id'>) => {
    const newTournament: Tournament = { ...tournament, id: `tour-${Date.now()}` };
    setTournaments(prev => [...prev, newTournament]);
  };

  const updateTournament = (tournament: Tournament) => {
    setTournaments(prev => prev.map(t => t.id === tournament.id ? tournament : t));
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotif: Notification = { ...notification, id: `notif-${Date.now()}` };
    setNotifications(prev => [...prev, newNotif]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateSubscription = (userId: string, _type: SubscriptionType) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      } : null);
    }
  };

  return {
    currentUser,
    users,
    slots,
    bookings,
    tournaments,
    notifications,
    login,
    register,
    logout,
    addBooking,
    cancelBooking,
    updateUser,
    updateSlot,
    generateDaySlots,
    deleteSlot,
    addTournament,
    updateTournament,
    deleteTournament,
    addNotification,
    markNotificationRead,
    updateSubscription,
  };
}
