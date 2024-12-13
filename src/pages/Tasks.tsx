import React from 'react';
import { useSettingsStore } from '../store/settings';
import { useTaskSystem } from '../hooks/useTaskSystem';
import { RewardAnimation } from '../components/shared/RewardAnimation';
import { TaskList } from '../components/tasks/TaskList';
import { TASKS } from '../data/tasksData';
import { Task } from '../types/tasks';

export default function Tasks() {
  const { testMode } = useSettingsStore();
  const { state, canClaimTask, claimTask } = useTaskSystem(testMode);
  const [showReward, setShowReward] = React.useState(false);
  const [currentReward, setCurrentReward] = React.useState<Task['reward'] | null>(null);

  const handleClaim = (task: Task) => {
    if (task.total && (state.taskProgress[task.id] || 0) < task.total) {
      return; // Cannot claim if progress requirement not met
    }
    
    const success = claimTask(task);
    if (success) {
      setCurrentReward(task.reward);
      setShowReward(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Task Center</h1>
        {testMode && (
          <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Test Mode
          </span>
        )}
      </div>

      <TaskList
        tasks={TASKS}
        state={state}
        canClaimTask={canClaimTask}
        onClaimTask={handleClaim}
      />

      {currentReward && (
        <RewardAnimation
          reward={currentReward}
          isVisible={showReward}
          onComplete={() => setShowReward(false)}
        />
      )}
    </div>
  );
}