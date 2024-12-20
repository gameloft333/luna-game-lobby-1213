import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { signOut } from '../../../lib/firebase/auth';
import { UserAvatar } from './UserAvatar';
import { DisplayNameEditor } from './DisplayNameEditor';
import { ProfileActions } from './ProfileActions';

export function UserProfileHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-900/20 dark:to-purple-900/20" />
      
      {/* Content */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-start gap-6">
          <UserAvatar user={user} />
          
          <div className="flex-1 min-w-0">
            <DisplayNameEditor user={user} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user.email}
            </p>
          </div>

          <ProfileActions onSignOut={handleSignOut} />
        </div>
      </div>
    </div>
  );
}