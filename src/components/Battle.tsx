import { useState } from 'react';
import type { DinoCard, PlayerCollection, BattleMove } from '../types';
import { BATTLE_MOVES, RARITY_COLORS, RARITY_LABELS } from '../types';
import { CARD_MAP } from '../data/dinosaurs';
import { calcDamage, cpuChooseMove, pickCpuCard, pickCpuCardSeeded } from '../utils/battle';
import { BarcodeScanner } from './BarcodeScanner';
import './Battle.css';

type BattlePhase = 'select' | 'choose' | 'resolve' | 'over';

interface FighterState {
  card: DinoCard;
  currentHp: number;
  reserve: number;
}

interface Props {
  collection: PlayerCollection;
  onBattleWon: () => void;
}

function ReserveDots({ count }: { count: number }) {
  return (
    <div className="reserve-dots">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className={`reserve-dot ${i < count ? 'reserve-dot--filled' : ''}`} />
      ))}
    </div>
  );
}

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color = pct > 0.5 ? '#66bb6a' : pct > 0.25 ? '#ff8f00' : '#f44336';
  return (
    <div className="hp-bar">
      <div className="hp-bar__fill" style={{ width: `${pct * 100}%`, background: color }} />
    </div>
  );
}

function MoveChip({ move, dim }: { move: BattleMove; dim?: boolean }) {
  const info = BATTLE_MOVES.find((m) => m.id === move)!;
  return (
    <div className={`move-chip ${dim ? 'move-chip--dim' : ''}`}>
      {info.emoji} {info.label}
    </div>
  );
}

export function Battle({ collection, onBattleWon }: Props) {
  const [phase, setPhase] = useState<BattlePhase>('select');
  const [player, setPlayer] = useState<FighterState | null>(null);
  const [cpu, setCpu] = useState<FighterState | null>(null);
  const [playerMove, setPlayerMove] = useState<BattleMove | null>(null);
  const [cpuMove, setCpuMove] = useState<BattleMove | null>(null);
  const [playerLastMove, setPlayerLastMove] = useState<BattleMove | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [won, setWon] = useState<boolean | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const ownedCards = collection.ownedCards
    .map((o) => CARD_MAP[o.cardId])
    .filter(Boolean);

  function handleBarcodeDetected(value: string) {
    setScannedBarcode(value);
    setShowScanner(false);
  }

  function startBattle(card: DinoCard) {
    const cpuCard = scannedBarcode
      ? pickCpuCardSeeded(scannedBarcode, card)
      : pickCpuCard(card);
    setPlayer({ card, currentHp: card.hp, reserve: 1 });
    setCpu({ card: cpuCard, currentHp: cpuCard.hp, reserve: 1 });
    setPhase('choose');
    setLog([]);
    setPlayerLastMove(null);
    setPlayerMove(null);
    setCpuMove(null);
    setWon(null);
  }

  function handlePlayerMove(move: BattleMove) {
    if (!player || !cpu) return;

    const cpuPick = cpuChooseMove(
      cpu.card,
      player.card,
      cpu.reserve,
      cpu.currentHp,
      playerLastMove,
    );

    const playerIsGuarding = move === 'guard';
    const cpuIsGuarding = cpuPick === 'guard';

    const playerDmg = calcDamage(player.card, cpu.card, move, cpuIsGuarding);
    const cpuDmg = calcDamage(cpu.card, player.card, cpuPick, playerIsGuarding);

    const moveCost = BATTLE_MOVES.find((m) => m.id === move)!.cost;
    const cpuMoveCost = BATTLE_MOVES.find((m) => m.id === cpuPick)!.cost;

    const newPlayerHp = Math.max(0, player.currentHp - cpuDmg);
    const newCpuHp = Math.max(0, cpu.currentHp - playerDmg);
    const newPlayerReserve = player.reserve - moveCost;
    const newCpuReserve = cpu.reserve - cpuMoveCost;

    const lines: string[] = [];
    if (playerDmg > 0) lines.push(`You dealt ${playerDmg} damage.`);
    else if (move === 'guard') lines.push('You braced for impact!');
    else lines.push('You held your reserves.');

    if (cpuDmg > 0) {
      if (playerIsGuarding && cpuPick === 'strike') {
        lines.push(`Guard absorbed half! CPU dealt ${cpuDmg} damage.`);
      } else {
        lines.push(`CPU dealt ${cpuDmg} damage.`);
      }
    } else if (cpuPick === 'guard') {
      lines.push('CPU braced for impact!');
    } else if (cpuPick === 'hold') {
      lines.push('CPU held its reserves.');
    }

    if (move === 'power_strike' && cpuIsGuarding) {
      lines.push('Power Strike ignored their Guard!');
    }

    setPlayerMove(move);
    setCpuMove(cpuPick);
    setLog(lines);
    setPlayerLastMove(move);

    setPlayer((prev) => prev ? { ...prev, currentHp: newPlayerHp, reserve: newPlayerReserve } : null);
    setCpu((prev) => prev ? { ...prev, currentHp: newCpuHp, reserve: newCpuReserve } : null);

    if (newPlayerHp <= 0 || newCpuHp <= 0) {
      const didWin = newCpuHp <= 0 && newPlayerHp > 0;
      setWon(didWin);
      setPhase('over');
      if (didWin) onBattleWon();
    } else {
      setPhase('resolve');
    }
  }

  function nextTurn() {
    setPlayer((prev) => prev ? { ...prev, reserve: Math.min(4, prev.reserve + 1) } : null);
    setCpu((prev) => prev ? { ...prev, reserve: Math.min(4, prev.reserve + 1) } : null);
    setPlayerMove(null);
    setCpuMove(null);
    setLog([]);
    setPhase('choose');
  }

  function reset() {
    setPhase('select');
    setPlayer(null);
    setCpu(null);
    setWon(null);
    setScannedBarcode(null);
  }

  // ── Select screen ──────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="battle-select">
        {showScanner && (
          <BarcodeScanner
            onDetected={handleBarcodeDetected}
            onClose={() => setShowScanner(false)}
          />
        )}

        <h2 className="battle-select__title">Battle</h2>

        {/* Enemy summoning */}
        <div className="battle-summon">
          {scannedBarcode ? (
            <div className="battle-summon__result">
              <span className="battle-summon__label">Enemy summoned</span>
              <span className="battle-summon__barcode">{scannedBarcode}</span>
              <button
                className="battle-summon__rescan"
                onClick={() => setShowScanner(true)}
              >
                📷 Scan again
              </button>
            </div>
          ) : (
            <button
              className="battle-summon__btn"
              onClick={() => setShowScanner(true)}
            >
              <span className="battle-summon__btn-icon">📷</span>
              <span className="battle-summon__btn-label">Scan Barcode to Summon Enemy</span>
              <span className="battle-summon__btn-sub">Or pick a fighter for a random opponent</span>
            </button>
          )}
        </div>

        <p className="battle-select__sub">Pick your fighter</p>

        {ownedCards.length === 0 ? (
          <p className="battle-select__empty">Open some packs first to get dinos!</p>
        ) : (
          <div className="battle-select__grid">
            {ownedCards.map((card) => (
              <button
                key={card.id}
                className="battle-select__card"
                style={{ '--rarity-color': RARITY_COLORS[card.rarity] } as React.CSSProperties}
                onClick={() => startBattle(card)}
              >
                <span className="battle-select__card-emoji">{card.emoji}</span>
                <span className="battle-select__card-name">{card.name}</span>
                <span
                  className="battle-select__card-rarity"
                  style={{ color: RARITY_COLORS[card.rarity] }}
                >
                  {RARITY_LABELS[card.rarity]}
                </span>
                <div className="battle-select__card-stats">
                  <span>⚔️ {card.atk}</span>
                  <span>🛡️ {card.def}</span>
                  <span>❤️ {card.hp}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!player || !cpu) return null;

  // ── Arena ──────────────────────────────────────────────────────────
  return (
    <div className="battle-arena">

      {/* CPU fighter (top) */}
      <div className="battle-fighter battle-fighter--cpu">
        <div className="battle-fighter__header">
          <span className="battle-fighter__name">{cpu.card.name}</span>
          <ReserveDots count={cpu.reserve} />
        </div>
        <HpBar current={cpu.currentHp} max={cpu.card.hp} />
        <span className="battle-fighter__hp-text">{cpu.currentHp} / {cpu.card.hp} HP</span>
        <span className="battle-fighter__emoji">{cpu.card.emoji}</span>
        {cpuMove && <MoveChip move={cpuMove} />}
      </div>

      {/* Log / result */}
      <div className="battle-middle">
        {phase === 'resolve' && log.length > 0 && (
          <div className="battle-log">
            {log.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        )}
        {phase === 'over' && (
          <div className={`battle-result ${won ? 'battle-result--win' : 'battle-result--lose'}`}>
            <span className="battle-result__title">{won ? '🏆 Victory!' : '💀 Defeated!'}</span>
            {won && <span className="battle-result__reward">+1 Pack earned!</span>}
          </div>
        )}
        {phase === 'choose' && (
          <div className="battle-hint">
            ⚡ Choose your move
          </div>
        )}
      </div>

      {/* Player fighter (bottom) */}
      <div className="battle-fighter battle-fighter--player">
        {playerMove && <MoveChip move={playerMove} />}
        <span className="battle-fighter__emoji">{player.card.emoji}</span>
        <span className="battle-fighter__hp-text">{player.currentHp} / {player.card.hp} HP</span>
        <HpBar current={player.currentHp} max={player.card.hp} />
        <div className="battle-fighter__header">
          <span className="battle-fighter__name">{player.card.name}</span>
          <ReserveDots count={player.reserve} />
        </div>
      </div>

      {/* Controls */}
      <div className="battle-controls">
        {phase === 'choose' && (
          <div className="battle-moves">
            {BATTLE_MOVES.map((move) => {
              const canAfford = player.reserve >= move.cost;
              return (
                <button
                  key={move.id}
                  className="battle-move-btn"
                  disabled={!canAfford}
                  onClick={() => handlePlayerMove(move.id)}
                  title={move.description}
                >
                  <span className="battle-move-btn__emoji">{move.emoji}</span>
                  <span className="battle-move-btn__label">{move.label}</span>
                  <span className="battle-move-btn__cost">
                    {move.cost > 0
                      ? Array.from({ length: move.cost }, (_, i) => <span key={i} className="reserve-dot reserve-dot--filled reserve-dot--sm" />)
                      : <span className="battle-move-btn__free">FREE</span>
                    }
                  </span>
                  <span className="battle-move-btn__desc">{move.description}</span>
                </button>
              );
            })}
          </div>
        )}

        {phase === 'resolve' && (
          <button className="btn btn--primary" onClick={nextTurn}>
            Next Turn →
          </button>
        )}

        {phase === 'over' && (
          <button className="btn btn--primary" onClick={reset}>
            Battle Again
          </button>
        )}
      </div>
    </div>
  );
}
