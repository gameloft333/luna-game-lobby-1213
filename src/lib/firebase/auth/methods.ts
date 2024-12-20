import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  sendSignInLinkToEmail
} from 'firebase/auth';
import { auth } from '../config';
import { googleProvider } from './providers';
import { getUserProfile, initializeUserProfile } from '../db/users';
import type { AuthResult } from './types';
import i18next from 'i18next';

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    return { user: null, error: 'Failed to sign in with Google' };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: 'Failed to sign out' };
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        if (!profile && user.email) {
          await initializeUserProfile(user.uid, user.email);
        }
      } catch (error) {
        console.error('Error checking/creating profile:', error);
      }
    }
    callback(user);
  });
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    const errorKey = handleAuthError(error, {
      'auth/invalid-email': 'auth.errors.signIn.invalidCredentials',
      'auth/user-not-found': 'auth.errors.signIn.userNotFound',
      'auth/wrong-password': 'auth.errors.signIn.invalidCredentials',
      'auth/too-many-requests': 'auth.errors.signIn.tooManyAttempts',
      default: 'auth.errors.signIn.default'
    });
    return { user: null, error: i18next.t(errorKey) };
  }
};

export const sendVerificationEmail = async (email: string) => {
  try {
    const actionCodeSettings = {
      url: import.meta.env.DEV 
        ? `${window.location.origin}/verify-email`
        : `https://${import.meta.env.VITE_DOMAIN}/verify-email`,
      handleCodeInApp: true
    };

    console.log('Sending verification email with settings:', {
      email,
      actionCodeSettings: JSON.stringify(actionCodeSettings)
    });

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    
    return { 
      error: null, 
      message: i18next.t('auth.emailLink.linkSent', { email }) 
    };
  } catch (error: any) {
    console.error('Send verification email error:', error);
    const errorKey = handleAuthError(error, {
      'auth/invalid-email': 'auth.errors.invalidEmail',
      'auth/email-already-in-use': 'auth.errors.emailExists',
      'auth/operation-not-allowed': 'auth.errors.notEnabled',
      'auth/too-many-requests': 'auth.errors.tooManyRequests',
      'auth/invalid-dynamic-link-domain': 'auth.errors.dynamicLinkNotActivated',
      default: 'auth.errors.default'
    });
    return { error: i18next.t(errorKey), message: null };
  }
};