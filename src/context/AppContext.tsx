import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useStore } from '@/hooks/useStore';

type StoreType = ReturnType<typeof useStore>;

const AppContext = createContext<StoreType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
