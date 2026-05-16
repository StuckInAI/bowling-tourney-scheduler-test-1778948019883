import { useState, useEffect } from 'react';
import { storage } from '@/lib/utils';
import type { User, Slot, Booking, Tournament, Notification, AppContextType } from '@/types';

export function useStore(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.get('currentUser'));
  const [users, setUsers] = useState<User[]>(storage.get('users') || []);
  const [slots, setSlots] = useState<Slot[]>(storage.get('slots') || []);
  const [bookings, setBookings] = useState<Booking[]>(storage.get('bookings') || []);
  const [tournaments, setTournaments] = useState<Tournament[]>(storage.get('tournaments') || []);
  const [notifications, setNotifications] = useState<Notification[]>(storage.get('notifications') || []);

  useEffect(() => {
    storage.set('currentUser', currentUser);
    storage.set('users', users);
    storage.set('slots', slots);
    storage.set('bookings', bookings);
    storage.set('tournaments', tournaments);
    storage.set('notifications', notifications);
  }, [currentUser, users, slots, bookings, tournaments, notifications]);

  const login = async (email: string, _password: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
    } else {
      throw new Error('User not found');
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), name, email, role: 'member', subscriptionStatus: 'inactive' };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);

  const createBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = { ...booking, id: Math.random().toString(36).substr(2, 9) };
    setBookings([...bookings, newBooking]);
  };

  const cancelBooking = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const updateSlot = (id: string, updates: Partial<Slot>) => {
    setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const registerForTournament = (tournamentId: string, userId: string) => {
    setTournaments(tournaments.map(t => {
      if (t.id === tournamentId && !t.participants.includes(userId)) {
        return { ...t, participants: [...t.participants, userId] };
      }
      return t;
    }));
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
    createBooking,
    cancelBooking,
    updateSlot,
    registerForTournament
  };
}