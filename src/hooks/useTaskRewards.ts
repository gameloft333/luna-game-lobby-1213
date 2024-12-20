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
      }
    };
  });

  const canClaimTask = React.useCallback((task: Task) => {
    if (testMode) return true;
    
    // 如果任务已完成，不能再次领取
    if (state.completedTasks.includes(task.id)) {
      return false;
    }

    // 检查进度要求
    if (task.total && (state.taskProgress[task.id] || 0) < task.total) {
      return false;
    }

    // 检查每日任务重置
    if (task.daily) {
      const lastClaim = state.lastClaimTime[task.id];
      if (lastClaim === new Date().toDateString()) {
        return false;
      }
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

  const claimTask = React.useCallback((task: Task) => {
    if (!canClaimTask(task) && !testMode) return false;

    setState(prev => {
      const newState = {
        ...prev,
        completedTasks: [...prev.completedTasks, task.id],
        lastClaimTime: {
          ...prev.lastClaimTime,
          [task.id]: new Date().toDateString(),
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