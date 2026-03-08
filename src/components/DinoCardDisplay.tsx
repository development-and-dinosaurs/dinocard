import type { DinoCard } from '../types';
import { RARITY_COLORS, RARITY_LABELS } from '../types';
import './DinoCardDisplay.css';

interface Props {
  card: DinoCard;
  faceDown?: boolean;
  onClick?: () => void;
  count?: number;
}

export function DinoCardDisplay({ card, faceDown = false, onClick, count }: Props) {
  const color = RARITY_COLORS[card.rarity];

  if (faceDown) {
    return (
      <div className="dino-card dino-card--facedown" onClick={onClick}>
        <span className="dino-card__back-emoji">🥚</span>
      </div>
    );
  }

  return (
    <div
      className="dino-card"
      style={{ '--rarity-color': color } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="dino-card__rarity-bar" />
      <div className="dino-card__emoji">{card.emoji}</div>
      <div className="dino-card__name">{card.name}</div>
      <div className="dino-card__type">{card.type}</div>
      <div className="dino-card__rarity-label" style={{ color }}>
        {RARITY_LABELS[card.rarity]}
      </div>
      <div className="dino-card__stats">
        <span title="Attack">⚔️ {card.atk}</span>
        <span title="Defense">🛡️ {card.def}</span>
        <span title="HP">❤️ {card.hp}</span>
      </div>
      <div className="dino-card__desc">{card.description}</div>
      {count !== undefined && count > 1 && (
        <div className="dino-card__count">×{count}</div>
      )}
    </div>
  );
}
