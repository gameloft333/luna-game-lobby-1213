import React from 'react';
import { TaskState } from '../types/tasks';

const STORAGE_KEY = 'task-rewards-state';

export function useTaskRewards(testMode = false) {
  const [state, setState] = React.useState<TaskState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      completedTasks: [],
      lastClaimTime: {},
      taskProgress: {
        'daily-games': 0,
      },
    };
  });

  const canClaimTask = React.useCallback((taskId: string, requiredProgress?: number) => {
    if (testMode) return true;

    const today = new Date().toDateString();
    const lastClaim = state.lastClaimTime[taskId];
    const hasntClaimedToday = lastClaim !== today;
    const isNotCompleted = !state.completedTasks.includes(taskId);
    
    // Check if task has progress requirements
    if (requiredProgress !== undefined) {
      const currentProgress = state.taskProgress[taskId] || 0;
      return isNotCompleted && hasntClaimedToday && currentProgress >= requiredProgress;
    }

    return isNotCompleted && hasntClaimedToday;
  }, [state.completedTasks, state.lastClaimTime, state.taskProgress, testMode]);

  const updateTaskProgress = React.useCallback((taskId: string, progress: number) => {
    setState(prev => {
      const newState = {
        ...prev,
        taskProgress: {
          ...prev.taskProgress,
          [taskId]: progress,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const claimTask = React.useCallback((taskId: string, requiredProgress?: number) => {
    if (!canClaimTask(taskId, requiredProgress) && !testMode) return false;

    setState(prev => {
      const newState = {
        ...prev,
        completedTasks: [...prev.completedTasks, taskId],
        lastClaimTime: {
          ...prev.lastClaimTime,
          [taskId]: new Date().toDateString(),
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });

    return true;
  }, [canClaimTask, testMode]);

  // Reset daily tasks at midnight
  React.useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          completedTasks: prev.completedTasks.filter(taskId => 
            !taskId.startsWith('daily-')
          ),
          taskProgress: {
            'daily-games': 0,
          },
        }));
        checkNewDay();
      }, timeUntilMidnight);
    };

    checkNewDay();
  }, []);

  return {
    state,
    canClaimTask,
    claimTask,
    updateTaskProgress,
  };
}