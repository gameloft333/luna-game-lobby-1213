// Re-export all auth methods and types
export * from './methods';
export * from './profile';
export * from './providers';
export * from './types';

export {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  subscribeToAuthChanges,
  sendVerificationEmail
} from './methods';