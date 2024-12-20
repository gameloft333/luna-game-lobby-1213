import React from 'react';
import { useDiscussion } from '../../../hooks/useDiscussion';
import { Reply } from './Reply';
import { ReplyInput } from './ReplyInput';
import { DiscussionStats } from '../DiscussionList/DiscussionStats';
import { UserAvatar } from '../DiscussionList/UserAvatar';
import { Clock } from 'lucide-react';

interface DiscussionDetailProps {
  discussionId: number;
}

export function DiscussionDetail({ discussionId }: DiscussionDetailProps) {
  const { discussion, replies, loading } = useDiscussion(discussionId);

  if (loading || !discussion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Discussion Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-start gap-4">
          <UserAvatar name={discussion.author} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold dark:text-white mb-2">
              {discussion.title}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {discussion.author}
              </p>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {discussion.lastActive}
              </span>
            </div>
            <DiscussionStats
              replies={discussion.replies}
              participants={discussion.participants}
              className="mt-4"
            />
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        {replies.map((reply) => (
          <Reply key={reply.id} reply={reply} />
        ))}
      </div>

      {/* Reply Input */}
      <ReplyInput discussionId={discussionId} />
    </div>
  );
}