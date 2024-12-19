import React, { useState, useEffect } from 'react';
import { sendVerificationEmail } from '../../lib/firebase/auth/methods';
import { auth } from '../../lib/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

export function EmailLinkLogin() {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing sign-in on component mount
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Try to complete sign-in if this is a sign-in link
        completeEmailLinkSignIn()
          .then((signedInUser) => {
            if (signedInUser) {
              setUser(signedInUser);
              setError(null);
            }
          })
          .catch((err) => {
            setError('Failed to complete sign-in');
            console.error(err);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    try {
      const result = await sendEmailLink(email);
      if (result.success) {
        setLinkSent(true);
        setError(null);
      } else {
        // Log the full error for debugging
        console.error('Email link send error:', result.error);
        setError(result.message || 'Failed to send sign-in link');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred while sending the link');
    }
  };

  const handleLogout = () => {
    clearAuthData();
    auth.signOut();
    setUser(null);
    setEmail('');
    setLinkSent(false);
  };

  const handleResetAuth = () => {
    resetFirebaseAuth();
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p>Logged in as: {user.email}</p>
        <div className="space-y-2 mt-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button 
            onClick={handleResetAuth}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
          >
            Reset Authentication
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Email Link Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {!linkSent ? (
        <form onSubmit={handleSendLink}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Send Sign-In Link
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="mb-4">
            A sign-in link has been sent to {email}. 
            Please check your email and click the link to sign in.
          </p>
          <button
            onClick={() => setLinkSent(false)}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
          >
            Send Another Link
          </button>
        </div>
      )}
    </div>
  );
}
