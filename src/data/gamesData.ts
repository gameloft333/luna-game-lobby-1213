import { Game } from '../types/games';

// Helper function to generate random wish count
const getRandomWishes = () => Math.floor(Math.random() * 10000) + 1000;

// Helper function to get random image
const getRandomImage = (images: string[]) => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// AI Companions的封面图片集合
const companionCovers = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1621784563330-caee0b138a00',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9'
];

export const GAMES: Game[] = [
  {
    id: 1,
    title: 'Crypto Quest',
    category: 'all',
    cover: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41',
    players: 1234,
    rating: 4.8,
    description: 'Embark on an epic journey through the blockchain realm.',
    order: 2,
    showInHome: true,
    isPreview: true,
    wishes: getRandomWishes(),
  },
  {
    id: 2,
    title: 'NFT Legends',
    category: 'all',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    players: 856,
    rating: 4.6,
    description: 'Collect, trade, and battle with unique NFT characters.',
    order: 3,
    showInHome: true,
    isPreview: true,
    wishes: getRandomWishes(),
  },
  {
    id: 3,
    title: 'Meta Racer',
    category: 'all',
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f',
    players: 2341,
    rating: 4.7,
    description: 'High-speed racing in the metaverse.',
    order: 4,
    showInHome: false,
    isPreview: true,
    wishes: getRandomWishes(),
  },
  {
    id: 4,
    title: 'AI Chess Master',
    category: 'agi',
    cover: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793',
    players: 1567,
    rating: 4.9,
    description: 'Challenge advanced AI in strategic chess battles.',
    order: 5,
    showInHome: true,
    isPreview: true,
    wishes: getRandomWishes(),
  },
  {
    id: 5,
    title: 'AI Companions',
    category: 'companions',
    cover: getRandomImage(companionCovers),  // 使用随机图片
    players: 3456,
    rating: 4.9,
    description: 'Connect with AI companions and build meaningful relationships.',
    externalLink: {
      primary: 'https://love.saga4v.com/',
      fallbacks: [
        'https://love.ai666.click',
      ]
    },
    order: 1,
    showInHome: true,
    wishes: getRandomWishes(),
  },
];