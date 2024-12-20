import React from 'react';
import { User } from 'firebase/auth';
import { Edit2, Check, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { validateDisplayName } from '../../../lib/utils/validation';
import { updateUserProfile } from '../../../lib/firebase/auth/profile';

interface DisplayNameEditorProps {
  user: User;
}

export function DisplayNameEditor({ user }: DisplayNameEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(user.displayName || '');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const validation = validateDisplayName(newName);
    setError(validation.error || '');
    setDisplayName(newName);
  };

  const handleSave = async () => {
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
    setDisplayName(user.displayName || '');
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            type="text"
            value={displayName}
            onChange={handleDisplayNameChange}
            className={cn(
              "text-xl font-bold bg-transparent border-b-2 focus:outline-none dark:text-white w-full",
              error ? "border-red-500" : "border-blue-500"
            )}
            placeholder="Enter display name"
            maxLength={12}
            autoFocus
          />
        ) : (
          <h1 className="text-xl font-bold dark:text-white truncate">
            {user.displayName || user.email?.split('@')[0] || 'Anonymous User'}
          </h1>
        )}

        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading || !!error}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  loading || error
                    ? "text-gray-400 dark:text-gray-600"
                    : "text-green-500 hover:bg-green-500/10"
                )}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {isEditing && (
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>Maximum 6 Chinese characters or 12 English characters</p>
          <p>Only letters, numbers, Chinese characters, spaces, underscores and hyphens are allowed</p>
        </div>
      )}
    </div>
  );
}