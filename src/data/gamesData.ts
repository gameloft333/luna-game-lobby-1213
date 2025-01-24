import { Game } from '../types/games';
import { getRandomGameMetrics } from '../lib/utils/growthCurve';

// Helper function to generate random wish count
const getRandomWishes = () => Math.floor(Math.random() * 10000) + 1000;

// 配置基础URL
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '/assets/images/covers';

// 备用图片配置
const FALLBACK_IMAGES = {
  kitty: [
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d',  // 慵懒猫咪
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',  // 橘猫特写
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5',  // 白猫望天
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce',     // 猫咪玩耍
  ],
  love: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',  // 浪漫日落情侣
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',  // 甜蜜时刻
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7',  // 温馨约会
    'https://images.unsplash.com/photo-1545389336-cf090694435e',     // 海边漫步
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',  // 幸福时光
    'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f',     // 浪漫约会
  ]
};

// 获取随机备用图片
const getRandomFallback = (project: keyof typeof FALLBACK_IMAGES): string => {
  const fallbacks = FALLBACK_IMAGES[project];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// 图片文件夹配置
const IMAGE_FOLDERS = {
  love: {
    path: `${BASE_IMAGE_URL}/love`,
    getFallback: () => getRandomFallback('love')  // 使用函数获取随机备用图片
  },
  kitty: {
    path: `${BASE_IMAGE_URL}/kitty`,
    getFallback: () => getRandomFallback('kitty')  // 使用函数获取随机备用图片
  }
} as const;

// 获取随机图片函数
const getRandomImage = async (project: keyof typeof IMAGE_FOLDERS): Promise<string> => {
  try {
    console.log(`[DEBUG] 开始获取 ${project} 随机图片`);
    
    // 使用 glob 获取文件夹下所有图片
    const images = await import.meta.glob('/public/assets/images/covers/**/*.{jpg,png,webp}', {
      eager: true,
      import: 'default'
    });
    
    const projectImages = Object.entries(images)
      .filter(([path]) => path.includes(`/${project}/`))
      .map(([path]) => path.replace('/public', ''));

    if (projectImages.length > 0) {
      const randomImage = projectImages[Math.floor(Math.random() * projectImages.length)];
      console.log(`[DEBUG] 选择的随机图片: ${randomImage}`);
      return randomImage;
    }
    
    // 如果没有找到本地图片，返回随机备用图片
    const fallbackImage = IMAGE_FOLDERS[project].getFallback();
    console.log(`[DEBUG] 使用随机备用图片: ${fallbackImage}`);
    return fallbackImage;
  } catch (error) {
    console.error(`[ERROR] 获取随机图片失败:`, error);
    return IMAGE_FOLDERS[project].getFallback();  // 错误时也返回随机备用图片
  }
};

// 定义项目类型
type ProjectType = 'love' | 'kitty';

// 定义项目封面配置接口
interface ProjectCovers {
  [key: string]: string[];
}

// 统一使用一个配置，直接引用 FALLBACK_IMAGES
export const PROJECT_IMAGES = {
  love: {
    local: [
      `${BASE_IMAGE_URL}/love/couple-1.jpg`,
      `${BASE_IMAGE_URL}/love/couple-2.jpg`,
      `${BASE_IMAGE_URL}/love/couple-3.jpg`,
    ],
    fallback: FALLBACK_IMAGES.love  // 直接引用备用图片配置
  },
  kitty: {
    local: [
      `${BASE_IMAGE_URL}/kitty/cat-window.jpg`,
      `${BASE_IMAGE_URL}/kitty/cat-blanket.jpg`,
      `${BASE_IMAGE_URL}/kitty/cat-white.jpg`,
      `${BASE_IMAGE_URL}/kitty/cat-flowers.jpg`,
      `${BASE_IMAGE_URL}/kitty/cats-together.jpg`,
    ],
    fallback: FALLBACK_IMAGES.kitty  // 直接引用备用图片配置
  }
};

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
    cover: () => getRandomImage('love'),  // 使用函数获取随机图片
    ...getRandomGameMetrics(5),
    rating: 4.9,
    description: 'Connect with AI companions and build meaningful relationships.',
    externalLink: {
      primary: 'http://love.saga4v.com/',
      fallbacks: ['http://love.ai666.click']
    },
    order: 1,
    showInHome: true,
  },
  {
    id: 6,
    title: 'Kitty Spin',
    category: 'game',
    cover: () => getRandomImage('kitty'),  // 使用函数获取随机图片
    ...getRandomGameMetrics(6),
    rating: 4.8,
    description: 'Adorable kitty-themed game, spin the wheel to win rewards!',
    externalLink: {
      primary: 'http://kitty.saga4v.com/',
      fallbacks: []
    },
    order: 2,
    showInHome: true,
  },
];