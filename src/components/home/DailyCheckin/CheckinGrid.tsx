import React from 'react';
import { CheckinDay } from './CheckinDay';
import { CHECKIN_REWARDS } from './data';
import { cn } from '../../../lib/utils';
import { Check } from 'lucide-react';

interface CheckinGridProps {
  rewards: typeof CHECKIN_REWARDS;
  completedDays: number[];
  canClaimToday: (day: number) => boolean;
  onClaim: (day: number) => void;
}

export function CheckinGrid({ rewards, completedDays, canClaimToday, onClaim }: CheckinGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {rewards.map((reward, index) => {
        const day = index + 1;
        const isCompleted = completedDays.includes(day);
        const isActive = canClaimToday(day);

        return (
          <CheckinDay
            key={day}
            day={day}
            icon={reward.icon}
            isCompleted={isCompleted}
            isActive={isActive}
            onClick={() => isActive && onClaim(day)}
            reward={reward.reward}
          />
        );
      })}
    </div>
  );
}