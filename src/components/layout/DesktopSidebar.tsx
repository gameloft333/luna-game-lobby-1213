import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Gamepad2,
  Trophy,
  Users,
  Settings,
  Wallet,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../lib/firebase/auth';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Gamepad2, label: 'Games', path: '/games' },
  { icon: Trophy, label: 'Earn', path: '/tasks' },
  { icon: Users, label: 'Social', path: '/community' },
  { icon: Wallet, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function DesktopSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          GameHub
        </h1>
      </div>
      <nav className="flex-1 p-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-1',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}