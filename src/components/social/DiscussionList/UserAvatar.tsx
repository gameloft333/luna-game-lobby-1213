import React from 'react';

interface UserAvatarProps {
  name: string;
}

export function UserAvatar({ name }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {initials}
      </span>
    </div>
  );
}