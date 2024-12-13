import React from 'react';
import { Star, Users, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Game } from '../../types/games';
import { formatNumber } from '../../lib/utils';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all hover:scale-[1.02]",
        game.externalLink && "cursor-pointer hover:shadow-lg"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        {game.isPreview && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="transform -rotate-12">
              <span className="text-3xl font-bold text-white px-6 py-2 border-4 border-white rounded">
                COMING SOON
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 dark:text-white">
          {game.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {game.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{formatNumber(game.players)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>{formatNumber(game.wishes)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{game.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}