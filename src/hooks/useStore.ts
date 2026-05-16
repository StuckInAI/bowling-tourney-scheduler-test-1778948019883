import { useState, useEffect } from 'react';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

export function useStore() {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage<User[]>('users', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage<User | null>('currentUser', null));
  const [slots, setSlots] = useState<Slot[]>(() => loadFromStorage<Slot[]>('slots', []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage<Booking[]>('bookings', []));
  const [tournaments, setTournaments] = useState<Tournament[]>(() => loadFromStorage<Tournament[]>('tournaments', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage<Notification[]>('notifications', []));

  useEffect(() => { saveToStorage('users', users); }, [users]);
  useEffect(() => { saveToStorage('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('slots', slots); }, [slots]);
  useEffect(() => { saveToStorage('bookings', bookings); }, [bookings]);
  useEffect(() => { saveToStorage('tournaments', tournaments); }, [tournaments]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const register = (name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'member',
      subscriptionStatus: 'inactive',
      joinedAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    setCurrentUser(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  };

  const addSlot = (slot: Omit<Slot, 'id'>) => {
    const newSlot: Slot = { ...slot, id: crypto.randomUUID() };
    setSlots(prev => [...prev, newSlot]);
  };

  const updateSlot = (id: string, updates: Partial<Slot>) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
    updateSlot(booking.slotId, { booked: (slots.find(s => s.id === booking.slotId)?.booked ?? 0) + 1 });
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      updateSlot(booking.slotId, { booked: Math.max(0, (slots.find(s => s.id === booking.slotId)?.booked ?? 1) - 1) });
    }
  };

  const addTournament = (tournament: Omit<Tournament, 'id' | 'createdAt'>) => {
    const newTournament: Tournament = {
      ...tournament,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTournaments(prev => [...prev, newTournament]);
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'readBy'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      readBy: [],
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationRead = (notificationId: string, userId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId && !n.readBy.includes(userId)
          ? { ...n, readBy: [...n.readBy, userId] }
          : n
      )
    );
  };

  const updateSubscription = (userId: string, status: 'active' | 'inactive' | 'expired', expiry?: string) => {
    updateUser(userId, { subscriptionStatus: status, subscriptionExpiry: expiry });
  };

  return {
    users,
    currentUser,
    slots,
    bookings,
    tournaments,
    notifications,
    login,
    logout,
    register,
    updateUser,
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
    updateSubscription,
  };
}
