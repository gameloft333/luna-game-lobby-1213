import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [isSignIn, setIsSignIn] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get the redirect path from location state, or default to home
  const from = (location.state?.from?.pathname) || '/';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      {/* Return to Home Button */}
      <button
        onClick={handleReturnHome}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Return to Home</span>
      </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isSignIn ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {from !== '/' && 'Sign in required to access this feature'}
            </p>
            {from !== '/' && (
              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                You can still browse games without signing in
              </p>
            )}
          </div>

          {isSignIn ? (
            <SignInForm
              onSuccess={handleAuthSuccess}
              onSignUpClick={() => setIsSignIn(false)}
            />
          ) : (
            <SignUpForm
              onSuccess={handleAuthSuccess}
              onSignInClick={() => setIsSignIn(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}