export type Rarity = 'fossilized' | 'excavated' | 'ancient' | 'apex' | 'extinction';

export const RARITY_LABELS: Record<Rarity, string> = {
  fossilized: 'Fossilized',
  excavated: 'Excavated',
  ancient: 'Ancient',
  apex: 'Apex',
  extinction: 'Extinction-Level',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  fossilized: '#9e9e9e',
  excavated: '#66bb6a',
  ancient: '#42a5f5',
  apex: '#ab47bc',
  extinction: '#ff7043',
};

// Drop weights per pack (higher = more common)
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  fossilized: 55,
  excavated: 25,
  ancient: 12,
  apex: 6,
  extinction: 2,
};

export interface DinoCard {
  id: string;
  name: string;
  rarity: Rarity;
  type: string; // e.g. "Carnivore", "Herbivore", "Flying"
  atk: number;
  def: number;
  hp: number;
  emoji: string; // placeholder art
  description: string;
}

export interface OwnedCard {
  cardId: string;
  count: number;
  firstObtained: number; // timestamp
}

export interface PlayerCollection {
  ownedCards: OwnedCard[];
  packsAvailable: number;
  totalPacksOpened: number;
}
