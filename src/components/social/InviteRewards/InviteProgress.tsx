import React from 'react';
import { cn } from '../../../lib/utils';

interface InviteProgressProps {
  current: number;
  required: number;
  className?: string;
}

export function InviteProgress({ current, required, className }: InviteProgressProps) {
  const progress = Math.min((current / required) * 100, 100);
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {current}/{required} friends invited
      </p>
    </div>
  );
}