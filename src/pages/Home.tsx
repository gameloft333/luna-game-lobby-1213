import React from 'react';
import { Carousel } from '../components/home/Carousel/Carousel';
import { DailyCheckin } from '../components/home/DailyCheckin/DailyCheckin';
import { carouselItems } from '../data/carouselData';
import { useSettingsStore } from '../store/settings';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import GameList from '../components/games/GameList';

export default function Home() {
  const { t } = useTranslation();
  const { testMode } = useSettingsStore();
  const { user } = useAuth();
  
  console.log('[DEBUG] Home组件渲染');

  return (
    <div className="space-y-6">
      <Carousel items={carouselItems} />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-left">
          {t('home.featuredGames')}
        </h2>
        <GameList />
      </div>

      {user && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-left">
            {t('home.dailyCheckin')}
          </h2>
          <DailyCheckin />
        </div>
      )}
    </div>
  );
}