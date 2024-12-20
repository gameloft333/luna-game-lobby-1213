import { LucideIcon } from 'lucide-react';
import { Reward } from '../components/shared/RewardAnimation';

export interface InviteReward {
  id: string;
  friendCount: number;
  icon: LucideIcon;
  reward: Reward;
  title: string;
  description: string;
}

export interface InviteState {
  invitedFriends: string[];
  claimedRewards: string[];
}