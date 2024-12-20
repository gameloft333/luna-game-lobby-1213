import React from 'react';
import { DiscussionList } from '../components/social/DiscussionList/DiscussionList';
import { DiscussionDetail } from '../components/social/DiscussionDetail/DiscussionDetail';
import { FloatingActionButton } from '../components/social/FloatingActionButton';
import { NewDiscussionForm } from '../components/social/NewDiscussionForm';
import { InviteButton } from '../components/social/InviteButton';
import { useDiscussions } from '../hooks/useDiscussions';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Community() {
  const { discussions, loading } = useDiscussions();
  const [selectedDiscussion, setSelectedDiscussion] = React.useState<number | null>(null);
  const [showNewDiscussionForm, setShowNewDiscussionForm] = React.useState(false);

  const handleBack = () => {
    setSelectedDiscussion(null);
  };

  const handleNewDiscussion = () => {
    setShowNewDiscussionForm(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-theme(spacing.20))] md:min-h-screen pb-24">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {selectedDiscussion ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Discussions</span>
              </button>
              <DiscussionDetail discussionId={selectedDiscussion} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Community</h1>
                <FloatingActionButton 
                  onClick={handleNewDiscussion}
                  className="static"
                />
              </div>

              <DiscussionList 
                discussions={discussions} 
                onDiscussionClick={(id) => setSelectedDiscussion(id)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedDiscussion && (
          <FloatingActionButton onClick={handleNewDiscussion} />
        )}

        {/* New Discussion Form */}
        {showNewDiscussionForm && (
          <NewDiscussionForm onClose={() => setShowNewDiscussionForm(false)} />
        )}
      </div>

      {/* Sticky Invite Button */}
      <InviteButton />
    </div>
  );
}