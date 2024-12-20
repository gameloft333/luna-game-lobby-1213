import React from 'react';
import { Star, Users, Heart } from 'lucide-react';
import { formatNumber } from '../../lib/utils';

interface GameStatsProps {
  players: number;
  rating: number;
  wishes: number;
}

export function GameStats({ players, rating, wishes }: GameStatsProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-400">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>{formatNumber(players)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="h-4 w-4 text-pink-500" />
          <span>{formatNumber(wishes)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span>{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}