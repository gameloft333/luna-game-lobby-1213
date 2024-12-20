import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Task } from '../../types/tasks';
import { TaskProgress } from './TaskProgress';
import { TaskReward } from './TaskReward';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
        "border border-gray-200 dark:border-gray-800",
        "rounded-xl transition-all duration-300",
        isClaimable && "hover:border-blue-500/50 dark:hover:border-blue-500/50",
        isCompleted && "bg-green-500/5 dark:bg-green-900/5"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      <div className="relative p-3 sm:p-4 flex items-center gap-3">
        {/* Icon Container */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center",
          "transition-colors duration-300",
          isCompleted
            ? "bg-green-500/10 dark:bg-green-900/20"
            : "bg-blue-500/10 dark:bg-blue-900/20"
        )}>
          <Icon className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300",
            isCompleted
              ? "text-green-500 dark:text-green-400"
              : "text-blue-500 dark:text-blue-400"
          )} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {task.title}
            </h3>
            <TaskReward 
              reward={task.reward} 
              className="flex-shrink-0"
            />
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
            {task.description}
          </p>

          {hasProgressRequirement && (
            <TaskProgress current={currentProgress} total={task.total || 0} />
          )}
        </div>

        {/* Claim Button - Now on the right */}
        <div className="flex-shrink-0 ml-2">
          <button
            onClick={onClaim}
            disabled={!isClaimable}
            className={cn(
              "px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300",
              "flex items-center justify-center whitespace-nowrap",
              isCompleted && "bg-green-500/10 text-green-600 dark:text-green-400 cursor-not-allowed",
              isClaimable && "bg-blue-500 hover:bg-blue-600 text-white",
              !isClaimable && !isCompleted && "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            )}
          >
            {isCompleted 
              ? 'Claimed'
              : !progressMet
              ? `${currentProgress}/${task.total}`
              : 'Claim'
            }
          </button>
        </div>
      </div>

      {/* Completion Indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white text-xs"
            >
              ✓
            </motion.span>
          </div>
        </div>
      )}
    </motion.div>
  );
}