import React, { useState, useEffect } from 'react';
import { getRandomCover } from '../data/gamesData';

interface GameCardProps {
  project: 'love' | 'kitty';
}

export const GameCard: React.FC<GameCardProps> = ({ project }) => {
  const [currentCover, setCurrentCover] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    const loadRandomCover = async () => {
      try {
        const cover = await getRandomCover(project);
        console.log(`[DEBUG] GameCard - 获取到的封面:`, cover);
        
        if (cover) {
          // 确保URL格式正确
          const finalUrl = cover.startsWith('http') ? cover : cover.replace('?url', '');
          console.log(`[DEBUG] GameCard - 最终使用的URL:`, finalUrl);
          setCurrentCover(finalUrl);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(`[ERROR] 加载封面失败:`, err);
        setError(true);
      }
    };

    loadRandomCover();
  }, [project]);

  useEffect(() => {
    const timer = setInterval(loadRandomCover, 5000);
    return () => clearInterval(timer);
  }, [project]);

  if (error) {
    return <div>加载图片失败</div>;
  }

  return (
    <div className="game-card">
      {currentCover && <img src={currentCover} alt={`${project} cover`} />}
    </div>
  );
};