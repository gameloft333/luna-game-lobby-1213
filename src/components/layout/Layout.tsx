import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { DesktopSidebar } from './DesktopSidebar';
import { useThemeStore } from '../../store/theme';

export function Layout() {
  const theme = useThemeStore((state) => state.theme);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar hidden by default */}
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      
      {/* Main content area */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
}