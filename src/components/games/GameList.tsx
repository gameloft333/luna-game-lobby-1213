import React, { useState, useEffect } from 'react';
import { Game } from '../../types/games';
import { getRandomizedGames } from '../../data/gamesData';
import { GameCard } from './GameCard';

// 使用默认导出
export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);

  // 每次组件挂载或路由变化时重新随机排序
  useEffect(() => {
    console.log('[DEBUG] GameList - 开始获取随机排序游戏列表');
    const randomized = getRandomizedGames();
    setGames(randomized);
    
    console.log('[DEBUG] GameList - 游戏排序结果:', 
      randomized.map(g => ({
        id: g.id,
        title: g.title,
        randomOrder: g.randomOrder
      }))
    );
  }, []);

  const handleGameClick = (game: Game) => {
    console.log('[DEBUG] 游戏卡片点击:', game.title);
    
    if (game.externalLink && !game.isPreview) {
      // 优先使用主链接，如果失败则尝试备用链接
      const links = [game.externalLink.primary, ...(game.externalLink.fallbacks || [])];
      
      for (const link of links) {
        try {
          console.log('[DEBUG] 尝试打开链接:', link);
          window.open(link, '_blank');
          break;
        } catch (error) {
          console.warn(`[WARN] 打开链接失败: ${link}`, error);
          continue;
        }
      }
    } else if (game.isPreview) {
      console.log('[DEBUG] 预览版游戏，暂不可用');
      // 这里可以添加提示信息
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard 
          key={game.id} 
          game={game} 
          onClick={() => handleGameClick(game)} 
        />
      ))}
    </div>
  );
}