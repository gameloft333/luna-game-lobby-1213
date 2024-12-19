import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeEmailLinkSignIn } from '../lib/firebase';

export default function LoginLink() {
  const [status, setStatus] = useState('Verifying login link...');
  const navigate = useNavigate();

  useEffect(() => {
    async function handleEmailLink() {
      try {
        const user = await completeEmailLinkSignIn();
        
        if (user) {
          setStatus('Login successful! Redirecting...');
          // Redirect to home or dashboard
          setTimeout(() => navigate('/'), 2000);
        } else {
          setStatus('Invalid or expired login link');
        }
      } catch (error) {
        console.error('Login link error:', error);
        setStatus('Error processing login link');
      }
    }

    handleEmailLink();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {status}
        </h2>
        {status.includes('error') && (
          <p className="text-center text-red-500">
            Please request a new login link
          </p>
        )}
      </div>
    </div>
  );
}
