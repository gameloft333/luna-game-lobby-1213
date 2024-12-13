import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckinReward } from './types';

interface RewardAnimationProps {
  reward: CheckinReward['reward'];
  isVisible: boolean;
  onComplete: () => void;
}

export function RewardAnimation({ reward, isVisible, onComplete }: RewardAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={onComplete}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360, 360],
              }}
              transition={{ duration: 1.5 }}
              className="text-6xl mb-4"
            >
              {reward.type === 'token' ? '🪙' : reward.type === 'item' ? '🎁' : '🏆'}
            </motion.div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">
              Reward Claimed!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You received {reward.amount} {reward.name}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}