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
        'relative aspect-square rounded-xl flex flex-col items-center justify-center p-4',
        'transition-all duration-300 border',
        isCompleted && 'bg-green-500/10 border-green-500/20 dark:bg-green-900/20 dark:border-green-500/20',
        isActive && 'bg-blue-500/10 border-blue-500/20 dark:bg-blue-900/20 dark:border-blue-500/20 cursor-pointer',
        !isCompleted && !isActive && 'bg-gray-100 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700/50 opacity-50 cursor-not-allowed'
      )}
    >
      <div className={cn(
        'relative transition-transform duration-300',
        (isCompleted || isActive) && 'scale-110'
      )}>
        <Icon className={cn(
          'h-8 w-8',
          'transition-colors duration-300',
          isCompleted && 'text-green-500 dark:text-green-400',
          isActive && 'text-blue-500 dark:text-blue-400',
          !isCompleted && !isActive && 'text-gray-400 dark:text-gray-500'
        )} />
        {(isCompleted || isActive) && (
          <div className={cn(
            'absolute -inset-3 rounded-full -z-10 animate-pulse',
            isCompleted ? 'bg-green-500/20' : 'bg-blue-500/20'
          )} />
        )}
      </div>
      
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">Day {day}</div>
        <div className="text-xs text-blue-600 dark:text-blue-400">
          {reward.amount} {reward.name}
        </div>
      </div>
    </motion.button>
  );
}