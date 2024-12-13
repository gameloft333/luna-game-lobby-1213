import React from 'react';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { signUpWithEmail } from '../../lib/firebase/auth';
import { cn } from '../../lib/utils';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSignInClick: () => void;
}

export function SignUpForm({ onSuccess, onSignInClick }: SignUpFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { user, error } = await signUpWithEmail(email, password);
      
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      if (user && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
              placeholder="Create a password"
              required
            />
            <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Confirm your password"
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
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSignInClick}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}