import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

// Add additional scopes if needed
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Force to use popup mode to avoid cross-origin issues
  auth_type: 'popup'
});

export const signInWithGoogle = async () => {
  try {
    // Use signInWithPopup with force_popup_mode
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    let errorMessage = 'Failed to sign in with Google';
    
    if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Please allow popups for this site to sign in with Google';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign in cancelled. Please try again.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for Google sign-in. Please try email sign in.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in';
    
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to create account';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account already exists with this email';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    }
    
    return { user: null, error: errorMessage };
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
  return onAuthStateChanged(auth, callback);
};