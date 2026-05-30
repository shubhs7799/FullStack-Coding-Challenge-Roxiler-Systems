import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  user: [
    { to: '/stores', label: 'Stores', end: true },
    { to: '/change-password', label: 'Change Password' },
  ],
  owner: [
    { to: '/owner', label: 'My Stores', end: true },
    { to: '/owner/change-password', label: 'Change Password' },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = navLinks[user?.role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold text-blue-600">StoreRate</span>
              <div className="hidden md:flex items-center gap-1">
                {links.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary text-xs px-3 py-1.5">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
