import type { DinoCard } from '../types';

export const ALL_CARDS: DinoCard[] = [
  // Fossilized (Common)
  {
    id: 'raptor',
    name: 'Velociraptor',
    rarity: 'fossilized',
    type: 'Carnivore',
    atk: 40,
    def: 25,
    hp: 60,
    emoji: '🦖',
    description: 'Quick and cunning. Hunts in packs.',
  },
  {
    id: 'iguanodon',
    name: 'Iguanodon',
    rarity: 'fossilized',
    type: 'Herbivore',
    atk: 20,
    def: 45,
    hp: 80,
    emoji: '🦕',
    description: 'Gentle giant with a spiked thumb.',
  },
  {
    id: 'stegosaurus',
    name: 'Stegosaurus',
    rarity: 'fossilized',
    type: 'Herbivore',
    atk: 30,
    def: 50,
    hp: 70,
    emoji: '🦕',
    description: 'Plates on its back absorb the sun.',
  },

  // Excavated (Uncommon)
  {
    id: 'ankylosaurus',
    name: 'Ankylosaurus',
    rarity: 'excavated',
    type: 'Herbivore',
    atk: 35,
    def: 70,
    hp: 90,
    emoji: '🦕',
    description: 'Living tank with a bone-crushing tail club.',
  },
  {
    id: 'dilophosaurus',
    name: 'Dilophosaurus',
    rarity: 'excavated',
    type: 'Carnivore',
    atk: 55,
    def: 30,
    hp: 65,
    emoji: '🦖',
    description: 'Spits venom to blind its prey.',
  },
  {
    id: 'parasaurolophus',
    name: 'Parasaurolophus',
    rarity: 'excavated',
    type: 'Herbivore',
    atk: 25,
    def: 40,
    hp: 85,
    emoji: '🦕',
    description: 'Calls to the herd with its head crest.',
  },

  // Ancient (Rare)
  {
    id: 'triceratops',
    name: 'Triceratops',
    rarity: 'ancient',
    type: 'Herbivore',
    atk: 60,
    def: 65,
    hp: 100,
    emoji: '🦏',
    description: 'Three horns that can pierce solid bone.',
  },
  {
    id: 'carnotaurus',
    name: 'Carnotaurus',
    rarity: 'ancient',
    type: 'Carnivore',
    atk: 75,
    def: 35,
    hp: 85,
    emoji: '🦖',
    description: 'Bull horns and explosive bursts of speed.',
  },

  // Apex (Epic)
  {
    id: 'spinosaurus',
    name: 'Spinosaurus',
    rarity: 'apex',
    type: 'Carnivore',
    atk: 85,
    def: 55,
    hp: 120,
    emoji: '🐊',
    description: 'Longest predator to ever walk the earth.',
  },
  {
    id: 'trex',
    name: 'T-Rex',
    rarity: 'apex',
    type: 'Carnivore',
    atk: 95,
    def: 60,
    hp: 130,
    emoji: '🦖',
    description: 'The king. Its roar shakes the ground.',
  },

  // Extinction-Level (Legendary)
  {
    id: 'giganotosaurus',
    name: 'Giganotosaurus',
    rarity: 'extinction',
    type: 'Carnivore',
    atk: 110,
    def: 70,
    hp: 150,
    emoji: '🔥',
    description: 'Larger than T-Rex. A walking extinction event.',
  },
];

export const CARD_MAP: Record<string, DinoCard> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c])
);
