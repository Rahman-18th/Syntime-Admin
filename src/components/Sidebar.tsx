import {
  Bell,
  Building2,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Megaphone,
  ReceiptText,
  Settings,
  UserRound,
} from 'lucide-react';

import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

const mainMenu = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: UserRound,
  },
  {
    label: 'Master Data',
    path: '/master-data',
    icon: Building2,
  },
  {
    label: 'Attendance',
    path: '/attendance',
    icon: Clock3,
  },
  {
    label: 'Requests',
    path: '/requests',
    icon: ClipboardList,
  },
  {
    label: 'Payslips',
    path: '/payslips',
    icon: ReceiptText,
  },
];

const communicationMenu = [
  {
    label: 'Announcements',
    path: '/announcements',
    icon: Megaphone,
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem(
      'syntime_admin_token',
    );

    localStorage.removeItem(
      'syntime_admin_user',
    );

    navigate('/login', {
      replace: true,
    });
  }

  function renderMenu(
    items: typeof mainMenu,
  ) {
    return items.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `sidebar-link ${
              isActive
                ? 'sidebar-link-active'
                : ''
            }`
          }
        >
          <span className="sidebar-link-icon">
            <Icon size={18} />
          </span>

          <span>{item.label}</span>
        </NavLink>
      );
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          S
        </div>

        <div>
          <div className="sidebar-brand-title">
            SynTime
          </div>

          <div className="sidebar-brand-subtitle">
            Admin Workspace
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">
          Workspace
        </div>

        <nav className="sidebar-nav">
          {renderMenu(mainMenu)}
        </nav>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">
          Communication
        </div>

        <nav className="sidebar-nav">
          {renderMenu(
            communicationMenu,
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-secondary-button"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}