import React from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../lib/utils';

interface ReplyInputProps {
  discussionId: number;
  onSubmit: (content: string) => void;
}

export function ReplyInput({ discussionId, onSubmit }: ReplyInputProps) {
  const { user } = useAuth();
  const [content, setContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="sticky bottom-20 md:bottom-6">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Please sign in to reply
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-20 md:bottom-6">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 bg-transparent border-none focus:outline-none dark:text-white"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              content.trim()
                ? "text-blue-500 hover:bg-blue-500/10"
                : "text-gray-400"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}