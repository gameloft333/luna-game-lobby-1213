import React from 'react';
import { Mail, Loader2, AlertCircle } from 'lucide-react';
import { sendVerificationEmail } from '../../lib/firebase/auth/methods';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSignInClick: () => void;
}

export function SignUpForm({ onSuccess, onSignInClick }: SignUpFormProps) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error, message } = await sendVerificationEmail(email);
    if (error) {
      setError(error);
    } else {
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('auth.createAccount.emailAddress')}
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
              "focus:outline-none focus:ring-blue-500 focus:border-blue-500",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            )}
            placeholder={t('auth.emailLink.emailPlaceholder')}
            required
          />
          <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center px-4 py-2 border border-transparent",
          "text-sm font-medium rounded-md text-white bg-blue-600",
          "hover:bg-blue-700 focus:outline-none focus:ring-2",
          "focus:ring-offset-2 focus:ring-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          t('auth.createAccount.sendSignInLink')
        )}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.createAccount.alreadyHaveAccount')}{' '}
        <button
          type="button"
          onClick={onSignInClick}
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {t('auth.createAccount.signIn')}
        </button>
      </p>
    </form>
  );
}