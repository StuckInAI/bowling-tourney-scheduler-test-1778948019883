import { useState, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';
import type {
  User,
  Lane,
  Slot,
  Booking,
  Tournament,
  TournamentParticipant,
  TournamentMatch,
  Notification,
} from '@/types';
import { generateId, generateConfirmationCode, formatDate, isWithin24Hours } from '@/lib/utils';

export function useUsers() {
  const getUsers = useCallback((): User[] => getItem<User[]>('users') || [], []);

  const getUserById = useCallback(
    (id: string): User | undefined => getUsers().find((u) => u.id === id),
    [getUsers]
  );

  const updateUser = useCallback(
    (id: string, data: Partial<User>): void => {
      const users = getUsers();
      setItem(
        'users',
        users.map((u) => (u.id === id ? { ...u, ...data } : u))
      );
    },
    [getUsers]
  );

  const addUser = useCallback(
    (user: User): void => {
      const users = getUsers();
      setItem('users', [...users, user]);
    },
    [getUsers]
  );

  const getMembers = useCallback(
    (): User[] => getUsers().filter((u) => u.role === 'member'),
    [getUsers]
  );

  return { getUsers, getUserById, updateUser, addUser, getMembers };
}

export function useLanes() {
  const getLanes = useCallback((): Lane[] => getItem<Lane[]>('lanes') || [], []);
  return { getLanes };
}

export function useSlots() {
  const getSlots = useCallback((): Slot[] => getItem<Slot[]>('slots') || [], []);

  const getSlotById = useCallback(
    (id: string): Slot | undefined => getSlots().find((s) => s.id === id),
    [getSlots]
  );

  const updateSlot = useCallback(
    (id: string, data: Partial<Slot>): void => {
      const slots = getSlots();
      setItem(
        'slots',
        slots.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    },
    [getSlots]
  );

  const getSlotsByDate = useCallback(
    (date: string): Slot[] => getSlots().filter((s) => s.date === date),
    [getSlots]
  );

  const getPublicSlots = useCallback(
    (): Slot[] =>
      getSlots().filter(
        (s) => s.status === 'available' && isWithin24Hours(s.date, s.startTime)
      ),
    [getSlots]
  );

  const generateSlots = useCallback(
    (startDate: string, endDate: string): void => {
      const existing = getSlots();
      const newSlots: Slot[] = [];
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        for (let lane = 1; lane <= 16; lane++) {
          for (let hour = 9; hour < 22; hour++) {
            const already = existing.find(
              (s) =>
                s.date === dateStr &&
                s.laneId === `lane-${lane}` &&
                s.startTime === `${String(hour).padStart(2, '0')}:00`
            );
            if (!already) {
              newSlots.push({
                id: generateId(),
                laneId: `lane-${lane}`,
                date: dateStr,
                startTime: `${String(hour).padStart(2, '0')}:00`,
                endTime: `${String(hour + 1).padStart(2, '0')}:00`,
                status: 'available',
              });
            }
          }
        }
      }
      setItem('slots', [...existing, ...newSlots]);
    },
    [getSlots]
  );

  return { getSlots, getSlotById, updateSlot, getSlotsByDate, getPublicSlots, generateSlots };
}

export function useBookings() {
  const getBookings = useCallback((): Booking[] => getItem<Booking[]>('bookings') || [], []);

  const addBooking = useCallback(
    (booking: Booking): void => {
      const bookings = getBookings();
      setItem('bookings', [...bookings, booking]);
    },
    [getBookings]
  );

  const cancelBooking = useCallback(
    (id: string): void => {
      const bookings = getBookings();
      setItem(
        'bookings',
        bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      );
    },
    [getBookings]
  );

  const getBookingsByUser = useCallback(
    (userId: string): Booking[] => getBookings().filter((b) => b.userId === userId),
    [getBookings]
  );

  const getBookingBySlot = useCallback(
    (slotId: string): Booking | undefined =>
      getBookings().find((b) => b.slotId === slotId && b.status === 'confirmed'),
    [getBookings]
  );

  const createMemberBooking = useCallback(
    (slotId: string, userId: string): Booking => {
      const booking: Booking = {
        id: generateId(),
        slotId,
        type: 'member',
        userId,
        confirmationCode: generateConfirmationCode(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      addBooking(booking);
      return booking;
    },
    [addBooking]
  );

  const createOutsiderBooking = useCallback(
    (
      slotId: string,
      name: string,
      email: string,
      phone: string
    ): Booking => {
      const booking: Booking = {
        id: generateId(),
        slotId,
        type: 'outsider',
        outsiderName: name,
        outsiderEmail: email,
        outsiderPhone: phone,
        confirmationCode: generateConfirmationCode(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      addBooking(booking);
      return booking;
    },
    [addBooking]
  );

  return {
    getBookings,
    addBooking,
    cancelBooking,
    getBookingsByUser,
    getBookingBySlot,
    createMemberBooking,
    createOutsiderBooking,
  };
}

export function useTournaments() {
  const getTournaments = useCallback(
    (): Tournament[] => getItem<Tournament[]>('tournaments') || [],
    []
  );

  const getTournamentById = useCallback(
    (id: string): Tournament | undefined => getTournaments().find((t) => t.id === id),
    [getTournaments]
  );

  const addTournament = useCallback(
    (tournament: Tournament): void => {
      const tournaments = getTournaments();
      setItem('tournaments', [...tournaments, tournament]);
    },
    [getTournaments]
  );

  const updateTournament = useCallback(
    (id: string, data: Partial<Tournament>): void => {
      const tournaments = getTournaments();
      setItem(
        'tournaments',
        tournaments.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
    },
    [getTournaments]
  );

  const getParticipants = useCallback(
    (): TournamentParticipant[] =>
      getItem<TournamentParticipant[]>('tournament_participants') || [],
    []
  );

  const addParticipant = useCallback(
    (p: TournamentParticipant): void => {
      const participants = getParticipants();
      setItem('tournament_participants', [...participants, p]);
    },
    [getParticipants]
  );

  const updateParticipant = useCallback(
    (id: string, data: Partial<TournamentParticipant>): void => {
      const participants = getParticipants();
      setItem(
        'tournament_participants',
        participants.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    },
    [getParticipants]
  );

  const getMatches = useCallback(
    (): TournamentMatch[] => getItem<TournamentMatch[]>('tournament_matches') || [],
    []
  );

  const addMatch = useCallback(
    (match: TournamentMatch): void => {
      const matches = getMatches();
      setItem('tournament_matches', [...matches, match]);
    },
    [getMatches]
  );

  const updateMatch = useCallback(
    (id: string, data: Partial<TournamentMatch>): void => {
      const matches = getMatches();
      setItem(
        'tournament_matches',
        matches.map((m) => (m.id === id ? { ...m, ...data } : m))
      );
    },
    [getMatches]
  );

  const setMatches = useCallback(
    (matches: TournamentMatch[]): void => {
      setItem('tournament_matches', matches);
    },
    []
  );

  return {
    getTournaments,
    getTournamentById,
    addTournament,
    updateTournament,
    getParticipants,
    addParticipant,
    updateParticipant,
    getMatches,
    addMatch,
    updateMatch,
    setMatches,
  };
}

export function useNotifications() {
  const getNotifications = useCallback(
    (): Notification[] => getItem<Notification[]>('notifications') || [],
    []
  );

  const addNotification = useCallback(
    (n: Notification): void => {
      const notifications = getNotifications();
      setItem('notifications', [...notifications, n]);
    },
    [getNotifications]
  );

  const logNotification = useCallback(
    (type: string, email: string, subject: string, body: string): void => {
      addNotification({
        id: generateId(),
        type,
        recipientEmail: email,
        subject,
        body,
        sentAt: new Date().toISOString(),
        status: 'sent',
      });
    },
    [addNotification]
  );

  return { getNotifications, addNotification, logNotification };
}

export function useAuth() {
  const [, forceUpdate] = useState(0);

  const getCurrentUser = useCallback((): User | null => {
    return getItem<User>('current_user');
  }, []);

  const login = useCallback(
    (email: string, password: string): User | null => {
      const users = getItem<User[]>('users') || [];
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (user) {
        setItem('current_user', user);
        forceUpdate((n) => n + 1);
        return user;
      }
      return null;
    },
    []
  );

  const logout = useCallback((): void => {
    const { removeItem } = require('@/lib/storage');
    removeItem('current_user');
    forceUpdate((n) => n + 1);
  }, []);

  const register = useCallback(
    (name: string, email: string, password: string, phone: string): User | string => {
      const users = getItem<User[]>('users') || [];
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return 'Email already registered';
      }
      const newUser: User = {
        id: generateId(),
        name,
        email,
        password,
        role: 'member',
        phone,
        createdAt: new Date().toISOString(),
      };
      setItem('users', [...users, newUser]);
      setItem('current_user', newUser);
      forceUpdate((n) => n + 1);
      return newUser;
    },
    []
  );

  return { getCurrentUser, login, logout, register };
}
