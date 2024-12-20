import React from 'react';
import { cn } from '../../lib/utils';

interface TaskProgressProps {
  current: number;
  total: number;
}

export function TaskProgress({ current, total }: TaskProgressProps) {
  const progress = Math.min((current / total) * 100, 100);
  
  return (
    <div className="space-y-1.5">
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Progress: {current}/{total}
      </p>
    </div>
  );
}