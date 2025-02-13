import React, { useState, useEffect } from 'react';
import { Star, Users, Heart, Play, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Game } from '../../types/games';
import { formatNumber } from '../../lib/utils';
import { GameBadge } from './GameBadge';
import { GameStats } from './GameStats';
import { useTranslation } from 'react-i18next';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const { t } = useTranslation();
  const [currentCover, setCurrentCover] = useState<string>('');
  
  // 添加调试日志
  console.log('[DEBUG] GameCard - 标题键值:', game.title);
  console.log('[DEBUG] GameCard - 翻译后标题:', t(game.title));
  console.log('[DEBUG] GameCard - 描述键值:', game.description);
  console.log('[DEBUG] GameCard - 翻译后描述:', t(game.description));
  
  useEffect(() => {
    const loadCover = async () => {
      try {
        if (typeof game.cover === 'function') {
          const coverUrl = await game.cover();
          console.log(`[DEBUG] GameCard - 原始封面URL:`, coverUrl);
          
          // 处理URL
          let finalUrl = coverUrl;
          if (!coverUrl.startsWith('http')) {
            // 确保本地路径正确，移除可能的 ?url 后缀
            finalUrl = coverUrl.replace('?url', '');
            if (!finalUrl.startsWith('/')) {
              finalUrl = `/${finalUrl}`;
            }
          }
          
          console.log(`[DEBUG] GameCard - 处理后的URL:`, finalUrl);
          setCurrentCover(finalUrl);
        } else {
          setCurrentCover(game.cover);
        }
      } catch (error) {
        console.error(`[ERROR] GameCard - 加载封面失败:`, error);
        setCurrentCover('/assets/images/fallback.jpg');
      }
    };
    
    loadCover();
  }, [game]);

  return (
    <div
      className={cn(
        "group relative bg-gray-900/95 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10",
        game.externalLink && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={currentCover || '/fallback-image.jpg'}
          alt={t(game.title)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Preview Overlay */}
        {game.isPreview && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl animate-pulse" />
              <div className="relative px-6 py-2 border-2 border-white/80 rounded-lg rotate-[-6deg]">
                <span className="text-xl font-bold text-white">COMING SOON</span>
              </div>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        {!game.isPreview && (
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        )}

        {/* Category Badge */}
        <GameBadge category={game.category} className="absolute top-3 right-3" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-white mb-1 line-clamp-1">
            {t(game.title)}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {t(game.description)}
          </p>
        </div>

        <GameStats
          players={game.players}
          rating={game.rating}
          wishes={game.wishes}
        />
      </div>
    </div>
  );
}