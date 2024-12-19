import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { useTranslation } from 'react-i18next';

export function VerifyEmail() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(t('auth.emailLink.verifying'));
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          email = window.prompt(t('auth.emailLink.enterEmail'));
        }

        try {
          await signInWithEmailLink(auth, email!, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          setStatus(t('auth.emailLink.success'));
          setTimeout(() => navigate('/'), 2000);
        } catch (error) {
          console.error('验证失败:', error);
          setStatus(t('auth.emailLink.error'));
        }
      } else {
        navigate('/');
      }
    };

    verifyEmail();
  }, [navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          {t('auth.emailLink.title')}
        </h2>
        <p className="text-center text-gray-600">{status}</p>
      </div>
    </div>
  );
} 