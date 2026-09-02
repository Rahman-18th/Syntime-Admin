import {
  Bell,
  Search,
} from 'lucide-react';

export default function Topbar() {
  const rawUser = localStorage.getItem(
    'syntime_admin_user',
  );

  const user = rawUser
    ? JSON.parse(rawUser)
    : null;

  const email =
    user?.email ?? 'admin@syntime.local';

  const initial =
    email
      .charAt(0)
      .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search employees, requests, attendance..."
        />
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button"
        >
          <Bell size={18} />
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar">
            {initial}
          </div>

          <div className="topbar-user-copy">
            <strong>
              Administrator
            </strong>

            <span>{email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}