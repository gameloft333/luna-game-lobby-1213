import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Trophy, Users, Wallet } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Gamepad2, label: 'Center', path: '/games' },
  { icon: Trophy, label: 'Earn', path: '/tasks' },
  { icon: Users, label: 'Social', path: '/community' },
  { icon: Wallet, label: 'Wallet', path: '/profile' },
];

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full relative px-2',
                'transition-all duration-200 ease-in-out',
                isActive 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'relative transition-transform duration-200',
                  isActive ? 'scale-110 -translate-y-1' : ''
                )}>
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <div className="absolute -inset-1.5 bg-blue-400/20 rounded-full -z-10 animate-pulse" />
                  )}
                </div>
                <span className={cn(
                  'text-xs mt-1 transition-opacity duration-200',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}>
                  {label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full transform -translate-x-1/2" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}