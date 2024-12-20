import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { INVITE_REWARDS } from '../../../config/inviteRewards';
import { RewardAnimation } from '../../shared/RewardAnimation';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { Check } from 'lucide-react';

export function InviteRewardsList({
  currentProgress,
  claimedRewards,
  setClaimedRewards,
  testMode = false,
  onAddInvite,
  onReset
}: {
  currentProgress: number;
  claimedRewards: string[];
  setClaimedRewards: (rewards: string[]) => void;
  testMode?: boolean;
  onAddInvite: (count: number) => void;
  onReset: () => void;
}) {
  const { updateTokens } = useUserProfile();
  const { user } = useAuth();
  const [showReward, setShowReward] = React.useState(false);
  const [currentReward, setCurrentReward] = React.useState<any>(null);

  const handleClaim = async (reward: any) => {
    if (!user?.uid) return;
    
    try {
      if (reward.reward.type === 'token') {
        const success = await updateTokens(
          reward.reward.amount,
          'invite_reward',
          `Invite reward: ${reward.friendCount} friends`
        );
        
        if (!success) {
          toast.error('Failed to update tokens');
          return;
        }
      }

      if (testMode) {
        const newClaimed = [...claimedRewards, reward.id];
        setClaimedRewards(newClaimed);
        localStorage.setItem('testInviteRewards', JSON.stringify({
          progress: currentProgress,
          claimed: newClaimed
        }));
      } else {
        const docRef = doc(db, 'userInvites', user.uid);
        await updateDoc(docRef, {
          claimedRewards: arrayUnion(reward.id)
        });
      }

      setCurrentReward(reward.reward);
      setShowReward(true);
      toast.success('奖励领取成功！');
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('领取失败，请重试');
    }
  };

  const maxFriends = Math.max(...INVITE_REWARDS.map(r => r.friendCount));
  const progress = (currentProgress / maxFriends) * 100;

  return (
    <div className="fixed bottom-[130px] left-0 right-0 bg-white dark:bg-gray-900">
      {testMode && (
        <div className="fixed top-50 right-56 z-100 flex items-center gap-2">
          <button
            onClick={() => onAddInvite(1)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600"
          >
            +1
          </button>
          <button
            onClick={() => onAddInvite(5)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600"
          >
            +5
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600"
          >
            重置
          </button>
        </div>
      )}

      <div className="relative px-8 py-6">
        {/* 背景进度条 */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />
        
        {/* 活跃进度条 */}
        <div 
          className="absolute top-12 left-0 h-1 bg-blue-500 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />

        {/* 奖励图标列表 */}
        <div className="relative flex justify-between items-start">
          {INVITE_REWARDS.map((reward, index) => {
            const isClaimed = claimedRewards?.includes(reward.id);
            const Icon = reward.icon;
            
            return (
              <div key={reward.id} className="flex flex-col items-center">
                <div className="relative">
                  <div className={cn(
                    "w-14 h-14",
                    "rounded-full flex items-center justify-center",
                    isClaimed ? "bg-green-500" : "bg-blue-500"
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  {isClaimed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-sm font-medium">
                    Invite {reward.friendCount}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {reward.reward.amount} {reward.reward.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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