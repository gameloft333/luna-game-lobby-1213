import React from 'react';
import { Gift } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Reward } from '../../types/tasks';

interface TaskRewardProps {
  reward: Reward;
  className?: string;
}

export function TaskReward({ reward, className }: TaskRewardProps) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1 rounded-full",
      "bg-blue-500/10 border border-blue-500/20",
      "dark:bg-blue-900/20 dark:border-blue-500/20",
      className
    )}>
      <Gift className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {reward.amount} {reward.name}
      </span>
    </div>
  );
}