import React from 'react';
import { Gamepad2, Bot, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GameBadgeProps {
  category: string;
  className?: string;
}

export function GameBadge({ category, className }: GameBadgeProps) {
  const badges = {
    game: {
      icon: Gamepad2,
      text: 'Game',
      colors: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    agi: {
      icon: Bot,
      text: 'AGI',
      colors: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    companions: {
      icon: Heart,
      text: 'Companion',
      colors: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    }
  };

  const badge = badges[category as keyof typeof badges] || badges.game;
  const Icon = badge.icon;

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border backdrop-blur-md",
      "flex items-center gap-1.5",
      badge.colors,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{badge.text}</span>
    </div>
  );
}