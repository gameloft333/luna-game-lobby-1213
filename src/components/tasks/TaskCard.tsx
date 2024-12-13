import React from 'react';
import { Gift } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Task } from '../../types/tasks';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  currentProgress: number;
  canClaim: boolean;
  onClaim: () => void;
}

export function TaskCard({
  task,
  isCompleted,
  currentProgress,
  canClaim,
  onClaim,
}: TaskCardProps) {
  const Icon = task.icon;
  const hasProgressRequirement = task.total !== undefined;
  const progressMet = hasProgressRequirement 
    ? currentProgress >= (task.total || 0)
    : true;

  const isClaimable = !isCompleted && canClaim && progressMet;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            isCompleted
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold dark:text-white">{task.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
          {hasProgressRequirement && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((currentProgress / (task.total || 1)) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Progress: {currentProgress}/{task.total}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Gift className="h-4 w-4" />
          <span>{task.reward.amount} {task.reward.name}</span>
        </div>
        <button
          onClick={onClaim}
          className={cn(
            'px-4 py-2 rounded-lg transition-colors',
            isCompleted
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : isClaimable
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          )}
          disabled={!isClaimable}
        >
          {isCompleted 
            ? 'Claimed' 
            : !progressMet 
            ? `Progress ${currentProgress}/${task.total}`
            : 'Claim'
          }
        </button>
      </div>
    </div>
  );
}