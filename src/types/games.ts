export interface Game {
  id: number;
  title: string;
  category: string;
  cover: string;
  players: number;
  rating: number;
  description: string;
  externalLink?: string;
  order: number;
  showInHome: boolean;
  isPreview?: boolean;
  wishes: number;
}