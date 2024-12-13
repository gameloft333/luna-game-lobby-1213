import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { CarouselItem } from './types';

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export function Carousel({ items, autoPlayInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((current) => (current + 1) % items.length);
  }, [items.length]);

  const previousSlide = React.useCallback(() => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  }, [items.length]);

  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoPlayInterval]);

  return (
    <div 
      className="relative h-64 rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'absolute inset-0 transition-transform duration-500 ease-in-out',
            index === currentIndex ? 'translate-x-0' : 'translate-x-full'
          )}
          style={{
            transform: `translateX(${100 * (index - currentIndex)}%)`,
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center">
            <div className="px-8">
              <h2 className="text-3xl font-bold text-white mb-2">{item.title}</h2>
              <p className="text-white/90 mb-4">{item.description}</p>
              <button 
                onClick={() => window.location.href = item.link}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/75'
            )}
          />
        ))}
      </div>
    </div>
  );
}