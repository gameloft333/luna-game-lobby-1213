import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InviteState } from '../types/invite';

interface InviteStore extends InviteState {
  addInvitedFriend: (friendId: string) => void;
  claimReward: (rewardId: string) => void;
}

export const useInviteStore = create<InviteStore>()(
  persist(
    (set) => ({
      invitedFriends: [],
      claimedRewards: [],
      
      addInvitedFriend: (friendId) => 
        set((state) => ({
          invitedFriends: [...state.invitedFriends, friendId]
        })),
        
      claimReward: (rewardId) =>
        set((state) => ({
          claimedRewards: [...state.claimedRewards, rewardId]
        })),
    }),
    {
      name: 'invite-storage'
    }
  )
);