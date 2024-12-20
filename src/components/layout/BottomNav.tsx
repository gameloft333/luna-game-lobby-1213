import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { Clock, Shield, Gamepad2, User, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      icon: Clock,
      label: t('nav.recent'),
      path: '/recent'
    },
    {
      icon: Shield,
      label: t('nav.security'),
      path: '/security'
    },
    {
      icon: Gamepad2,
      label: t('nav.games'),
      path: '/games'
    },
    {
      icon: User,
      label: t('nav.profile'),
      path: '/profile'
    },
    {
      icon: Settings,
      label: t('nav.settings'),
      path: '/settings'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center w-16 h-full',
                  'transition-all duration-200 ease-in-out',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 scale-110'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
                )}
              >
                <item.icon className={cn(
                  'w-6 h-6 mb-1',
                  isActive && 'animate-bounce-small'
                )} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 