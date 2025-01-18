import { Game } from '../types/games';
import { getRandomGameMetrics } from '../lib/utils/growthCurve';

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
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41',
    ...getRandomGameMetrics(1),  // 这里会自动生成 players 和 wishes
    rating: 4.8,
    description: 'Embark on an epic journey through the blockchain realm.',
    order: 6,
    showInHome: true,
    isPreview: true,
  },
  {
    id: 2,
    title: 'NFT Legends',
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    ...getRandomGameMetrics(2),  // 这里会自动生成 players 和 wishes
    rating: 4.6,
    description: 'Collect, trade, and battle with unique NFT characters.',
    order: 3,
    showInHome: true,
    isPreview: true,
  },
  {
    id: 3,
    title: 'Meta Racer',
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f',
    ...getRandomGameMetrics(3),  // 这里会自动生成 players 和 wishes
    rating: 4.7,
    description: 'High-speed racing in the metaverse.',
    order: 4,
    showInHome: false,
    isPreview: true,
  },
  {
    id: 4,
    title: 'AI Chess Master',
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793',
    ...getRandomGameMetrics(4),  // 这里会自动生成 players 和 wishes
    rating: 4.9,
    description: 'Challenge advanced AI in strategic chess battles.',
    order: 5,
    showInHome: true,
    isPreview: true,
  },
  {
    id: 5,
    title: 'AI Companions',
    category: 'agi', 
    cover: getRandomImage(companionCovers),  // use random image
    ...getRandomGameMetrics(5),  // 这里会自动生成 players 和 wishes
    rating: 4.9,
    description: 'Connect with AI companions and build meaningful relationships.',
    externalLink: {
      primary: 'http://love.saga4v.com/',
      fallbacks: [
        'http://love.ai666.click',
      ]
    },
    order: 1,
    showInHome: true,
  },
  {
    id: 6,
    title: 'Kitty Spin',
    category: 'game',
    cover: getRandomImage([
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d', // 一只橘猫靠在窗边,眼神温柔
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e', // 一只小奶猫躺在毯子上撒娇
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0', // 一只白色小猫咪歪头卖萌
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce', // 一只小猫咪在花丛中探头
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6', // 两只小猫依偎在一起
    ]), // 精选超萌猫咪图片随机显示
    ...getRandomGameMetrics(6),  // 这里会自动生成 players 和 wishes
    rating: 4.8,
    description: '可爱的猫咪主题游戏,转动转盘赢取奖励!',
    externalLink: {
      primary: 'http://kitty.saga4v.com/',
      fallbacks: []
    },
    order: 2,
    showInHome: true,
  },
];