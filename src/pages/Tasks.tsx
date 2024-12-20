import React from 'react';
import { useSettingsStore } from '../store/settings';
import { useTaskRewards } from '../hooks/useTaskRewards';
import { RewardAnimation } from '../components/shared/RewardAnimation';
import { TaskList } from '../components/tasks/TaskList';
import { TASKS } from '../data/tasksData';
import { Task } from '../types/tasks';
import { useUserProfile } from '../hooks/useUserProfile';
import { toast } from 'react-hot-toast';

export default function Tasks() {
  const { testMode } = useSettingsStore();
  const { state, canClaimTask, claimTask, resetTasks } = useTaskRewards(testMode);
  const { updateTokens } = useUserProfile();
  const [showReward, setShowReward] = React.useState(false);
  const [currentReward, setCurrentReward] = React.useState<Task['reward'] | null>(null);

  const handleClaim = async (task: Task) => {
    if (task.total && (state.taskProgress[task.id] || 0) < task.total) {
      return; // Cannot claim if progress requirement not met
    }
    
    const success = claimTask(task);
    if (success) {
      if (task.reward.type === 'token') {
        const tokenSuccess = await updateTokens(
          task.reward.amount,
          'post_reward',
          `Task reward: ${task.title}`
        );
        if (!tokenSuccess) {
          toast.error('Failed to update tokens');
          return;
        }
      }
      
      setCurrentReward(task.reward);
      setShowReward(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Task Center</h1>
        {testMode && (
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Test Mode
            </span>
            <button
              onClick={resetTasks}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Reset Tasks
            </button>
          </div>
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