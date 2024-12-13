import { useCallback, useEffect } from 'react';
import { useTaskStore } from '../store/tasks';
import { Task } from '../types/tasks';

export function useTaskSystem(testMode = false) {
  const state = useTaskStore();

  const canClaimTask = useCallback(
    (taskId: string, requiredProgress?: number) => {
      if (testMode) return true;

      const today = new Date().toDateString();
      const lastClaim = state.lastClaimTime[taskId];
      const hasntClaimedToday = lastClaim !== today;
      const isNotCompleted = !state.completedTasks.includes(taskId);

      if (requiredProgress !== undefined) {
        const currentProgress = state.taskProgress[taskId] || 0;
        return isNotCompleted && hasntClaimedToday && currentProgress >= requiredProgress;
      }

      return isNotCompleted && hasntClaimedToday;
    },
    [state.lastClaimTime, state.completedTasks, state.taskProgress, testMode]
  );

  const claimTask = useCallback(
    (task: Task) => {
      if (!canClaimTask(task.id, task.total)) {
        return false;
      }

      useTaskStore.getState().completeTask(task.id);
      return true;
    },
    [canClaimTask]
  );

  // Reset daily tasks at midnight
  useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      setTimeout(() => {
        useTaskStore.getState().resetDailyTasks();
        checkNewDay();
      }, timeUntilMidnight);
    };

    checkNewDay();
  }, []);

  return {
    state,
    canClaimTask,
    claimTask,
    updateProgress: useTaskStore.getState().updateProgress,
  };
}