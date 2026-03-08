import { useState } from 'react';
import type { DinoCard } from '../types';
import { openPack } from '../utils/packOpening';
import { DinoCardDisplay } from './DinoCardDisplay';
import './PackOpener.css';

type Phase = 'idle' | 'revealing' | 'done';

interface Props {
  packsAvailable: number;
  onPackOpened: (cards: DinoCard[]) => void;
}

export function PackOpener({ packsAvailable, onPackOpened }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cards, setCards] = useState<DinoCard[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  function handleOpenPack() {
    if (packsAvailable <= 0) return;
    const newCards = openPack();
    setCards(newCards);
    setRevealed(new Array(newCards.length).fill(false));
    setPhase('revealing');
  }

  function handleReveal(index: number) {
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      if (next.every(Boolean)) {
        setTimeout(() => setPhase('done'), 400);
      }
      return next;
    });
  }

  function handleRevealAll() {
    setRevealed(new Array(cards.length).fill(true));
    setTimeout(() => setPhase('done'), 400);
  }

  function handleKeep() {
    onPackOpened(cards);
    setPhase('idle');
    setCards([]);
    setRevealed([]);
  }

  if (phase === 'idle') {
    return (
      <div className="pack-opener">
        <div className="pack-opener__pack-visual">
          <span className="pack-opener__pack-emoji">📦</span>
          <div className="pack-opener__pack-label">Dino Pack</div>
          <div className="pack-opener__pack-sub">5 cards · mystery rarities</div>
        </div>
        <div className="pack-opener__count">
          {packsAvailable > 0
            ? `${packsAvailable} pack${packsAvailable !== 1 ? 's' : ''} available`
            : 'No packs available'}
        </div>
        <button
          className="btn btn--primary"
          disabled={packsAvailable <= 0}
          onClick={handleOpenPack}
        >
          Open Pack
        </button>
        {packsAvailable <= 0 && (
          <p className="pack-opener__empty-hint">
            Win battles to earn more packs!
          </p>
        )}
      </div>
    );
  }

  const allRevealed = revealed.every(Boolean);

  return (
    <div className="pack-opener pack-opener--revealing">
      <h2 className="pack-opener__title">
        {phase === 'done' ? 'You got these cards!' : 'Tap each card to reveal'}
      </h2>

      <div className="pack-opener__cards">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`pack-opener__card-slot ${revealed[i] ? 'pack-opener__card-slot--revealed' : ''}`}
          >
            <DinoCardDisplay
              card={card}
              faceDown={!revealed[i]}
              onClick={revealed[i] ? undefined : () => handleReveal(i)}
            />
          </div>
        ))}
      </div>

      <div className="pack-opener__actions">
        {!allRevealed && (
          <button className="btn btn--secondary" onClick={handleRevealAll}>
            Reveal All
          </button>
        )}
        {phase === 'done' && (
          <button className="btn btn--primary" onClick={handleKeep}>
            Add to Collection →
          </button>
        )}
      </div>
    </div>
  );
}
