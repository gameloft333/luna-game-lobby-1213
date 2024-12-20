import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { InviteProgress } from './InviteProgress';
import type { InviteReward } from '../../../types/invite';

interface InviteRewardCardProps {
  reward: InviteReward;
  currentCount: number;
  isClaimed: boolean;
  canClaim: boolean;
  onClaim: () => void;
}

export function InviteRewardCard({
  reward,
  currentCount,
  isClaimed,
  canClaim,
  onClaim
}: InviteRewardCardProps) {
  const Icon = reward.icon;
  const isClaimable = !isClaimed && canClaim;

  return (
    <div className={cn(
      "relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
      "border border-gray-200 dark:border-gray-800 rounded-xl p-4",
      "transition-all duration-300",
      isClaimable && "hover:border-blue-500/50"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-lg",
          "flex items-center justify-center",
          isClaimed ? "bg-green-500/10" : "bg-blue-500/10"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            isClaimed ? "text-green-500" : "text-blue-500"
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium dark:text-white">{reward.title}</h3>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {reward.reward.amount} {reward.reward.name}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {reward.description}
          </p>

          <InviteProgress
            current={currentCount}
            required={reward.friendCount}
          />
        </div>

        {isClaimed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
    </div>
  );
}