import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Discussion, DiscussionReply } from '../types/social';
import { MOCK_DISCUSSIONS, MOCK_REPLIES } from '../data/discussionsData';

interface DiscussionsState {
  discussions: Discussion[];
  replies: Record<number, DiscussionReply[]>;
  addReply: (discussionId: number, content: string, author: string) => void;
  addDiscussion: (discussion: Discussion, content: string) => void;
}

export const useDiscussionsStore = create<DiscussionsState>()(
  persist(
    (set) => ({
      discussions: MOCK_DISCUSSIONS,
      replies: MOCK_REPLIES,
      addReply: (discussionId, content, author) => set((state) => {
        const existingReplies = state.replies[discussionId] || [];
        const newReply: DiscussionReply = {
          id: Date.now(),
          author,
          content,
          timestamp: 'Just now',
          likes: 0,
        };

        const updatedReplies = {
          ...state.replies,
          [discussionId]: [...existingReplies, newReply],
        };

        const participants = new Set([
          ...existingReplies.map(r => r.author),
          author
        ]);

        const updatedDiscussions = state.discussions.map(discussion =>
          discussion.id === discussionId
            ? {
                ...discussion,
                replies: existingReplies.length + 1,
                lastActive: 'Just now',
                participants: participants.size,
              }
            : discussion
        );

        return {
          discussions: updatedDiscussions,
          replies: updatedReplies,
        };
      }),
      addDiscussion: (discussion, content) => set((state) => {
        const newDiscussion = {
          ...discussion,
          replies: 1,
          participants: 1,
        };

        const initialReply: DiscussionReply = {
          id: Date.now(),
          author: discussion.author,
          content,
          timestamp: 'Just now',
          likes: 0,
        };

        return {
          discussions: [newDiscussion, ...state.discussions],
          replies: {
            ...state.replies,
            [discussion.id]: [initialReply],
          },
        };
      }),
    }),
    {
      name: 'discussions-storage',
    }
  )
);