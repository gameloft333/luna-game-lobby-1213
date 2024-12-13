import { LucideIcon } from 'lucide-react';
import { Reward } from '../components/shared/RewardAnimation';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: Reward;
  type: 'daily' | 'weekly';
  icon: LucideIcon;
  progress?: number;
  total?: number;
}

export interface TaskState {
  completedTasks: string[];
  lastClaimTime: Record<string, string>;
  taskProgress: Record<string, number>;
}