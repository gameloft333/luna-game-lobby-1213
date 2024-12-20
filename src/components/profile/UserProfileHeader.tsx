import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { cn } from '../../lib/utils';

export function UserProfileHeader() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <UserIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold dark:text-white">
            {user?.displayName || '未命名用户'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}