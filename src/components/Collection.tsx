import type { PlayerCollection } from '../types';
import { ALL_CARDS } from '../data/dinosaurs';
import { DinoCardDisplay } from './DinoCardDisplay';
import './Collection.css';

interface Props {
  collection: PlayerCollection;
}

const RARITY_ORDER = ['extinction', 'apex', 'ancient', 'excavated', 'fossilized'] as const;

export function Collection({ collection }: Props) {
  const ownedMap = new Map(collection.ownedCards.map((o) => [o.cardId, o]));
  const totalUnique = ownedMap.size;
  const totalCards = ALL_CARDS.length;

  const cardsByRarity = RARITY_ORDER.map((rarity) => ({
    rarity,
    cards: ALL_CARDS.filter((c) => c.rarity === rarity),
  }));

  return (
    <div className="collection">
      <div className="collection__header">
        <span className="collection__progress">
          {totalUnique} / {totalCards} discovered
        </span>
        <div className="collection__bar">
          <div
            className="collection__bar-fill"
            style={{ width: `${(totalUnique / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {cardsByRarity.map(({ rarity, cards }) => (
        <section key={rarity} className="collection__section">
          <h3 className="collection__section-title">
            {rarity === 'fossilized' && '🪨 Fossilized'}
            {rarity === 'excavated' && '🟢 Excavated'}
            {rarity === 'ancient' && '🔵 Ancient'}
            {rarity === 'apex' && '🟣 Apex'}
            {rarity === 'extinction' && '🔥 Extinction-Level'}
          </h3>
          <div className="collection__grid">
            {cards.map((card) => {
              const owned = ownedMap.get(card.id);
              return (
                <div
                  key={card.id}
                  className={`collection__card-wrap ${owned ? '' : 'collection__card-wrap--locked'}`}
                >
                  <DinoCardDisplay
                    card={card}
                    count={owned?.count}
                    faceDown={!owned}
                  />
                  {!owned && (
                    <div className="collection__locked-label">???</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {totalUnique === 0 && (
        <p className="collection__empty">
          Open some packs to start your collection!
        </p>
      )}
    </div>
  );
}
