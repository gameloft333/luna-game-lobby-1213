export default {
  auth: {
    createAccount: {
      title: 'Create your account',
      subtitle: 'Sign in required to access this feature',
      browsing: 'You can still browse games without signing in',
      emailAddress: 'Email Address',
      sendSignInLink: 'Send Sign-In Link',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in'
    },
    emailLink: {
      title: 'Email Link Login',
      verifying: 'Verifying login link...',
      success: 'Login successful! Redirecting...',
      invalid: 'Invalid or expired login link',
      error: 'Error processing login link',
      requestNew: 'Please request a new login link',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      sendLink: 'Send Sign-In Link',
      linkSent: 'A sign-in link has been sent to {{email}}. Please check your email and click the link to sign in.',
      sendAnother: 'Send Another Link',
      useEmailLink: 'Use email link verification',
      enterEmail: 'Please provide your email for confirmation'
    },
    errors: {
      invalidEmail: 'Invalid email address',
      emailExists: 'Email is already registered. Try signing in.',
      notEnabled: 'Email link sign-in is not enabled',
      tooManyRequests: 'Too many requests. Please try again later.',
      default: 'An unexpected error occurred',
      googleSignIn: {
        default: 'Failed to sign in with Google',
        popupBlocked: 'Popup was blocked. Please allow popups for this site and try again.',
        cancelled: 'Sign in cancelled. Please try again.',
        unauthorizedDomain: 'This domain is not authorized for Google sign-in. Please use email sign in.',
        popupClosed: 'Sign in window was closed. Please try again.',
        generic: 'Failed to sign in with Google. Please try again later.'
      },
      signIn: {
        invalidCredentials: 'Invalid email or password',
        userNotFound: 'No account found with this email',
        tooManyAttempts: 'Too many failed attempts. Please try again later.',
        default: 'Failed to sign in'
      },
      signUp: {
        emailInUse: 'An account already exists with this email',
        weakPassword: 'Password should be at least 6 characters',
        default: 'Failed to create account'
      }
    }
  },
  home: {
    featuredGames: 'Featured Games',
    dailyCheckin: 'Daily Check-in'
  },
  errors: {
    loadDataFailed: 'Failed to load data',
    claimFailed: 'Failed to claim reward'
  },
  rewards: {
    claimed: 'Reward claimed successfully'
  }
}; 