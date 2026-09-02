import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

function Topbar() {
  return <header className="admin-topbar" />;
}

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}