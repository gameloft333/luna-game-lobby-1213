import { useCallback } from 'react';
import { doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useUserProfile } from './useUserProfile';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

export function useTokenPurchase() {
  const { t } = useTranslation();
  const { profile, updateProfile } = useUserProfile();

  const handlePurchaseSuccess = useCallback(async (packageData: {
    amount: number;
    bonus: number;
    orderId: string;
  }) => {
    if (!profile?.uid) return;
    
    try {
      const totalTokens = packageData.amount + packageData.bonus;
      console.log('Updating tokens:', { current: profile.tokens, adding: totalTokens });
      
      // 先获取最新的用户数据
      const userRef = doc(db, 'users', profile.uid);
      const userDoc = await getDoc(userRef);
      const currentTokens = userDoc.data()?.tokens || 0;
      
      const userUpdate = {
        tokens: currentTokens + totalTokens,
        purchaseCount: increment(1),
        totalSpent: increment(packageData.amount),
        purchaseHistory: arrayUnion({
          orderId: packageData.orderId,
          amount: packageData.amount,
          bonus: packageData.bonus,
          timestamp: new Date().toISOString()
        })
      };

      await updateDoc(userRef, userUpdate);
      console.log('Database updated with:', userUpdate);

      // 强制刷新用户数据
      const newProfile = {
        ...profile,
        tokens: currentTokens + totalTokens,
        purchaseCount: (profile.purchaseCount || 0) + 1
      };
      
      updateProfile(newProfile);
      console.log('Local profile updated:', newProfile);
      
      toast.success(`成功添加 ${totalTokens} 代币！当前余额: ${newProfile.tokens}`);
      
    } catch (error) {
      console.error('Error updating tokens:', error);
      throw error;
    }
  }, [profile, updateProfile]);

  return { handlePurchaseSuccess };
} 