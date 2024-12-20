import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config';
import type { UserProfile, TokenTransaction } from '../../types/user';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data() as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function initializeUserProfile(uid: string, email: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const initialProfile: UserProfile = {
    uid,
    email,
    displayName: null,
    tokens: 0,
    invitedCount: 0,
    purchaseCount: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString()
  };
  
  await setDoc(userRef, initialProfile);
}

export async function updateTokens(
  userId: string, 
  amount: number,
  type: TokenTransaction['type'],
  description: string
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const transactionsRef = collection(db, 'transactions');

  // Create transaction record
  const transaction: Omit<TokenTransaction, 'id'> = {
    userId,
    amount,
    type,
    description,
    timestamp: new Date().toISOString()
  };

  // Add transaction and update user tokens atomically
  await Promise.all([
    addDoc(transactionsRef, transaction),
    updateDoc(userRef, {
      tokens: amount
    })
  ]);
}