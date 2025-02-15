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
  },
  shop: {
    title: 'Token Shop',
    currentBalance: 'Current Balance: {{amount}} Tokens',
    addFunds: 'Add Funds',
    packages: {
      bonus: '+{{amount}} Bonus',
      tokens: '{{amount}} Tokens'
    },
    purchase: {
      success: 'Purchase successful',
      failed: 'Purchase failed',
      processing: 'Processing payment...'
    }
  },
  games: {
    zen: {
      title: 'Color Breathing Therapy',
      description: 'Find inner peace through AI-driven breathing guidance and meditation music with soothing colors'
    },
    mood: {
      title: 'Mood Tracking Manager',
      description: 'Smart mood tracking assistant to record and analyze your daily emotional changes'
    },
    bible: {
      title: 'AI Bible Assistant',
      description: 'Intelligent Bible interpretation assistant providing personalized spiritual guidance'
    },
    cryptoQuest: {
      title: 'Crypto Quest',
      description: 'Embark on an epic journey through the blockchain realm.'
    },
    nftLegends: {
      title: 'NFT Legends',
      description: 'Collect, trade, and battle with unique NFT characters.'
    },
    metaRacer: {
      title: 'Meta Racer',
      description: 'High-speed racing in the metaverse.'
    },
    aiChess: {
      title: 'AI Chess Master',
      description: 'Challenge advanced AI in strategic chess battles.'
    },
    aiCompanions: {
      title: 'AI Companions',
      description: 'Connect with AI companions and build meaningful relationships.'
    },
    kittySpin: {
      title: 'Kitty Spin',
      description: 'Adorable kitty-themed game, spin the wheel to win rewards!'
    }
  },
  profile: {
    menu: {
      notifications: 'Notifications',
      privacySecurity: 'Privacy & Security',
      theme: 'Theme',
      darkMode: 'Dark mode',
      lightMode: 'Light mode',
      helpSupport: 'Help & Support',
      signOut: 'Sign Out',
      language: 'Language',
      english: 'English',
      chinese: '中文',
      testMode: 'Test Mode'
    },
    wallet: {
      title: 'Wallet',
      balance: 'Balance',
      tokens: '{{amount}} Tokens',
      send: 'Send',
      receive: 'Receive',
      transfer: 'Transfer',
      deposit: 'Deposit'
    },
    settings: {
      title: 'Settings'
    }
  }
}; 