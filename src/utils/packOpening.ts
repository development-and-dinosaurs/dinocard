import type { DinoCard, Rarity } from '../types';
import { RARITY_WEIGHTS } from '../types';
import { ALL_CARDS } from '../data/dinosaurs';

const CARDS_PER_PACK = 5;

function weightedRandomRarity(): Rarity {
  const entries = Object.entries(RARITY_WEIGHTS) as [Rarity, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [rarity, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return 'fossilized';
}

function randomCardOfRarity(rarity: Rarity): DinoCard {
  const pool = ALL_CARDS.filter((c) => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function openPack(): DinoCard[] {
  // Guarantee at least one card >= excavated
  const cards: DinoCard[] = [];
  let hasGuaranteed = false;

  for (let i = 0; i < CARDS_PER_PACK; i++) {
    if (i === CARDS_PER_PACK - 1 && !hasGuaranteed) {
      // Last slot: force at least excavated
      const rarities: Rarity[] = ['excavated', 'ancient', 'apex', 'extinction'];
      const guaranteed = rarities[Math.floor(Math.random() * rarities.length * 0.7)];
      cards.push(randomCardOfRarity(guaranteed ?? 'excavated'));
    } else {
      const rarity = weightedRandomRarity();
      if (rarity !== 'fossilized') hasGuaranteed = true;
      cards.push(randomCardOfRarity(rarity));
    }
  }

  return cards;
}
