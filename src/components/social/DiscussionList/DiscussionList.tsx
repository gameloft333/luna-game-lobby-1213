import React from 'react';
import { DiscussionCard } from './DiscussionCard';
import { Discussion } from '../../../types/social';

interface DiscussionListProps {
  discussions: Discussion[];
  onDiscussionClick: (id: number) => void;
}

export function DiscussionList({ discussions, onDiscussionClick }: DiscussionListProps) {
  return (
    <div className="grid gap-3">
      {discussions.map((discussion) => (
        <DiscussionCard 
          key={discussion.id} 
          discussion={discussion} 
          onClick={() => onDiscussionClick(discussion.id)}
        />
      ))}
    </div>
  );
}