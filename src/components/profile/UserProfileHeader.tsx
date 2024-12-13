import React from 'react';
import { User as UserIcon, Edit2, Check, X, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../lib/firebase/auth';
import { updateUserProfile } from '../../lib/firebase/auth/profile';
import { cn } from '../../lib/utils';
import { validateDisplayName } from '../../lib/utils/validation';
import { useNavigate } from 'react-router-dom';

export function UserProfileHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const validation = validateDisplayName(newName);
    
    if (validation.error) {
      setError(validation.error);
    } else {
      setError('');
    }
    
    setDisplayName(newName);
  };

  const handleSave = async () => {
    if (!user) return;
    
    const validation = validateDisplayName(displayName);
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await updateUserProfile(user, { displayName });
      if (error) {
        setError(error);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
    setError('');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <UserIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none dark:text-white w-full"
                  placeholder="Enter display name"
                  maxLength={12}
                  autoFocus
                />
                <div className="space-y-1 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum 6 Chinese characters or 12 English characters
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Only letters, numbers, Chinese characters, spaces, underscores and hyphens are allowed
                  </p>
                </div>
              </div>
            ) : (
              <h1 className="text-2xl font-bold dark:text-white">
                {user?.displayName || user?.email?.split('@')[0] || 'Anonymous User'}
              </h1>
            )}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading || !!error}
                    className={cn(
                      "p-1 text-green-600 hover:bg-green-50 rounded-full",
                      (loading || !!error) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}