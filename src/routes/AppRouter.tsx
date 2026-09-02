import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from '../features/auth/pages/LoginPage';

function DashboardPlaceholder() {
  return (
    <div
      style={{
        padding: '32px',
      }}
    >
      <h1>SynTime Dashboard</h1>
      <p>Admin login successful.</p>
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
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPlaceholder />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}