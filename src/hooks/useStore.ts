import { useState, useCallback } from 'react';
import { loadState, saveState } from '@/lib/storage';
import type { AppState } from '@/types';
import { seedInitialData } from '@/lib/seed';

const DEFAULT_STATE: AppState = {
  users: [],
  slots: [],
  bookings: [],
  tournaments: [],
  notifications: [],
  currentUserId: null,
};

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState<AppState>();
    if (saved && saved.users && saved.users.length > 0) {
      return saved;
    }
    return DEFAULT_STATE;
  });

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState<AppState>(next);
      return next;
    });
  }, []);

  const currentUser = state.currentUserId
    ? state.users.find((u) => u.id === state.currentUserId) ?? null
    : null;

  const login = useCallback((email: string, password: string): boolean => {
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return false;
    updateState((prev) => ({ ...prev, currentUserId: user.id }));
    return true;
  }, [state.users, updateState]);

  const logout = useCallback(() => {
    updateState((prev) => ({ ...prev, currentUserId: null }));
  }, [updateState]);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    if (state.users.find((u) => u.email === email)) return false;
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'member' as const,
      membershipType: 'basic' as const,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
    };
    updateState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    return true;
  }, [state.users, updateState]);

  return {
    state,
    updateState,
    currentUser,
    login,
    logout,
    register,
  };
}
