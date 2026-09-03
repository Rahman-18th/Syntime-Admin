import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from '../features/auth/pages/LoginPage';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import AnnouncementPage from '../features/announcemets/pages/AnnouncementPage';
import EmployeePage from '../features/employees/pages/EmployeePage';
import AttendancePage from '../features/attendance/pages/AttendancePage';
import RequestPage from '../features/requests/pages/RequestPage';
import PayslipPage from '../features/payslips/pages/PayslipPage';

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <h1>{title}</h1>
      <p>
        This module will be implemented next.
      </p>
    </div>
  );
}

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
              element={
                <PlaceholderPage title="Notifications" />
              }
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