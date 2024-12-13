import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface CheckinDayProps {
  day: number;
  icon: LucideIcon;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
  reward: {
    amount: number;
    name: string;
  };
}

export function CheckinDay({ 
  day, 
  icon: Icon, 
  isCompleted, 
  isActive,
  onClick,
  reward,
}: CheckinDayProps) {
  return (
    <motion.button
      whileHover={isActive ? { scale: 1.05 } : {}}
      whileTap={isActive ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        'relative aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all',
        isCompleted && 'bg-green-100 dark:bg-green-900/20 cursor-default',
        isActive && 'bg-blue-100 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/30',
        !isCompleted && !isActive && 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
      )}
    >
      <Icon className={cn(
        'h-6 w-6',
        isCompleted && 'text-green-600 dark:text-green-400',
        isActive && 'text-blue-600 dark:text-blue-400',
        !isCompleted && !isActive && 'text-gray-400 dark:text-gray-500'
      )} />
      <span className="text-xs font-medium dark:text-white">Day {day}</span>
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {reward.amount} {reward.name}
      </span>
      {isCompleted && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white text-xs"
          >
            ✓
          </motion.span>
        </div>
      )}
    </motion.button>
  );
}