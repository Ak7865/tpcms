
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/landing/LandingPage';
import SignInPage  from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CompanyProfileSetup from './pages/company/CompanyProfileSetup';
import StudentProfileSetup from './pages/student/StudentProfileSetup';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppRoute } from './routes/AppRoute';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected dashboard routes — with sidebar layout */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/company/profile-setup"
          element={
            <AppRoute allowedRoles={['Company']}>
              <CompanyProfileSetup />
            </AppRoute>
          }
        />
        <Route
          path="/students/profile-setup"
          element={
            <AppRoute allowedRoles={['Student']}>
              <StudentProfileSetup />
            </AppRoute>
          }
        />
        <Route element={<Layout />}>
          <Route
            path="/super-admin/dashboard"
            element={
              <AppRoute allowedRoles={['Super Admin']}>
                <SuperAdminDashboard />
              </AppRoute>
            }
          />
          <Route
            path="/t&p/dashboard"
            element={
              <AppRoute allowedRoles={['T&P']}>
                <AdminDashboard />
              </AppRoute>
            }
          />
          <Route
            path="/company/dashboard"
            element={
              <AppRoute allowedRoles={['Company']}>
                <CompanyDashboard />
              </AppRoute>
            }
          />
          <Route
            path="/students/dashboard"
            element={
              <AppRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </AppRoute>
            }
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


