export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  tokens: number;
  invitedCount: number;
  purchaseCount: number;
  totalSpent: number;
  createdAt: string;
  invitedBy?: string;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'daily_login' | 'invite_reward' | 'post_reward' | 'purchase';
  timestamp: string;
  description: string;
}