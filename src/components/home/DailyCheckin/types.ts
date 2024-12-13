export interface CheckinReward {
  day: number;
  icon: string;
  reward: {
    type: 'token' | 'item' | 'nft';
    amount: number;
    name: string;
  };
}

export interface CheckinState {
  lastCheckin: string | null;
  completedDays: number[];
  currentWeek: number;
}