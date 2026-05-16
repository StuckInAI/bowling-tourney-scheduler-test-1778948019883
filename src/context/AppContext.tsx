import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getItem, setItem, removeItem } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { User, Subscription } from '@/types';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (name: string, email: string, password: string, phone: string) => User | string;
  updateCurrentUser: (data: Partial<User>) => void;
  activateSubscription: (userId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getItem<User>('current_user')
  );

  const login = useCallback((email: string, password: string): User | null => {
    const users = getItem<User[]>('users') || [];
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setItem('current_user', user);
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const logout = useCallback((): void => {
    removeItem('current_user');
    setCurrentUser(null);
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
      setCurrentUser(newUser);
      return newUser;
    },
    []
  );

  const updateCurrentUser = useCallback(
    (data: Partial<User>): void => {
      if (!currentUser) return;
      const users = getItem<User[]>('users') || [];
      const updated = { ...currentUser, ...data };
      setItem(
        'users',
        users.map((u) => (u.id === currentUser.id ? updated : u))
      );
      setItem('current_user', updated);
      setCurrentUser(updated);
    },
    [currentUser]
  );

  const activateSubscription = useCallback(
    (userId: string): void => {
      const users = getItem<User[]>('users') || [];
      const now = new Date();
      const end = new Date(now);
      end.setFullYear(end.getFullYear() + 1);
      const sub: Subscription = {
        id: generateId(),
        userId,
        status: 'active',
        startDate: now.toISOString(),
        endDate: end.toISOString(),
        plan: 'yearly',
        amount: 299,
      };
      const updated = users.map((u) =>
        u.id === userId ? { ...u, subscription: sub } : u
      );
      setItem('users', updated);
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, subscription: sub };
        setItem('current_user', updatedUser);
        setCurrentUser(updatedUser);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    // Sync user data if updated elsewhere
    const stored = getItem<User>('current_user');
    if (stored && currentUser && stored.id === currentUser.id) {
      setCurrentUser(stored);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ currentUser, login, logout, register, updateCurrentUser, activateSubscription }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
