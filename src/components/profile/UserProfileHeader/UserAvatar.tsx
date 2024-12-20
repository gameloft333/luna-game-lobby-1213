import React from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  user: FirebaseUser;
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="relative group">
      <div className="w-20 h-20 rounded-2xl bg-blue-500/10 dark:bg-blue-900/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-full h-full rounded-2xl object-cover"
          />
        ) : (
          <UserIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/20 dark:ring-blue-400/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
    </div>
  );
}