import React from 'react';
import { LogOut } from 'lucide-react';

interface ProfileActionsProps {
  onSignOut: () => void;
}

export function ProfileActions({ onSignOut }: ProfileActionsProps) {
  return (
    <div className="flex-shrink-0">
      <button
        onClick={onSignOut}
        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Sign Out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}