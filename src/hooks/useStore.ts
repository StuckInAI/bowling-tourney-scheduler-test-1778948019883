import { useState, useEffect } from 'react';
import type { User, Slot, Booking, Tournament, Notification, SubscriptionPlan } from '@/types';
import { getItem, setItem } from '@/lib/storage';

const KEYS = {
  users: 'bp_users',
  slots: 'bp_slots',
  bookings: 'bp_bookings',
  tournaments: 'bp_tournaments',
  notifications: 'bp_notifications',
  currentUser: 'bp_current_user',
};

export function useStore() {
  const [users, setUsersState] = useState<User[]>(() => getItem<User[]>(KEYS.users) ?? []);
  const [slots, setSlotsState] = useState<Slot[]>(() => getItem<Slot[]>(KEYS.slots) ?? []);
  const [bookings, setBookingsState] = useState<Booking[]>(() => getItem<Booking[]>(KEYS.bookings) ?? []);
  const [tournaments, setTournamentsState] = useState<Tournament[]>(() => getItem<Tournament[]>(KEYS.tournaments) ?? []);
  const [notifications, setNotificationsState] = useState<Notification[]>(() => getItem<Notification[]>(KEYS.notifications) ?? []);
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getItem<User>(KEYS.currentUser) ?? null);

  // Sync to localStorage whenever state changes
  useEffect(() => { setItem(KEYS.users, users); }, [users]);
  useEffect(() => { setItem(KEYS.slots, slots); }, [slots]);
  useEffect(() => { setItem(KEYS.bookings, bookings); }, [bookings]);
  useEffect(() => { setItem(KEYS.tournaments, tournaments); }, [tournaments]);
  useEffect(() => { setItem(KEYS.notifications, notifications); }, [notifications]);
  useEffect(() => {
    if (currentUser) {
      setItem(KEYS.currentUser, currentUser);
    } else {
      localStorage.removeItem(KEYS.currentUser);
    }
  }, [currentUser]);

  // ── Users ──────────────────────────────────────────────────────────────
  const setUsers = (data: User[]) => setUsersState(data);

  const addUser = (user: User) => setUsersState(prev => [...prev, user]);

  const updateUser = (id: string, updates: Partial<User>) =>
    setUsersState(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));

  const deleteUser = (id: string) => setUsersState(prev => prev.filter(u => u.id !== id));

  // ── Auth ───────────────────────────────────────────────────────────────
  const login = (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUserState(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUserState(null);
    localStorage.removeItem(KEYS.currentUser);
  };

  const register = (data: Omit<User, 'id' | 'createdAt' | 'role'>): User => {
    const newUser: User = {
      ...data,
      id: crypto.randomUUID(),
      role: 'member',
      createdAt: new Date().toISOString(),
    };
    addUser(newUser);
    setCurrentUserState(newUser);
    return newUser;
  };

  // ── Slots ──────────────────────────────────────────────────────────────
  const setSlots = (data: Slot[]) => setSlotsState(data);

  const addSlot = (slot: Slot) => setSlotsState(prev => [...prev, slot]);

  const updateSlot = (id: string, updates: Partial<Slot>) =>
    setSlotsState(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

  const deleteSlot = (id: string) => setSlotsState(prev => prev.filter(s => s.id !== id));

  const bulkUpdateSlots = (updates: Slot[]) => {
    setSlotsState(prev => {
      const map = new Map(prev.map(s => [s.id, s]));
      updates.forEach(u => map.set(u.id, u));
      return Array.from(map.values());
    });
  };

  // ── Bookings ───────────────────────────────────────────────────────────
  const setBookings = (data: Booking[]) => setBookingsState(data);

  const addBooking = (booking: Booking) => setBookingsState(prev => [...prev, booking]);

  const updateBooking = (id: string, updates: Partial<Booking>) =>
    setBookingsState(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

  const deleteBooking = (id: string) => setBookingsState(prev => prev.filter(b => b.id !== id));

  const cancelBooking = (id: string) => updateBooking(id, { status: 'cancelled' });

  // ── Tournaments ────────────────────────────────────────────────────────
  const setTournaments = (data: Tournament[]) => setTournamentsState(data);

  const addTournament = (tournament: Tournament) =>
    setTournamentsState(prev => [...prev, tournament]);

  const updateTournament = (id: string, updates: Partial<Tournament>) =>
    setTournamentsState(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

  const deleteTournament = (id: string) =>
    setTournamentsState(prev => prev.filter(t => t.id !== id));

  const joinTournament = (tournamentId: string, userId: string) => {
    setTournamentsState(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      if (t.registeredParticipants.includes(userId)) return t;
      return {
        ...t,
        registeredParticipants: [...t.registeredParticipants, userId],
      };
    }));
  };

  const leaveTournament = (tournamentId: string, userId: string) => {
    setTournamentsState(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      return {
        ...t,
        registeredParticipants: t.registeredParticipants.filter(id => id !== userId),
      };
    }));
  };

  // ── Notifications ──────────────────────────────────────────────────────
  const setNotifications = (data: Notification[]) => setNotificationsState(data);

  const addNotification = (notification: Notification) =>
    setNotificationsState(prev => [...prev, notification]);

  const updateNotification = (id: string, updates: Partial<Notification>) =>
    setNotificationsState(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));

  const deleteNotification = (id: string) =>
    setNotificationsState(prev => prev.filter(n => n.id !== id));

  const markNotificationRead = (id: string) => updateNotification(id, { read: true });

  const markAllNotificationsRead = () =>
    setNotificationsState(prev => prev.map(n => ({ ...n, read: true })));

  // ── Subscription ───────────────────────────────────────────────────────
  const updateSubscription = (userId: string, plan: SubscriptionPlan, expiresAt: string) => {
    updateUser(userId, { subscriptionPlan: plan, subscriptionExpiresAt: expiresAt });
    if (currentUser?.id === userId) {
      setCurrentUserState(prev => prev ? { ...prev, subscriptionPlan: plan, subscriptionExpiresAt: expiresAt } : null);
    }
  };

  return {
    // State
    users,
    slots,
    bookings,
    tournaments,
    notifications,
    currentUser,

    // User actions
    setUsers,
    addUser,
    updateUser,
    deleteUser,

    // Auth actions
    login,
    logout,
    register,

    // Slot actions
    setSlots,
    addSlot,
    updateSlot,
    deleteSlot,
    bulkUpdateSlots,

    // Booking actions
    setBookings,
    addBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,

    // Tournament actions
    setTournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    joinTournament,
    leaveTournament,

    // Notification actions
    setNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationRead,
    markAllNotificationsRead,

    // Subscription actions
    updateSubscription,
  };
}
