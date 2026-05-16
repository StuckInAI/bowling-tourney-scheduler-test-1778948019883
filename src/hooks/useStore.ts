import { useState } from 'react';
import type { User, Slot, Booking, Tournament, Notification } from '@/types';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

export function useStore() {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage<User[]>('users', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage<User | null>('currentUser', null));
  const [slots, setSlots] = useState<Slot[]>(() => loadFromStorage<Slot[]>('slots', []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage<Booking[]>('bookings', []));
  const [tournaments, setTournaments] = useState<Tournament[]>(() => loadFromStorage<Tournament[]>('tournaments', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage<Notification[]>('notifications', []));

  // Auth
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      saveToStorage('currentUser', user);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'member',
      subscription: 'none',
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveToStorage('users', updated);
    setCurrentUser(newUser);
    saveToStorage('currentUser', newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    saveToStorage('currentUser', null);
  };

  // Users
  const updateUser = (updatedFields: Partial<User> & { id: string }) => {
    const updated = users.map(u => u.id === updatedFields.id ? { ...u, ...updatedFields } : u);
    setUsers(updated);
    saveToStorage('users', updated);
    if (currentUser && currentUser.id === updatedFields.id) {
      const updatedCurrent = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedCurrent);
      saveToStorage('currentUser', updatedCurrent);
    }
  };

  // Slots
  const addSlot = (slot: Slot) => {
    const updated = [...slots, slot];
    setSlots(updated);
    saveToStorage('slots', updated);
  };

  const updateSlot = (updatedFields: Partial<Slot> & { id: string }) => {
    const updated = slots.map(s => s.id === updatedFields.id ? { ...s, ...updatedFields } : s);
    setSlots(updated);
    saveToStorage('slots', updated);
  };

  const deleteSlot = (id: string) => {
    const updated = slots.filter(s => s.id !== id);
    setSlots(updated);
    saveToStorage('slots', updated);
  };

  // Bookings
  const addBooking = (booking: Booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    saveToStorage('bookings', updated);
  };

  const cancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);
    saveToStorage('bookings', updated);
  };

  // Tournaments
  const addTournament = (tournament: Tournament) => {
    const updated = [...tournaments, tournament];
    setTournaments(updated);
    saveToStorage('tournaments', updated);
  };

  const updateTournament = (updatedFields: Partial<Tournament> & { id: string }) => {
    const updated = tournaments.map(t => t.id === updatedFields.id ? { ...t, ...updatedFields } : t);
    setTournaments(updated);
    saveToStorage('tournaments', updated);
  };

  const deleteTournament = (id: string) => {
    const updated = tournaments.filter(t => t.id !== id);
    setTournaments(updated);
    saveToStorage('tournaments', updated);
  };

  const registerForTournament = (tournamentId: string, userId: string) => {
    const updated = tournaments.map(t => {
      if (t.id === tournamentId && !t.registeredParticipants.includes(userId)) {
        return { ...t, registeredParticipants: [...t.registeredParticipants, userId] };
      }
      return t;
    });
    setTournaments(updated);
    saveToStorage('tournaments', updated);
  };

  // Notifications
  const addNotification = (notification: Notification) => {
    const updated = [...notifications, notification];
    setNotifications(updated);
    saveToStorage('notifications', updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveToStorage('notifications', updated);
  };

  return {
    currentUser,
    login,
    register,
    logout,
    users,
    updateUser,
    slots,
    addSlot,
    updateSlot,
    deleteSlot,
    bookings,
    addBooking,
    cancelBooking,
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    registerForTournament,
    notifications,
    addNotification,
    deleteNotification,
  };
}
