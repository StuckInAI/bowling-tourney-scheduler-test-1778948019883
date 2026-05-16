import { createContext, useContext } from 'react';
import type { AppContextType } from '@/types';
import { useStore } from '@/hooks/useStore';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
