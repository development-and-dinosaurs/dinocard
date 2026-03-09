import type { DinoCard, BattleMove, Rarity } from '../types';
import { ALL_CARDS } from '../data/dinosaurs';

const RARITY_ORDER: Rarity[] = ['fossilized', 'excavated', 'ancient', 'apex', 'extinction'];

function hashString(str: string): number {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickCpuCard(playerCard: DinoCard): DinoCard {
  const playerIdx = RARITY_ORDER.indexOf(playerCard.rarity);
  const candidates = ALL_CARDS.filter((c) => {
    const idx = RARITY_ORDER.indexOf(c.rarity);
    return Math.abs(idx - playerIdx) <= 1;
  });
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Deterministically pick an enemy card seeded by a scanned barcode value. */
export function pickCpuCardSeeded(barcode: string, playerCard: DinoCard): DinoCard {
  const rng = mulberry32(hashString(barcode));
  const playerIdx = RARITY_ORDER.indexOf(playerCard.rarity);
  const candidates = ALL_CARDS.filter((c) => {
    const idx = RARITY_ORDER.indexOf(c.rarity);
    return Math.abs(idx - playerIdx) <= 1;
  });
  return candidates[Math.floor(rng() * candidates.length)];
}

/**
 * Damage formula:
 *   Strike:       max(1, ATK × 0.8 − DEF × 0.3)  — halved if defender used Guard
 *   Power Strike: max(1, ATK × 1.5 − DEF × 0.15) — ignores Guard entirely
 *   Guard / Hold: 0 damage
 */
export function calcDamage(
  attackerCard: DinoCard,
  defenderCard: DinoCard,
  move: BattleMove,
  defenderGuarding: boolean,
): number {
  if (move === 'guard' || move === 'hold') return 0;

  if (move === 'strike') {
    const raw = Math.max(1, Math.floor(attackerCard.atk * 0.8 - defenderCard.def * 0.3));
    return defenderGuarding ? Math.max(1, Math.floor(raw * 0.5)) : raw;
  }

  if (move === 'power_strike') {
    return Math.max(1, Math.floor(attackerCard.atk * 1.5 - defenderCard.def * 0.15));
  }

  return 0;
}

export function cpuChooseMove(
  cpuCard: DinoCard,
  _playerCard: DinoCard,
  cpuReserve: number,
  cpuHp: number,
  playerLastMove: BattleMove | null,
): BattleMove {
  // Can't afford anything — hold
  if (cpuReserve < 1) return 'hold';

  const cpuHpPct = cpuHp / cpuCard.hp;

  // Low HP: lean towards guarding
  if (cpuHpPct < 0.3 && Math.random() < 0.5) return 'guard';

  // Player attacked last turn — try to counter with Power Strike or Guard
  if (playerLastMove === 'strike') {
    if (cpuReserve >= 2 && Math.random() < 0.35) return 'power_strike';
    if (Math.random() < 0.3) return 'guard';
  }

  // Build reserves if very low
  if (cpuReserve === 1 && Math.random() < 0.25) return 'hold';

  // Spend Power Strike if reserves allow
  if (cpuReserve >= 2 && Math.random() < 0.35) return 'power_strike';

  // Default: mostly attack, sometimes guard
  return Math.random() < 0.7 ? 'strike' : 'guard';
}
