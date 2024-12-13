import { GoogleAuthProvider } from 'firebase/auth';

export const googleProvider = new GoogleAuthProvider();

// Add required scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Set custom parameters for better UX
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Force popup mode and disable redirect
  auth_type: 'popup'
});