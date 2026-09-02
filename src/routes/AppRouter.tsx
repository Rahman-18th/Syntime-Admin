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
              element={
                <PlaceholderPage title="Employees" />
              }
            />

            <Route
              path="/attendance"
              element={
                <PlaceholderPage title="Attendance" />
              }
            />

            <Route
              path="/requests"
              element={
                <PlaceholderPage title="Requests" />
              }
            />

            <Route
              path="/payslips"
              element={
                <PlaceholderPage title="Payslips" />
              }
            />

            <Route
              path="/announcements"
              element={
                <PlaceholderPage title="Announcements" />
              }
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