import React from 'react';
import { Carousel } from '../components/home/Carousel/Carousel';
import { DailyCheckin } from '../components/home/DailyCheckin/DailyCheckin';
import { carouselItems } from '../data/carouselData';
import { useSettingsStore } from '../store/settings';
import { GAMES } from '../data/gamesData';
import { GameCard } from '../components/games/GameCard';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { t } = useTranslation();
  const { testMode } = useSettingsStore();
  const { user } = useAuth();
  
  const featuredGames = React.useMemo(() => 
    GAMES
      .filter(game => game.showInHome)
      .sort((a, b) => a.order - b.order),
    []
  );

  const handleGameClick = (game: typeof GAMES[0]) => {
    if (game.externalLink && !game.isPreview) {
      // 优先使用主链接，如果失败则尝试备用链接
      const links = [game.externalLink.primary, ...(game.externalLink.fallbacks || [])];
      for (const link of links) {
        try {
          window.open(link, '_blank');
          break;
        } catch (error) {
          console.warn(`Failed to open link: ${link}`, error);
        }
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Carousel */}
      <Carousel items={carouselItems} autoPlayInterval={5000} />

      {/* Featured Games */}
      <section>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {t('home.featuredGames')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      </section>

      {/* Daily Check-in */}
      <section className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {t('home.dailyCheckin')}
        </h2>
        <div className="w-full">
          <DailyCheckin testMode={testMode} />
        </div>
      </section>
    </div>
  );
}