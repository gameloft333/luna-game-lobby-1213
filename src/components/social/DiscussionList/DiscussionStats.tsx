import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface DiscussionStatsProps {
  replies: number;
  participants: number;
  className?: string;
}

export function DiscussionStats({ replies, participants, className }: DiscussionStatsProps) {
  return (
    <div className={cn("flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400", className)}>
      <div className="flex items-center gap-1.5">
        <MessageSquare className="w-4 h-4" />
        <span>{replies} replies</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4" />
        <span>{participants} participants</span>
      </div>
    </div>
  );
}