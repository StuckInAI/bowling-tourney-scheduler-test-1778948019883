import { useState, useCallback } from 'react';
import type { User, Slot, Booking, Tournament, AppNotification, AppContextType, TournamentParticipant } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export function useStore(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const id = loadData<string>('currentUserId', '');
    if (!id) return null;
    const users = loadData<User[]>('users', []);
    return users.find(u => u.id === id) ?? null;
  });

  const [users, setUsers] = useState<User[]>(() => loadData<User[]>('users', []));
  const [slots, setSlots] = useState<Slot[]>(() => loadData<Slot[]>('slots', []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadData<Booking[]>('bookings', []));
  const [tournaments, setTournaments] = useState<Tournament[]>(() => loadData<Tournament[]>('tournaments', []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadData<AppNotification[]>('notifications', []));

  const persist = useCallback(<T>(key: string, value: T) => {
    saveData(key, value);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const allUsers = loadData<User[]>('users', []);
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (!user) return false;
    setCurrentUser(user);
    setUsers(allUsers);
    saveData('currentUserId', user.id);
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    saveData('currentUserId', '');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const allUsers = loadData<User[]>('users', []);
    if (allUsers.find(u => u.email === email)) return false;
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password,
      role: 'member',
      subscriptionTier: 'none',
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
    };
    const updated = [...allUsers, newUser];
    setUsers(updated);
    persist('users', updated);
    setCurrentUser(newUser);
    saveData('currentUserId', newUser.id);
    return true;
  }, [persist]);

  const addSlot = useCallback((slot: Omit<Slot, 'id' | 'bookedCount'>) => {
    const newSlot: Slot = { ...slot, id: generateId(), bookedCount: 0 };
    setSlots(prev => {
      const updated = [...prev, newSlot];
      persist('slots', updated);
      return updated;
    });
  }, [persist]);

  const updateSlot = useCallback((id: string, updates: Partial<Slot>) => {
    setSlots(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
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

  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => {
      const updated = [...prev, newBooking];
      persist('bookings', updated);
      return updated;
    });
    setSlots(prev => {
      const updated = prev.map(s =>
        s.id === booking.slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s
      );
      persist('slots', updated);
      return updated;
    });
    return newBooking;
  }, [persist]);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => {
      const booking = prev.find(b => b.id === id);
      const updated = prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      persist('bookings', updated);
      if (booking) {
        setSlots(sp => {
          const updatedSlots = sp.map(s =>
            s.id === booking.slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
          );
          persist('slots', updatedSlots);
          return updatedSlots;
        });
      }
      return updated;
    });
  }, [persist]);

  const addTournament = useCallback((tournament: Omit<Tournament, 'id' | 'createdAt' | 'participants' | 'matches'>) => {
    const newTournament: Tournament = {
      ...tournament,
      id: generateId(),
      participants: [],
      matches: [],
      createdAt: new Date().toISOString(),
    };
    setTournaments(prev => {
      const updated = [...prev, newTournament];
      persist('tournaments', updated);
      return updated;
    });
  }, [persist]);

  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
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

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      persist('notifications', updated);
      return updated;
    });
  }, [persist]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      persist('users', updated);
      return updated;
    });
    setCurrentUser(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
  }, [persist]);

  const updateSubscription = useCallback((userId: string, status: 'active' | 'inactive', tier: 'none' | 'basic' | 'premium', expiry?: string) => {
    const updates: Partial<User> = { subscriptionStatus: status, subscriptionTier: tier, subscriptionExpiry: expiry };
    setUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, ...updates } : u);
      persist('users', updated);
      return updated;
    });
    setCurrentUser(prev => prev && prev.id === userId ? { ...prev, ...updates } : prev);
  }, [persist]);

  const toggleUserStatus = useCallback((id: string) => {
    setUsers(prev => {
      const updated = prev.map(u =>
        u.id === id
          ? { ...u, subscriptionStatus: u.subscriptionStatus === 'active' ? 'inactive' as const : 'active' as const }
          : u
      );
      persist('users', updated);
      return updated;
    });
  }, [persist]);

  return {
    currentUser,
    login,
    logout,
    register,
    users,
    slots,
    bookings,
    tournaments,
    notifications,
    addSlot,
    updateSlot,
    deleteSlot,
    addBooking,
    cancelBooking,
    addTournament,
    updateTournament,
    deleteTournament,
    addNotification,
    updateUser,
    updateSubscription,
    toggleUserStatus,
  };
}
