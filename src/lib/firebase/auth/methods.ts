import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '../config';
import { googleProvider } from './providers';
import type { AuthResult, SignOutResult } from './types';

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    let errorMessage = 'Failed to sign in with Google';
    
    switch (error.code) {
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign in cancelled. Please try again.';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'This domain is not authorized for Google sign-in. Please use email sign in.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign in window was closed. Please try again.';
        break;
      default:
        errorMessage = 'Failed to sign in with Google. Please try again later.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in';
    
    switch (error.code) {
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = 'Failed to sign in. Please try again.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const signOut = async (): Promise<SignOutResult> => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: 'Failed to sign out' };
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};