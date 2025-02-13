import { useEffect, useState } from 'react';
import { Game } from '../types/games';
import { getRandomizedGames } from '../data/gamesData';

export function GameList() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const randomizedGames = getRandomizedGames();
    console.log('[DEBUG] 组件获取到随机排序后的游戏列表');
    setGames(randomizedGames);
  }, []); // 仅在组件挂载时执行一次

  return (
    // ... 渲染游戏列表
  );
}