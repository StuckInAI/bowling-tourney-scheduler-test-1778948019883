import React, { createContext, useContext } from 'react';
import { useStore } from '@/hooks/useStore';
import type { User, Booking, Slot, Tournament, Notification, SubscriptionType } from '@/types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  bookings: Booking[];
  slots: Slot[];
  tournaments: Tournament[];
  notifications: Notification[];
  login: (email: string, password?: string) => User | null;
  register: (data: Partial<User>) => User | null;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  updateUser: (user: User) => void;
  updateSlot: (slot: Slot) => void;
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  deleteTournament: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  updateSubscription: (userId: string, type: SubscriptionType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}