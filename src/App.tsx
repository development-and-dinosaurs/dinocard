import { useState } from 'react';
import type { DinoCard, PlayerCollection } from './types';
import { loadCollection, saveCollection } from './utils/storage';
import { PackOpener } from './components/PackOpener';
import { Collection } from './components/Collection';
import { Battle } from './components/Battle';
import './App.css';

type Tab = 'packs' | 'collection' | 'battle';

function App() {
  const [collection, setCollection] = useState<PlayerCollection>(loadCollection);
  const [tab, setTab] = useState<Tab>('packs');

  function handleBattleWon() {
    setCollection((prev) => {
      const next: PlayerCollection = {
        ...prev,
        packsAvailable: prev.packsAvailable + 1,
      };
      saveCollection(next);
      return next;
    });
  }

  function handlePackOpened(cards: DinoCard[]) {
    setCollection((prev) => {
      const owned = [...prev.ownedCards];
      for (const card of cards) {
        const existing = owned.find((o) => o.cardId === card.id);
        if (existing) {
          existing.count += 1;
        } else {
          owned.push({ cardId: card.id, count: 1, firstObtained: Date.now() });
        }
      }
      const next: PlayerCollection = {
        ownedCards: owned,
        packsAvailable: prev.packsAvailable - 1,
        totalPacksOpened: prev.totalPacksOpened + 1,
      };
      saveCollection(next);
      return next;
    });
    setTab('collection');
  }

  const totalCards = collection.ownedCards.reduce((s, o) => s + o.count, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__left">
          <span className="app-header__logo">🦖</span>
          <span className="app-header__title">DinoCard</span>
        </div>
        <div className="app-header__right">
          <span className="app-header__stat">📦 {collection.packsAvailable}</span>
          <span className="app-header__stat">🃏 {totalCards}</span>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`app-nav__tab ${tab === 'packs' ? 'app-nav__tab--active' : ''}`}
          onClick={() => setTab('packs')}
        >
          Open Packs
        </button>
        <button
          className={`app-nav__tab ${tab === 'collection' ? 'app-nav__tab--active' : ''}`}
          onClick={() => setTab('collection')}
        >
          Collection
        </button>
        <button
          className={`app-nav__tab ${tab === 'battle' ? 'app-nav__tab--active' : ''}`}
          onClick={() => setTab('battle')}
        >
          Battle
        </button>
      </nav>

      <main className="app-main">
        {tab === 'packs' && (
          <PackOpener
            packsAvailable={collection.packsAvailable}
            onPackOpened={handlePackOpened}
          />
        )}
        {tab === 'collection' && <Collection collection={collection} />}
        {tab === 'battle' && (
          <Battle collection={collection} onBattleWon={handleBattleWon} />
        )}
      </main>
    </div>
  );
}

export default App;
