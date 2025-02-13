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
  ],
  zen: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',  // 冥想场景
    'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5',  // 平静湖面
    'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83',  // 治愈森林
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',  // 日落
  ],
  mood: [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88',  // 情绪表达
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',  // 思考
    'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b',  // 心情变化
    'https://images.unsplash.com/photo-1517677129300-07b130802f46',  // 情绪光谱
  ],
  bible: [
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65',  // 圣经
    'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6',  // 教堂
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df',  // 祈祷
    'https://images.unsplash.com/photo-1544450804-9e5f64cb18de',  // 十字架
  ],
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
  },
  zen: {
    path: `${BASE_IMAGE_URL}/zen`,
    getFallback: () => getRandomFallback('zen')  // 使用函数获取随机备用图片
  },
  mood: {
    path: `${BASE_IMAGE_URL}/mood`,
    getFallback: () => getRandomFallback('mood')  // 使用函数获取随机备用图片
  },
  bible: {
    path: `${BASE_IMAGE_URL}/bible`,
    getFallback: () => getRandomFallback('bible')  // 使用函数获取随机备用图片
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
type ProjectType = 'love' | 'kitty' | 'zen' | 'mood' | 'bible';

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
  },
  zen: {
    local: [
      `${BASE_IMAGE_URL}/zen/meditation-1.jpg`,
      `${BASE_IMAGE_URL}/zen/meditation-2.jpg`,
      `${BASE_IMAGE_URL}/zen/meditation-3.jpg`,
    ],
    fallback: FALLBACK_IMAGES.zen  // 直接引用备用图片配置
  },
  mood: {
    local: [
      `${BASE_IMAGE_URL}/mood/mood-1.jpg`,
      `${BASE_IMAGE_URL}/mood/mood-2.jpg`,
      `${BASE_IMAGE_URL}/mood/mood-3.jpg`,
    ],
    fallback: FALLBACK_IMAGES.mood  // 直接引用备用图片配置
  },
  bible: {
    local: [
      `${BASE_IMAGE_URL}/bible/bible-1.jpg`,
      `${BASE_IMAGE_URL}/bible/bible-2.jpg`,
      `${BASE_IMAGE_URL}/bible/bible-3.jpg`,
    ],
    fallback: FALLBACK_IMAGES.bible  // 直接引用备用图片配置
  }
};

// 添加更强的随机性
const getRandomOrder = (min: number, max: number) => {
  // 使用当前时间戳增加随机性
  const timestamp = new Date().getTime();
  const random = Math.random() * timestamp;
  return Math.floor(random % (max - min + 1)) + min;
};

// 获取随机排序后的游戏列表
export const getRandomizedGames = (): Game[] => {
  console.log('[DEBUG] 开始随机排序游戏列表，时间戳:', new Date().toISOString());
  
  const randomizedGames = GAMES.map(game => ({
    ...game,
    randomOrder: getRandomOrder(1, GAMES.length * 100) // 增大随机数范围
  })).sort((a, b) => {
    if (a.showInHome !== b.showInHome) {
      return a.showInHome ? -1 : 1;
    }
    return (a.randomOrder || 0) - (b.randomOrder || 0);
  });

  console.log('[DEBUG] 随机排序结果:', 
    randomizedGames.map(g => ({
      id: g.id,
      title: g.title,
      randomOrder: g.randomOrder
    }))
  );

  return randomizedGames;
};

export const GAMES: Game[] = [
  {
    id: 1,
    title: 'games.cryptoQuest.title',  // 使用多语言键值
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41',
    ...getRandomGameMetrics(1),  // 这里会自动生成 players 和 wishes
    rating: 4.8,
    description: 'games.cryptoQuest.description',  // 使用多语言键值
    order: 6,
    showInHome: true,
    isPreview: true,
  },
  {
    id: 2,
    title: 'games.nftLegends.title',  // 使用多语言键值
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    ...getRandomGameMetrics(2),  // 这里会自动生成 players 和 wishes
    rating: 4.6,
    description: 'games.nftLegends.description',  // 使用多语言键值
    order: 3,
    showInHome: true,
    isPreview: true,
  },
  {
    id: 3,
    title: 'games.metaRacer.title',  // 使用多语言键值
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f',
    ...getRandomGameMetrics(3),  // 这里会自动生成 players 和 wishes
    rating: 4.7,
    description: 'games.metaRacer.description',  // 使用多语言键值
    order: 4,
    showInHome: false,
    isPreview: true,
  },
  {
    id: 4,
    title: 'games.aiChess.title',  // 使用多语言键值
    category: 'game', 
    cover: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793',
    ...getRandomGameMetrics(4),  // 这里会自动生成 players 和 wishes
    rating: 4.9,
    description: 'games.aiChess.description',  // 使用多语言键值
    order: 5,
    showInHome: true,
    isPreview: true,
  },
  {
    id: 5,
    title: 'games.aiCompanions.title',  // 使用多语言键值
    category: 'agi',
    cover: () => getRandomImage('love'),  // 使用函数获取随机图片
    ...getRandomGameMetrics(5),
    rating: 4.9,
    description: 'games.aiCompanions.description',  // 使用多语言键值
    externalLink: {
      primary: 'http://love.saga4v.com/',
      fallbacks: ['http://love.ai666.click']
    },
    order: 1,
    showInHome: true,
  },
  {
    id: 6,
    title: 'games.kittySpin.title',  // 使用多语言键值
    category: 'game',
    cover: () => getRandomImage('kitty'),  // 使用函数获取随机图片
    ...getRandomGameMetrics(6),
    rating: 4.8,
    description: 'games.kittySpin.description',  // 使用多语言键值
    externalLink: {
      primary: 'http://kitty.saga4v.com/',
      fallbacks: []
    },
    order: 2,
    showInHome: true,
  },
  {
    id: 7,
    title: 'games.zen.title',  // 使用多语言键值替换硬编码文本
    category: 'agi',
    cover: () => getRandomImage('zen'),  // 需要添加zen相关的图片配置
    ...getRandomGameMetrics(7),
    rating: 4.9,
    description: 'games.zen.description',  // 使用多语言键值替换硬编码文本
    externalLink: {
      primary: 'https://zen.saga4v.com/',
      fallbacks: []
    },
    order: 7,
    showInHome: true,
  },
  {
    id: 8,
    title: 'games.mood.title',  // 使用多语言键值替换硬编码文本
    category: 'agi',
    cover: () => getRandomImage('mood'),  // 需要添加mood相关的图片配置
    ...getRandomGameMetrics(8),
    rating: 4.8,
    description: 'games.mood.description',  // 使用多语言键值替换硬编码文本
    externalLink: {
      primary: 'https://mood.saga4v.com/',
      fallbacks: []
    },
    order: 8,
    showInHome: true,
  },
  {
    id: 9,
    title: 'games.bible.title',  // 使用多语言键值替换硬编码文本
    category: 'agi',
    cover: () => getRandomImage('bible'),  // 需要添加bible相关的图片配置
    ...getRandomGameMetrics(9),
    rating: 4.9,
    description: 'games.bible.description',  // 使用多语言键值替换硬编码文本
    externalLink: {
      primary: 'https://aibible.saga4v.com/',
      fallbacks: []
    },
    order: 9,
    showInHome: true,
  },
];