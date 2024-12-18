import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Trophy, Users, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Gamepad2, label: 'Center', path: '/games' },
  { icon: Trophy, label: 'Earn', path: '/tasks' },
  { icon: Users, label: 'Social', path: '/community' },
  { icon: Wallet, label: 'Profile', path: '/profile' },
];

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full text-xs',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}