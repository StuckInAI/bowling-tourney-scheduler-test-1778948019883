import { useState, useEffect } from 'react';
import type { User, Booking, Slot, Tournament, Notification, SubscriptionType } from '@/types';
import { storage } from '@/lib/storage';

export function useStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.get('currentUser'));
  const [users, setUsers] = useState<User[]>(storage.get('users') || []);
  const [bookings, setBookings] = useState<Booking[]>(storage.get('bookings') || []);
  const [slots, setSlots] = useState<Slot[]>(storage.get('slots') || []);
  const [tournaments, setTournaments] = useState<Tournament[]>(storage.get('tournaments') || []);
  const [notifications, setNotifications] = useState<Notification[]>(storage.get('notifications') || []);

  useEffect(() => {
    storage.set('currentUser', currentUser);
    storage.set('users', users);
    storage.set('bookings', bookings);
    storage.set('slots', slots);
    storage.set('tournaments', tournaments);
    storage.set('notifications', notifications);
  }, [currentUser, users, bookings, slots, tournaments, notifications]);

  const login = (email: string, _password?: string): User | null => {
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const register = (userData: Partial<User>): User | null => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email || '',
      name: userData.name || '',
      role: 'member',
      joinedAt: new Date().toISOString(),
      subscription: 'none',
      subscriptionStatus: 'active',
      phone: userData.phone || '',
      ...userData,
    } as User;
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking = { ...bookingData, id: Math.random().toString(36).substr(2, 9) } as Booking;
    setBookings([...bookings, newBooking]);
    
    if (bookingData.slotId) {
      const slot = slots.find(s => s.id === bookingData.slotId);
      if (slot) {
        updateSlot({ ...slot, isBooked: true, bookedByType: bookingData.type });
      }
    }
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking && booking.slotId) {
      const slot = slots.find(s => s.id === booking.slotId);
      if (slot) {
        updateSlot({ ...slot, isBooked: false, bookedByType: undefined });
      }
    }
    setBookings(bookings.filter((b) => b.id !== id));
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
  };

  const updateSlot = (updatedSlot: Slot) => {
    setSlots(slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
  };

  const addTournament = (tournamentData: Omit<Tournament, 'id'>) => {
    const newTournament = { ...tournamentData, id: Math.random().toString(36).substr(2, 9) } as Tournament;
    setTournaments([...tournaments, newTournament]);
  };

  const deleteTournament = (id: string) => {
    setTournaments(tournaments.filter((t) => t.id !== id));
  };

  const addNotification = (notifData: Omit<Notification, 'id'>) => {
    const newNotif = { ...notifData, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), isRead: false } as Notification;
    setNotifications([...notifications, newNotif]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const updateSubscription = (userId: string, type: SubscriptionType) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, subscription: type, subscriptionStatus: 'active' as const } : u);
    setUsers(updatedUsers);
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, subscription: type, subscriptionStatus: 'active' });
    }
  };

  return {
    currentUser,
    users,
    bookings,
    slots,
    tournaments,
    notifications,
    login,
    register,
    logout,
    addBooking,
    cancelBooking,
    updateUser,
    updateSlot,
    addTournament,
    deleteTournament,
    addNotification,
    markNotificationRead,
    updateSubscription,
  };
}