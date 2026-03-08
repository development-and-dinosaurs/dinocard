import type { PlayerCollection } from '../types';

const STORAGE_KEY = 'dinocard_collection';

const DEFAULT_COLLECTION: PlayerCollection = {
  ownedCards: [],
  packsAvailable: 3, // starter packs
  totalPacksOpened: 0,
};

export function loadCollection(): PlayerCollection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_COLLECTION };
    return JSON.parse(raw) as PlayerCollection;
  } catch {
    return { ...DEFAULT_COLLECTION };
  }
}

export function saveCollection(collection: PlayerCollection): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function resetCollection(): PlayerCollection {
  const fresh = { ...DEFAULT_COLLECTION };
  saveCollection(fresh);
  return fresh;
}
