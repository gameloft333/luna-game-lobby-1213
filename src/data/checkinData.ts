import { Gift, Gem, Crown, Coins, Trophy, Star, Diamond } from 'lucide-react';

export const CHECKIN_REWARDS = [
  {
    day: 1,
    icon: Gift,
    reward: { type: 'token', amount: 100, name: 'Tokens' },
  },
  {
    day: 2,
    icon: Gem,
    reward: { type: 'token', amount: 200, name: 'Tokens' },
  },
  {
    day: 3,
    icon: Coins,
    reward: { type: 'token', amount: 300, name: 'Tokens' },
  },
  {
    day: 4,
    icon: Star,
    reward: { type: 'item', amount: 1, name: 'Mystery Box' },
  },
  {
    day: 5,
    icon: Trophy,
    reward: { type: 'token', amount: 500, name: 'Tokens' },
  },
  {
    day: 6,
    icon: Crown,
    reward: { type: 'item', amount: 1, name: 'Rare Item' },
  },
  {
    day: 7,
    icon: Diamond,
    reward: { type: 'nft', amount: 1, name: 'Weekly NFT' },
  },
] as const;