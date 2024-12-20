import React from 'react';
import { MessageSquare, Users, Clock } from 'lucide-react';
import { Discussion } from '../../../types/social';
import { DiscussionStats } from './DiscussionStats';
import { UserAvatar } from './UserAvatar';

interface DiscussionCardProps {
  discussion: Discussion;
  onClick: () => void;
}

export function DiscussionCard({ discussion, onClick }: DiscussionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-800 p-3 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <UserAvatar name={discussion.author} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                {discussion.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {discussion.author}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <Clock className="w-4 h-4" />
              {discussion.lastActive}
            </span>
          </div>

          <DiscussionStats
            replies={discussion.replies}
            participants={discussion.participants}
            className="mt-2"
          />
        </div>
      </div>
    </button>
  );
}