import React from 'react';
import { TaskState } from '../types/tasks';

const STORAGE_KEY = 'task-rewards-state';

export function useTaskRewards(testMode = false) {
  const [state, setState] = React.useState<TaskState>(() => {
    if (testMode) {
      return {
        completedTasks: [],
        lastClaimTime: {},
        taskProgress: {
          'daily-games': 0,
        }
      };
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      completedTasks: [],
      lastClaimTime: {},
      taskProgress: {
        'daily-games': 0,
      }
    };
  });

  const canClaimTask = React.useCallback((taskId: string, requiredProgress?: number) => {
    if (testMode) return true;

    if (state.completedTasks.includes(taskId)) return false;

    if (taskId.startsWith('daily-')) {
      const lastClaim = state.lastClaimTime[taskId];
      if (lastClaim === new Date().toDateString()) return false;
    }

    if (requiredProgress !== undefined) {
      const currentProgress = state.taskProgress[taskId] || 0;
      if (currentProgress < requiredProgress) return false;
    }

    return true;
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

  const resetTasks = React.useCallback(() => {
    if (!testMode) return;
    
    setState({
      completedTasks: [],
      lastClaimTime: {},
      taskProgress: {
        'daily-games': 0,
      }
    });
    
    localStorage.removeItem(STORAGE_KEY);
  }, [testMode]);

  return {
    state,
    canClaimTask,
    claimTask,
    updateTaskProgress,
    resetTasks
  };
}