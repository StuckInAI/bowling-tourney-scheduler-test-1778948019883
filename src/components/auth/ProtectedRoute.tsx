import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import type { UserRole } from '@/types';

type ProtectedRouteProps = {
  children: ReactNode;
  role: UserRole;
};

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== role) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/overview" replace />;
    return <Navigate to="/member/dashboard" replace />;
  }

  return <>{children}</>;
}
