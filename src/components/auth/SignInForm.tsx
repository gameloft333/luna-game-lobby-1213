import React from 'react';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '../../lib/firebase/auth';
import { cn } from '../../lib/utils';

interface SignInFormProps {
  onSuccess?: () => void;
  onSignUpClick: () => void;
}

export function SignInForm({ onSuccess, onSignUpClick }: SignInFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPopupWarning, setShowPopupWarning] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { user, error } = await signInWithEmail(email, password);
    
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (user && onSuccess) {
      onSuccess();
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    // Show popup warning before attempting sign in
    setShowPopupWarning(true);
    setLoading(true);
    setError('');

    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        setError(error);
        // If popup was blocked, keep the warning visible
        if (error.includes('popup')) {
          setShowPopupWarning(true);
        } else {
          setShowPopupWarning(false);
        }
        return;
      }

      if (user && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {showPopupWarning && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            <div className="text-sm">
              <p className="font-medium">Please allow popups</p>
              <p>Make sure popups are enabled for this site to sign in with Google</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
              required
            />
            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter your password"
              required
            />
            <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={cn(
            "w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSignUpClick}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}