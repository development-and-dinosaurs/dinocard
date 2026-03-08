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

export type BattleMove = 'strike' | 'power_strike' | 'guard' | 'hold';

export interface BattleMoveInfo {
  id: BattleMove;
  label: string;
  cost: number;
  emoji: string;
  description: string;
}

export const BATTLE_MOVES: BattleMoveInfo[] = [
  {
    id: 'strike',
    label: 'Strike',
    cost: 1,
    emoji: '⚔️',
    description: 'Basic attack. Blocked by Guard.',
  },
  {
    id: 'power_strike',
    label: 'Power Strike',
    cost: 2,
    emoji: '💥',
    description: 'Heavy attack. Ignores Guard.',
  },
  {
    id: 'guard',
    label: 'Guard',
    cost: 1,
    emoji: '🛡️',
    description: 'Halves incoming Strike damage.',
  },
  {
    id: 'hold',
    label: 'Hold',
    cost: 0,
    emoji: '⏳',
    description: 'Save your reserves for next turn.',
  },
];
