'use client';

import { Card, SUIT_COLORS, SUIT_SYMBOL, RANK_LABEL } from '@/app/lib/deck';

interface CardViewProps {
  card: Card;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  draggable?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
}

export function CardView({ card, onClick, onDragStart, draggable, selected, style }: CardViewProps) {
  if (!card.faceUp) {
    return (
      <div
        onClick={onClick}
        style={style}
        className={`relative w-full h-full rounded-lg border border-white/10 cursor-pointer select-none overflow-hidden ${selected ? 'ring-2 ring-white' : ''}`}
      >
        {/* Card back: dark with grid pattern */}
        <div className="absolute inset-0 bg-[#1e1e1e]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '8px 8px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/20 font-black text-xs tracking-widest">CD</span>
        </div>
      </div>
    );
  }

  const color = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOL[card.suit];
  const label = RANK_LABEL[card.rank];

  return (
    <div
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      style={{ ...style, backgroundColor: color }}
      className={`relative w-full h-full rounded-lg cursor-pointer select-none overflow-hidden transition-transform active:scale-95 ${selected ? 'ring-2 ring-white scale-105' : ''}`}
    >
      {/* Top-left rank + symbol */}
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span className="text-black font-black text-xs leading-none">{label}</span>
        <span className="text-black text-[9px] leading-none">{symbol}</span>
      </div>
      {/* Center symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-black/30 font-black" style={{ fontSize: 'clamp(16px, 4vw, 28px)' }}>{symbol}</span>
      </div>
      {/* Bottom-right (rotated) */}
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className="text-black font-black text-xs leading-none">{label}</span>
        <span className="text-black text-[9px] leading-none">{symbol}</span>
      </div>
    </div>
  );
}

export function EmptyPile({ onClick, label }: { onClick?: () => void; label?: string }) {
  return (
    <div
      onClick={onClick}
      className="w-full h-full rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer"
    >
      {label && <span className="text-white/20 text-xs font-bold tracking-widest">{label}</span>}
    </div>
  );
}
