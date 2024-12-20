import React from 'react';
import { useDiscussionsStore } from '../../store/discussions';
import { useAuth } from '../../hooks/useAuth';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NewDiscussionFormProps {
  onClose: () => void;
}

export function NewDiscussionForm({ onClose }: NewDiscussionFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const store = useDiscussionsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newDiscussion = {
        id: Date.now(),
        title: title.trim(),
        author: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        replies: 0,
        participants: 0,
        lastActive: 'Just now',
      };

      store.addDiscussion(newDiscussion, content.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full mt-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white">Create New Discussion</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter discussion title"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your discussion content..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white min-h-[150px]"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className={cn(
                "px-4 py-2 rounded-lg font-medium",
                "bg-blue-500 text-white",
                "hover:bg-blue-600",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Create Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}