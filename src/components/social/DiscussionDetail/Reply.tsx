import React from 'react';
import { UserAvatar } from '../DiscussionList/UserAvatar';
import { Clock, Heart, MessageSquare } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { DiscussionReply } from '../../../types/social';

interface ReplyProps {
  reply: DiscussionReply;
}

export function Reply({ reply }: ReplyProps) {
  const [liked, setLiked] = React.useState(false);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex gap-4">
        <UserAvatar name={reply.author} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium dark:text-white">{reply.author}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {reply.timestamp}
              </span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                liked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
              <span>{reply.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}