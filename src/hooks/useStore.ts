import { useState, useEffect } from 'react';
import { loadState, saveState } from '@/lib/storage';
import type { AppState, User } from '@/types';

const INITIAL_STATE: AppState = {
  users: [],
  slots: [],
  bookings: [],
  tournaments: [],
  notifications: [],
  currentUser: undefined,
};

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    return saved ?? INITIAL_STATE;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev));
  };

  const login = (email: string, password: string): boolean => {
    const user = (state.users ?? []).find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setState((prev) => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: undefined }));
  };

  const register = (name: string, email: string, password: string): boolean => {
    const exists = (state.users ?? []).some((u) => u.email === email);
    if (exists) return false;
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: 'member',
      subscription: 'none',
      joinedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      users: [...(prev.users ?? []), newUser],
      currentUser: newUser,
    }));
    return true;
  };

  return {
    state,
    updateState,
    currentUser: state.currentUser as User | undefined,
    login,
    logout,
    register,
  };
}
