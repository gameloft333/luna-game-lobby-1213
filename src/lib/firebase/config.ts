import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyALvcFE2BcxyTcdq3o0n99rV4QGbxSIFi4",
  authDomain: "global-book-summary-1012.firebaseapp.com",
  projectId: "global-book-summary-1012",
  storageBucket: "global-book-summary-1012.firebasestorage.app",
  messagingSenderId: "346530908415",
  appId: "1:346530908415:web:b767198d9d7d4ad9a4a4ca",
  measurementId: "G-37GRSBSL1Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Only initialize analytics if window exists (browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;