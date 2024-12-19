import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth } from '../config';
import { googleProvider } from './providers';
import type { AuthResult, SignOutResult } from './types';
import i18next from 'i18next';

// 添加邮件链接验证配置
const actionCodeSettings = {
  url: `https://${import.meta.env.VITE_DOMAIN}/verify-email`,
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.lunagames.app'
  },
  android: {
    packageName: 'com.lunagames.app',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: import.meta.env.VITE_DOMAIN
};

// 统一的错误处理函数
const handleAuthError = (error: any, errorMap: Record<string, string>): string => {
  console.error('Auth Error:', error);
  return errorMap[error.code] || errorMap.default;
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    const errorKey = handleAuthError(error, {
      'auth/popup-blocked': 'auth.errors.googleSignIn.popupBlocked',
      'auth/cancelled-popup-request': 'auth.errors.googleSignIn.cancelled',
      'auth/unauthorized-domain': 'auth.errors.googleSignIn.unauthorizedDomain',
      'auth/popup-closed-by-user': 'auth.errors.googleSignIn.popupClosed',
      default: 'auth.errors.googleSignIn.generic'
    });
    return { user: null, error: i18next.t(errorKey) };
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

export const sendVerificationEmail = async (email: string): Promise<AuthResult> => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // 保存邮箱到本地存储，用于后续验证
    window.localStorage.setItem('emailForSignIn', email);
    return { 
      user: null, 
      error: null,
      message: i18next.t('auth.emailLink.linkSent', { email })
    };
  } catch (error: any) {
    console.error('发送验证邮件错误:', error);
    let errorKey = 'auth.errors.default';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorKey = 'auth.errors.invalidEmail';
        break;
      case 'auth/email-already-in-use':
        errorKey = 'auth.errors.emailExists';
        break;
      case 'auth/operation-not-allowed':
        errorKey = 'auth.errors.notEnabled';
        break;
      case 'auth/too-many-requests':
        errorKey = 'auth.errors.tooManyRequests';
        break;
    }
    
    return { 
      user: null, 
      error: i18next.t(errorKey),
      message: null 
    };
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to create account';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account already exists with this email';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
      default:
        errorMessage = 'Failed to create account. Please try again.';
    }
    
    return { user: null, error: errorMessage };
  }
};

// 确保导出其他必要的方
export { isSignInWithEmailLink, signInWithEmailLink };