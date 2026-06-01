import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <span className="text-xl font-bold tracking-tight">HelpDesk Pro</span>
            <div className="flex space-x-4">
              <Link to="/dashboard" className="hover:bg-blue-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/tickets" className="hover:bg-blue-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                Tickets
              </Link>
              {user?.role === UserRole.ADMIN && (
                <>
                  <Link to="/users" className="hover:bg-blue-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                    Users
                  </Link>
                  <Link to="/departments" className="hover:bg-blue-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                    Departments
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-blue-200">
                {user.name} ({user.role})
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
