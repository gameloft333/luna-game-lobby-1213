import { Calendar, Trophy } from 'lucide-react';
import { Task } from '../types/tasks';

export const TASKS: Task[] = [
  {
    id: 'daily-login',
    title: 'Daily Login',
    description: 'Log in to the platform',
    reward: { type: 'token', amount: 10, name: 'tokens' },
    type: 'daily',
    icon: Calendar,
  },
  {
    id: 'daily-games',
    title: 'Play 3 Games',
    description: 'Play any three games',
    reward: { type: 'token', amount: 50, name: 'tokens' },
    type: 'daily',
    icon: Calendar,
    progress: 0,
    total: 3,
  },
  {
    id: 'weekly-tournament',
    title: 'Weekly Tournament',
    description: 'Participate in the weekly tournament',
    reward: { type: 'token', amount: 200, name: 'tokens' },
    type: 'weekly',
    icon: Trophy,
  },
];