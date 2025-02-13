export interface ExternalLink {
  primary: string;
  fallbacks?: string[];
}

export interface Game {
  id: number;
  title: string;
  category: string;
  cover: string;
  players: number;
  rating: number;
  description: string;
  externalLink?: ExternalLink;
  order: number;
  showInHome: boolean;
  isPreview?: boolean;
  wishes: number;
  randomOrder?: number;
}

export type GameCategory = 'game' | 'agi' | 'companions';