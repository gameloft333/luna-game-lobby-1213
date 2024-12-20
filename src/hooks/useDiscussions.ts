import { useState, useEffect } from 'react';
import { useDiscussionsStore } from '../store/discussions';
import type { Discussion } from '../types/social';

export function useDiscussions() {
  const store = useDiscussionsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get discussions from store with real-time reply counts
  const discussions = store.discussions.map(discussion => ({
    ...discussion,
    replies: (store.replies[discussion.id] || []).length,
    participants: new Set(
      (store.replies[discussion.id] || []).map(reply => reply.author)
    ).size,
  }));

  return { discussions, loading, error };
}