import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuth } from './useAuth';
import type { UserProfile } from '../types/user';

type TokenUpdateType = 'daily_login' | 'invite_reward' | 'post_reward';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const initializeProfile = async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const initialProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          tokens: 0,
          invitedCount: 0,
          purchaseCount: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString()
        };
        console.log('Initializing user profile:', initialProfile);
        await setDoc(docRef, initialProfile);
      }
    };

    console.log('Initializing profile for user:', user.uid);
    initializeProfile();

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const profileData = doc.data() as UserProfile;
          console.log('Profile updated:', profileData);
          setProfile(profileData);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to profile changes:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const updateTokens = async (
    amount: number, 
    type: TokenUpdateType, 
    description: string
  ) => {
    if (!user?.uid) return false;

    try {
      console.log(`Starting token update for user ${user.uid}`);
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      console.log('Document exists:', docSnap.exists());
      console.log('Current document data:', docSnap.data());
      
      if (!docSnap.exists()) {
        console.log('Creating new profile with initial tokens:', amount);
        const newProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          tokens: amount,
          invitedCount: 0,
          purchaseCount: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      } else {
        const currentTokens = docSnap.data().tokens || 0;
        console.log('Current tokens:', currentTokens, 'Adding:', amount);
        
        await updateDoc(docRef, {
          tokens: currentTokens + amount,
          lastTokenUpdate: {
            type,
            amount,
            description,
            timestamp: new Date().toISOString()
          }
        });
        console.log('Tokens updated. New total:', currentTokens + amount);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating tokens:', error);
      return false;
    }
  };

  return {
    profile,
    loading,
    updateTokens
  };
}