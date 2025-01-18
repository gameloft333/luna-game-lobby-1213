import { differenceInDays } from 'date-fns';

// 产品生命周期阶段
enum ProductStage {
  INTRODUCTION = 'introduction',    // 导入期
  GROWTH = 'growth',               // 成长期
  MATURITY = 'maturity',           // 成熟期
  SATURATION = 'saturation'        // 饱和期
}

interface GrowthParams {
  baseMin: number;        // 基础最小值
  baseMax: number;        // 基础最大值
  launchDate: Date;       // 产品发布日期
  growthFactor: number;   // 增长因子(0-1之间)
  volatility: number;     // 波动率(0-1之间)
}

export function calculateGrowthMetrics(params: GrowthParams) {
  const {
    baseMin = 100,
    baseMax = 999,
    launchDate = new Date('2024-12-13'),
    growthFactor = 0.15,
    volatility = 0.1
  } = params;

  // 计算产品上线天数
  const daysFromLaunch = differenceInDays(new Date(), launchDate);
  
  // 确定当前所处的生命周期阶段
  const getProductStage = (days: number): ProductStage => {
    if (days < 90) return ProductStage.INTRODUCTION;
    if (days < 180) return ProductStage.GROWTH;
    if (days < 270) return ProductStage.MATURITY;
    return ProductStage.SATURATION;
  };

  const stage = getProductStage(daysFromLaunch);

  // 根据不同阶段设置增长系数
  const getStageMultiplier = (stage: ProductStage): number => {
    switch (stage) {
      case ProductStage.INTRODUCTION: return 1;
      case ProductStage.GROWTH: return 2.5;
      case ProductStage.MATURITY: return 1.8;
      case ProductStage.SATURATION: return 1.2;
    }
  };

  // 基础增长值
  const baseGrowth = baseMin + Math.random() * (baseMax - baseMin);
  
  // 应用增长系数
  const stageMultiplier = getStageMultiplier(stage);
  const timeMultiplier = Math.log(daysFromLaunch + 1) * growthFactor;
  
  // 添加随机波动
  const randomVariation = 1 + (Math.random() * 2 - 1) * volatility;

  // 计算最终值
  const finalValue = Math.round(
    baseGrowth * stageMultiplier * (1 + timeMultiplier) * randomVariation
  );

  // 生成wishes值(通常比players高3-5倍)
  const wishesMultiplier = 3 + Math.random() * 2;
  const wishes = Math.round(finalValue * wishesMultiplier);

  return {
    players: finalValue,
    wishes: wishes,
    stage: stage
  };
}

// 使用示例
export function getRandomGameMetrics(gameId: number): { players: number; wishes: number } {
  // 为每个游戏设置不同的基础参数
  const gameParams: Record<number, GrowthParams> = {
    1: {
      baseMin: 200,
      baseMax: 800,
      launchDate: new Date('2024-01-15'),
      growthFactor: 0.2,
      volatility: 0.15
    },
    2: {
      baseMin: 150,
      baseMax: 600,
      launchDate: new Date('2024-02-01'),
      growthFactor: 0.18,
      volatility: 0.12
    },
    // ... 可以为其他游戏添加参数
  };

  const defaultParams: GrowthParams = {
    baseMin: 100,
    baseMax: 500,
    launchDate: new Date('2024-01-01'),
    growthFactor: 0.15,
    volatility: 0.1
  };

  const params = gameParams[gameId] || defaultParams;
  return calculateGrowthMetrics(params);
} 