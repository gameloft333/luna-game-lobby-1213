import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskState } from '../types/tasks';

interface TaskStore extends TaskState {
  updateProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  resetDailyTasks: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      completedTasks: [],
      lastClaimTime: {},
      taskProgress: {
        'daily-games': 0,
      },
      updateProgress: (taskId, progress) =>
        set((state) => ({
          taskProgress: {
            ...state.taskProgress,
            [taskId]: progress,
          },
        })),
      completeTask: (taskId) =>
        set((state) => ({
          completedTasks: [...state.completedTasks, taskId],
          lastClaimTime: {
            ...state.lastClaimTime,
            [taskId]: new Date().toDateString(),
          },
        })),
      resetDailyTasks: () =>
        set((state) => ({
          completedTasks: state.completedTasks.filter(
            (taskId) => !taskId.startsWith('daily-')
          ),
          taskProgress: {
            'daily-games': 0,
          },
        })),
    }),
    {
      name: 'task-storage',
    }
  )
);