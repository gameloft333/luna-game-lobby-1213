import React, { useState, useEffect } from 'react';
import { CheckinGrid } from './CheckinGrid';
import { CHECKIN_REWARDS } from './data';
import { useAuth } from '../../../hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { RewardPopup } from './RewardPopup';
import { useUserProfile } from '../../../hooks/useUserProfile';

interface CheckinData {
  lastCheckIn: string;
  completedDays: number[];
}

export function DailyCheckin({ testMode }: { testMode: boolean }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { profile, updateTokens } = useUserProfile();
  const [checkinData, setCheckinData] = useState<CheckinData>({ 
    lastCheckIn: '', 
    completedDays: [] 
  });
  const [loading, setLoading] = useState(true);
  const [currentReward, setCurrentReward] = useState<(typeof CHECKIN_REWARDS)[0] | null>(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (user?.uid || testMode) {
      loadCheckinData();
    } else {
      // 未登录用户直接设置 loading 为 false
      setLoading(false);
    }
  }, [user?.uid, testMode]);

  const loadCheckinData = async () => {
    try {
      if (!user?.uid && !testMode) {
        console.warn('No user ID available for checkin data');
        return;
      }
      
      const userId = user?.uid || 'test';
      console.log('Loading checkin data for user:', userId);
      
      const docRef = doc(db, 'userCheckins', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Checkin data found:', docSnap.data());
        setCheckinData(docSnap.data() as CheckinData);
      } else {
        console.log('No existing checkin data, creating initial data');
        const initialData = { lastCheckIn: '', completedDays: [] };
        await setDoc(docRef, initialData);
        setCheckinData(initialData);
      }
    } catch (error) {
      console.error('Error loading checkin data:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      toast.error(t('errors.loadDataFailed'));
    } finally {
      setLoading(false);
    }
  };

  const canClaimToday = (day: number) => {
    // 未登录用户不能签到
    if (!user?.uid && !testMode) return false;
    
    // 其他逻辑保持不变
    if (testMode) return true;
    
    const today = new Date().toLocaleDateString();
    const hasCheckedInToday = checkinData.lastCheckIn === today;
    const isNextDay = day === (checkinData.completedDays.length + 1);
    
    return !hasCheckedInToday && isNextDay;
  };

  const handleClaim = async (day: number) => {
    if (!user?.uid && !testMode) {
      // 未登录用户点击时显示提示
      toast.error(t('auth.createAccount.subtitle'));
      return;
    }
    
    try {
      const reward = CHECKIN_REWARDS[day - 1];
      console.log('Reward config:', reward);
      console.log('Reward type:', reward.reward.type);
      
      if (reward.reward.type === 'token') {
        console.log('Claiming token reward:', reward.reward.amount);
        const success = await updateTokens(
          reward.reward.amount,
          'daily_login',
          `Day ${day} login reward`
        );
        
        if (!success) {
          throw new Error('Failed to update tokens');
        }
      }

      // 然后更新签到数据
      const docRef = doc(db, 'userCheckins', user?.uid || 'test');
      const today = new Date().toLocaleDateString();
      const newData = {
        lastCheckIn: today,
        completedDays: [...checkinData.completedDays, day]
      };

      await setDoc(docRef, newData);
      setCheckinData(newData);
      
      // 显示奖励弹窗
      setCurrentReward(reward);
      setShowReward(true);
      
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error(t('errors.claimFailed'));
    }
  };

  const handleReset = async () => {
    if (!testMode) return;
    
    try {
      const docRef = doc(db, 'userCheckins', user?.uid || 'test');
      await setDoc(docRef, {
        lastCheckIn: '',
        completedDays: []
      });
      setCheckinData({ lastCheckIn: '', completedDays: [] });
      toast.success('签到数据已重置');
    } catch (error) {
      console.error('Error resetting checkin data:', error);
      toast.error('重置失败');
    }
  };

  if (loading) {
    return <div className="text-center">{t('common.loading')}</div>;
  }

  return (
    <div className="w-full">
      <CheckinGrid
        rewards={CHECKIN_REWARDS}
        completedDays={checkinData.completedDays}
        canClaimToday={canClaimToday}
        onClaim={handleClaim}
      />
      
      {testMode && (
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          重置签到数据
        </button>
      )}
      
      <RewardPopup 
        reward={currentReward}
        isVisible={showReward}
        onClose={() => setShowReward(false)}
      />
    </div>
  );
}