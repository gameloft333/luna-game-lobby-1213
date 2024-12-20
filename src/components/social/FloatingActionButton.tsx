import React from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLocation } from 'react-router-dom';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  const location = useLocation();
  
  // 在 Social 页面不显示
  if (location.pathname === '/social') {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 md:bottom-6 right-6",
        "w-12 h-12",
        "rounded-full shadow-lg",
        "bg-blue-500 hover:bg-blue-600",
        "text-white",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-110",
        "active:scale-95",
        className
      )}
    >
      <Send className="w-5 h-5" />
    </button>
  );
}