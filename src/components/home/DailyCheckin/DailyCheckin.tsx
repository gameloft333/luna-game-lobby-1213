import React from 'react';
import { CHECKIN_REWARDS } from './data';
import { CheckinDay } from './CheckinDay';
import { RewardAnimation } from './RewardAnimation';
import { useCheckin } from './hooks/useCheckin';

interface DailyCheckinProps {
  testMode?: boolean;
}

export function DailyCheckin({ testMode = false }: DailyCheckinProps) {
  const { state, canClaimToday, claim } = useCheckin(testMode);
  const [showReward, setShowReward] = React.useState(false);
  const [currentReward, setCurrentReward] = React.useState(CHECKIN_REWARDS[0].reward);

  const handleClaim = (day: number) => {
    const success = claim(day);
    if (success) {
      setCurrentReward(CHECKIN_REWARDS[day - 1].reward);
      setShowReward(true);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold dark:text-white">
          Daily Check-in
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Week {state.currentWeek}
          </span>
          {testMode && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Test Mode
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {CHECKIN_REWARDS.map(({ day, icon, reward }) => (
          <CheckinDay
            key={day}
            day={day}
            icon={icon}
            reward={reward}
            isCompleted={state.completedDays.includes(day)}
            isActive={canClaimToday(day)}
            onClick={() => handleClaim(day)}
          />
        ))}
      </div>

      <RewardAnimation
        reward={currentReward}
        isVisible={showReward}
        onComplete={() => setShowReward(false)}
      />
    </section>
  );
}