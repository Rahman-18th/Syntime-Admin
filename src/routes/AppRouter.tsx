import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from '../features/auth/pages/LoginPage';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import AnnouncementPage from '../features/announcemets/pages/AnnouncementPage';
import EmployeePage from '../features/employees/pages/EmployeePage';
import AttendancePage from '../features/attendance/pages/AttendancePage';
import RequestPage from '../features/requests/pages/RequestPage';
import PayslipPage from '../features/payslips/pages/PayslipPage';
import MasterDataPage from '../features/master-data/pages/MasterDataPage';
import NotificationPage from '../features/notifications/pages/NotificationPage';
import RbacPage from '../features/rbac/pages/RbacPage';
import SettingsPage from '../features/settings/pages/SettingsPage';





export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={<ProtectedRoute />}
        >
          <Route
            element={<AdminLayout />}
          >
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/employees"
              element={<EmployeePage />}
            />

            <Route
              path="/master-data"
              element={<MasterDataPage />}
            />

            <Route
              path="/attendance"
              element={<AttendancePage />}
            />

            <Route
              path="/requests"
              element={<RequestPage />}
            />

            <Route
              path="/payslips"
              element={<PayslipPage />}
            />

            <Route
             path="/announcements"
             element={<AnnouncementPage />}
            />

            <Route
              path="/notifications"
              element={<NotificationPage />}
            />

            <Route
            path="/settings"
            element={<SettingsPage />}
            />

            <Route
              path="/access-control"
              element={<RbacPage />}
            />
          </Route>
          

          
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}