import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckinReward } from './types';

interface RewardPopupProps {
  reward: CheckinReward['reward'];
  isVisible: boolean;
  onClose: () => void;
}

export function RewardPopup({ reward, isVisible, onClose }: RewardPopupProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isVisible && reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gradient-to-br from-red-500/90 via-orange-400/90 to-yellow-500/90 p-[2px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/95 dark:bg-gray-900/95 rounded-xl p-6 text-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent)]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="relative mb-4"
              >
                <reward.icon className="w-20 h-20 text-primary mx-auto filter drop-shadow-lg" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                {t('rewards.claimed')}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                {reward.amount} {reward.name}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}