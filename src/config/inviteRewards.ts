import { Gift, Users, Crown, Trophy, Diamond } from 'lucide-react';
import type { InviteReward } from '../types/invite';

export const INVITE_REWARDS: InviteReward[] = [
  {
    id: 'invite-1',
    friendCount: 1,
    icon: Gift,
    reward: {
      type: 'token',
      amount: 100,
      name: 'Tokens'
    },
    title: 'First Friend',
    description: 'Invite your first friend'
  },
  {
    id: 'invite-3',
    friendCount: 3,
    icon: Users,
    reward: {
      type: 'token',
      amount: 300,
      name: 'Tokens'
    },
    title: 'Growing Circle',
    description: 'Invite 3 friends'
  },
  {
    id: 'invite-5',
    friendCount: 5,
    icon: Crown,
    reward: {
      type: 'item',
      amount: 1,
      name: 'Mystery Box'
    },
    title: 'Social Butterfly',
    description: 'Invite 5 friends'
  },
  {
    id: 'invite-10',
    friendCount: 10,
    icon: Trophy,
    reward: {
      type: 'token',
      amount: 1000,
      name: 'Tokens'
    },
    title: 'Party Leader',
    description: 'Invite 10 friends'
  },
  {
    id: 'invite-20',
    friendCount: 20,
    icon: Diamond,
    reward: {
      type: 'nft',
      amount: 1,
      name: 'Exclusive NFT'
    },
    title: 'Community Champion',
    description: 'Invite 20 friends'
  }
];