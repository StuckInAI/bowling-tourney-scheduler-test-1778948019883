import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import type { User, Booking, Tournament, AppContextType } from '@/types';

export function useStore(): AppContextType {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.get('currentUser'));
  const [bookings, setBookings] = useState<Booking[]>(storage.get('bookings') || []);
  const [tournaments, setTournaments] = useState<Tournament[]>(storage.get('tournaments') || []);

  useEffect(() => {
    storage.set('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    storage.set('bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    storage.set('tournaments', tournaments);
  }, [tournaments]);

  const login = (email: string) => {
    const members = storage.get('members') || [];
    const user = members.find((m: User) => m.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    const members = storage.get('members') || [];
    const updatedMembers = members.map((m: User) => m.id === updatedUser.id ? updatedUser : m);
    storage.set('members', updatedMembers);
  };

  const registerForTournament = (tournamentId: string) => {
    if (!currentUser) return;

    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        if (t.registeredUserIds.includes(currentUser.id)) return t;
        if (t.participants.length >= t.maxParticipants) return t;

        const newParticipant = {
          userId: currentUser.id,
          name: currentUser.name,
          registeredAt: new Date().toISOString()
        };

        return {
          ...t,
          participants: [...t.participants, newParticipant],
          currentParticipants: t.participants.length + 1,
          registeredUserIds: [...t.registeredUserIds, currentUser.id]
        };
      }
      return t;
    }));
  };

  const addBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substring(2, 9),
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  };

  return {
    currentUser,
    setCurrentUser,
    bookings,
    setBookings,
    tournaments,
    setTournaments,
    login,
    logout,
    updateUser,
    registerForTournament,
    addBooking,
    cancelBooking
  };
}