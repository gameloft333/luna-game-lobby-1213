import React from 'react';
import { Star, Users, Gamepad2, Bot, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { GAMES } from '../data/gamesData';
import { GameCard } from '../components/games/GameCard';

const categories = [
  { id: 'all', label: 'All', icon: Gamepad2 },
  { id: 'game', label: 'Games', icon: Gamepad2 },
  { id: 'agi', label: 'AGIs', icon: Bot },
  //{ id: 'companions', label: 'Companions', icon: Heart },
];

export default function Games() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredGames = React.useMemo(() => 
    [...GAMES]
      .filter(game => {
        if (selectedCategory === 'all') return game.category === 'all' || game.category === 'agi' || game.category === 'game';
        if (selectedCategory === 'agi') return game.category === 'all' || game.category === 'agi';
        if (selectedCategory === 'game') return game.category === 'all' || game.category === 'game';
        return false;
      })
      .sort((a, b) => a.order - b.order),
    [selectedCategory]
  );

  const handleGameClick = (game: typeof GAMES[0]) => {
    if (game.externalLink && !game.isPreview) {
      window.open(game.externalLink, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Game Center</h1>
        <div className="flex gap-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
                selectedCategory === id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => handleGameClick(game)}
          />
        ))}
      </div>
    </div>
  );
}