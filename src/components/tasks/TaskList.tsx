import React from 'react';
import { TaskCard } from './TaskCard';
import { Task, TaskState } from '../../types/tasks';

interface TaskListProps {
  tasks: Task[];
  state: TaskState;
  canClaimTask: (taskId: string, requiredProgress?: number) => boolean;
  onClaimTask: (task: Task) => void;
}

export function TaskList({
  tasks,
  state,
  canClaimTask,
  onClaimTask,
}: TaskListProps) {
  // Sort tasks: uncompleted first, then completed by completion time (newest first)
  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aCompleted = state.completedTasks.includes(a.id);
      const bCompleted = state.completedTasks.includes(b.id);
      
      if (aCompleted === bCompleted) {
        // If both completed or both uncompleted, sort by completion time (newest first)
        const aTime = state.lastClaimTime[a.id] || '';
        const bTime = state.lastClaimTime[b.id] || '';
        return bTime.localeCompare(aTime);
      }
      
      // Put uncompleted tasks first
      return aCompleted ? 1 : -1;
    });
  }, [tasks, state.completedTasks, state.lastClaimTime]);

  return (
    <div className="grid gap-6">
      {sortedTasks.map((task) => {
        const isCompleted = state.completedTasks.includes(task.id);
        const currentProgress = state.taskProgress[task.id] || 0;
        const canClaim = canClaimTask(task.id, task.total);

        return (
          <TaskCard
            key={task.id}
            task={task}
            isCompleted={isCompleted}
            currentProgress={currentProgress}
            canClaim={canClaim}
            onClaim={() => onClaimTask(task)}
          />
        );
      })}
    </div>
  );
}