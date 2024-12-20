import { useState, useEffect } from 'react';
import { useDiscussionsStore } from '../store/discussions';
import { useAuth } from './useAuth';
import type { Discussion, DiscussionReply } from '../types/social';

export function useDiscussion(discussionId: number) {
  const { user } = useAuth();
  const store = useDiscussionsStore();
  const [loading, setLoading] = useState(true);

  const discussion = store.discussions.find(d => d.id === discussionId) || null;
  const replies = store.replies[discussionId] || [];

  useEffect(() => {
    setLoading(false);
  }, [discussionId]);

  const addReply = (content: string) => {
    if (!user) return;
    store.addReply(
      discussionId,
      content,
      user.displayName || user.email?.split('@')[0] || 'Anonymous'
    );
  };

  return { discussion, replies, loading, addReply };
}