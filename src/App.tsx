import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { seedInitialData } from '@/lib/seed';

// Public pages
import LandingPage from '@/pages/public/LandingPage';
import PublicBookingPage from '@/pages/public/PublicBookingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Member pages
import MemberLayout from '@/components/layout/MemberLayout';
import MemberDashboard from '@/pages/member/MemberDashboard';
import MemberBookingPage from '@/pages/member/MemberBookingPage';
import MemberMyBookings from '@/pages/member/MemberMyBookings';
import MemberTournaments from '@/pages/member/MemberTournaments';
import MemberProfile from '@/pages/member/MemberProfile';
import MemberSubscription from '@/pages/member/MemberSubscription';

// Admin pages
import AdminLayout from '@/components/layout/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminSlots from '@/pages/admin/AdminSlots';
import AdminMembers from '@/pages/admin/AdminMembers';
import AdminTournaments from '@/pages/admin/AdminTournaments';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminNotifications from '@/pages/admin/AdminNotifications';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

function AppContent() {
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/public-booking" element={<PublicBookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Member */}
        <Route
          path="/member"
          element={
            <ProtectedRoute role="member">
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/member/dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="booking" element={<MemberBookingPage />} />
          <Route path="my-bookings" element={<MemberMyBookings />} />
          <Route path="tournaments" element={<MemberTournaments />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="subscription" element={<MemberSubscription />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="slots" element={<AdminSlots />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="tournaments" element={<AdminTournaments />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
