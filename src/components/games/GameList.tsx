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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard 
          key={game.id} 
          game={game} 
          onClick={() => {
            console.log('[DEBUG] 游戏卡片点击:', game.title);
          }} 
        />
      ))}
    </div>
  );
}