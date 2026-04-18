'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Card } from '@/app/lib/deck';
import {
  GameState, initGame, drawFromStock, moveWasteToFoundation,
  moveWasteToTableau, moveTableauToFoundation, moveTableauToTableau,
  autoMoveToFoundations,
} from '@/app/lib/solitaire';
import { SUITS, SUIT_SYMBOL } from '@/app/lib/deck';
import { ChainData, getLabelColor } from '@/app/lib/types';
import { CardView, EmptyPile } from './CardView';
import { WinOverlay } from './WinOverlay';

interface Props { chainData: ChainData; }

type Selection =
  | { source: 'waste' }
  | { source: 'tableau'; col: number; cardIdx: number }
  | null;

type DragSource =
  | { type: 'waste' }
  | { type: 'tableau'; col: number; cardIdx: number };

interface DragRef {
  source: DragSource;
  cards: Card[];
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  active: boolean;
  clickFn: () => void;
}

interface GhostState {
  source: DragSource;
  cards: Card[];
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
}

const CARD_W = 52;
const CARD_H = 72;
const TABLEAU_OVERLAP = 20;
const DRAG_THRESHOLD = 8;

export function SolitaireGame({ chainData }: Props) {
  const [game, setGame] = useState<GameState>(() => initGame(chainData.seed));
  const [selection, setSelection] = useState<Selection>(null);
  const [won, setWon] = useState(false);
  const [ghost, setGhost] = useState<GhostState | null>(null);

  const dragRef = useRef<DragRef | null>(null);
  const lastTapRef = useRef<{ key: string; time: number } | null>(null);
  const gameRef = useRef(game);
  gameRef.current = game;

  const foundationRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const tableauRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null, null]);

  const update = useCallback((next: GameState) => {
    setGame(next);
    if (next.won) setWon(true);
  }, []);

  const getDropTarget = useCallback((x: number, y: number) => {
    for (let i = 0; i < 4; i++) {
      const el = foundationRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        return { type: 'foundation' as const, index: i };
    }
    for (let i = 0; i < 7; i++) {
      const el = tableauRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        return { type: 'tableau' as const, col: i };
    }
    return null;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const ds = dragRef.current;
      if (!ds) return;
      const dx = e.clientX - ds.startX;
      const dy = e.clientY - ds.startY;
      const nowActive = ds.active || Math.hypot(dx, dy) > DRAG_THRESHOLD;
      dragRef.current = { ...ds, active: nowActive };
      if (nowActive) {
        setGhost({
          source: ds.source,
          cards: ds.cards,
          offsetX: ds.offsetX,
          offsetY: ds.offsetY,
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    const onUp = (e: PointerEvent) => {
      const ds = dragRef.current;
      if (!ds) return;
      dragRef.current = null;
      setGhost(null);

      if (!ds.active) {
        ds.clickFn();
        return;
      }

      setSelection(null);
      const target = getDropTarget(e.clientX, e.clientY);
      if (!target) return;

      const g = gameRef.current;
      if (target.type === 'foundation') {
        if (ds.source.type === 'waste') update(moveWasteToFoundation(g));
        else if (ds.source.type === 'tableau') update(moveTableauToFoundation(g, ds.source.col));
      } else {
        const col = target.col;
        if (ds.source.type === 'waste') {
          const next = moveWasteToTableau(g, col);
          if (next !== g) update(next);
        } else if (ds.source.type === 'tableau') {
          const next = moveTableauToTableau(g, ds.source.col, ds.source.cardIdx, col);
          if (next !== g) update(next);
        }
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [update, getDropTarget]);

  const autoMoveCard = (source: DragSource) => {
    setSelection(null);
    const g = gameRef.current;
    if (source.type === 'waste') {
      let next = moveWasteToFoundation(g);
      if (next !== g) { update(next); return; }
      for (let c = 0; c < 7; c++) {
        next = moveWasteToTableau(g, c);
        if (next !== g) { update(next); return; }
      }
    } else {
      const { col, cardIdx } = source;
      const topIdx = g.tableau[col].length - 1;
      if (cardIdx === topIdx) {
        const next = moveTableauToFoundation(g, col);
        if (next !== g) { update(next); return; }
      }
      for (let c = 0; c < 7; c++) {
        if (c === col) continue;
        const next = moveTableauToTableau(g, col, cardIdx, c);
        if (next !== g) { update(next); return; }
      }
    }
  };

  const startDrag = (
    e: React.PointerEvent,
    source: DragSource,
    cards: Card[],
    clickFn: () => void,
  ) => {
    e.preventDefault();
    const key = source.type === 'waste' ? 'waste' : `${source.col}-${source.cardIdx}`;
    const now = Date.now();
    const last = lastTapRef.current;
    if (last && last.key === key && now - last.time < 350) {
      lastTapRef.current = null;
      autoMoveCard(source);
      return;
    }
    lastTapRef.current = { key, time: now };
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      source, cards, clickFn,
      startX: e.clientX, startY: e.clientY,
      offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top,
      active: false,
    };
  };

  // --- Click handlers ---
  const handleStockClick = () => {
    setSelection(null);
    update(drawFromStock(game));
  };

  const handleWasteClick = () => {
    if (game.waste.length === 0) return;
    setSelection(s => s?.source === 'waste' ? null : { source: 'waste' });
  };

  const handleFoundationClick = (fi: number) => {
    if (selection?.source === 'waste') update(moveWasteToFoundation(game));
    else if (selection?.source === 'tableau') update(moveTableauToFoundation(game, selection.col));
    setSelection(null);
  };

  const handleTableauClick = (col: number, cardIdx: number) => {
    const card = game.tableau[col][cardIdx];
    if (!card.faceUp) return;

    if (selection === null) { setSelection({ source: 'tableau', col, cardIdx }); return; }

    if (selection.source === 'waste') {
      const next = moveWasteToTableau(game, col);
      if (next !== game) { update(next); setSelection(null); return; }
    } else if (selection.source === 'tableau') {
      if (selection.col === col && selection.cardIdx === cardIdx) { setSelection(null); return; }
      const next = moveTableauToTableau(game, selection.col, selection.cardIdx, col);
      if (next !== game) { update(next); setSelection(null); return; }
    }
    setSelection({ source: 'tableau', col, cardIdx });
  };

  const handleEmptyTableauClick = (col: number) => {
    if (selection?.source === 'waste') {
      const next = moveWasteToTableau(game, col);
      if (next !== game) { update(next); setSelection(null); }
    } else if (selection?.source === 'tableau') {
      const next = moveTableauToTableau(game, selection.col, selection.cardIdx, col);
      if (next !== game) { update(next); setSelection(null); }
    }
  };

  const handleAutoMove = () => { setSelection(null); update(autoMoveToFoundations(game)); };

  const resetGame = () => {
    setGame(initGame(chainData.seed));
    setSelection(null);
    setWon(false);
    dragRef.current = null;
    setGhost(null);
  };

  const isDraggedWaste = ghost?.source.type === 'waste';
  const isDraggedTableau = (col: number, cardIdx: number) =>
    ghost?.source.type === 'tableau' &&
    ghost.source.col === col &&
    ghost.source.cardIdx <= cardIdx;

  const difficultyStars = Math.round(chainData.difficulty * 5);
  const labelColor = getLabelColor(chainData.label);

  return (
    <div
      className="flex flex-col gap-3 w-full max-w-[400px] mx-auto px-2"
      style={{ touchAction: 'none' }}
    >
      {/* Ghost */}
      {ghost && (
        <div
          style={{
            position: 'fixed',
            left: ghost.x - CARD_W / 2,
            top: ghost.y - CARD_H / 2,
            width: CARD_W,
            height: CARD_H + (ghost.cards.length - 1) * TABLEAU_OVERLAP,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {ghost.cards.map((card, i) => (
            <div
              key={card.id}
              style={{ position: 'absolute', top: i * TABLEAU_OVERLAP, width: CARD_W, height: CARD_H, opacity: 0.9 }}
            >
              <CardView card={card} />
            </div>
          ))}
        </div>
      )}

      {/* Chain info bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <span className="font-black text-xs tracking-widest" style={{ color: labelColor }}>{chainData.label}</span>
          <span className="text-white/30 text-xs">{'★'.repeat(difficultyStars)}{'☆'.repeat(5 - difficultyStars)}</span>
        </div>
        <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono">
          <span>{chainData.gasPriceGwei}gwei</span>
          <span className={chainData.priceChange24h >= 0 ? 'text-[#4DB87A]' : 'text-[#E63946]'}>
            ETH {chainData.priceChange24h >= 0 ? '+' : ''}{chainData.priceChange24h}%
          </span>
        </div>
      </div>

      {/* Top row */}
      <div className="flex items-start gap-1.5">
        {/* Stock */}
        <div style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}>
          {game.stock.length > 0 ? (
            <CardView card={{ id: 'stock', suit: 'coral', rank: 1, faceUp: false }} onClick={handleStockClick} />
          ) : (
            <EmptyPile onClick={handleStockClick} label="↺" />
          )}
        </div>

        {/* Waste */}
        <div style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}>
          {game.waste.length > 0 ? (
            <div
              style={{ width: CARD_W, height: CARD_H, opacity: isDraggedWaste ? 0.25 : 1 }}
              onPointerDown={e => startDrag(
                e,
                { type: 'waste' },
                [game.waste[game.waste.length - 1]],
                handleWasteClick,
              )}
            >
              <CardView
                card={game.waste[game.waste.length - 1]}
                selected={selection?.source === 'waste'}
              />
            </div>
          ) : (
            <EmptyPile />
          )}
        </div>

        <div className="flex-1" />

        {/* Foundations */}
        {SUITS.map((suit, fi) => (
          <div
            key={suit}
            ref={el => { foundationRefs.current[fi] = el; }}
            style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}
          >
            {game.foundations[fi].length > 0 ? (
              <CardView
                card={game.foundations[fi][game.foundations[fi].length - 1]}
                onClick={() => handleFoundationClick(fi)}
              />
            ) : (
              <EmptyPile onClick={() => handleFoundationClick(fi)} label={SUIT_SYMBOL[suit]} />
            )}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="flex gap-1.5 items-start">
        {game.tableau.map((col, ci) => {
          const colHeight = col.length === 0 ? CARD_H : CARD_H + (col.length - 1) * TABLEAU_OVERLAP;
          return (
            <div
              key={ci}
              ref={el => { tableauRefs.current[ci] = el; }}
              style={{ width: CARD_W, height: colHeight, flexShrink: 0, position: 'relative' }}
            >
              {col.length === 0 ? (
                <EmptyPile onClick={() => handleEmptyTableauClick(ci)} />
              ) : (
                col.map((card, idx) => {
                  const isSelected =
                    selection?.source === 'tableau' &&
                    selection.col === ci &&
                    selection.cardIdx <= idx;
                  const isDimmed = isDraggedTableau(ci, idx);
                  return (
                    <div
                      key={card.id}
                      style={{
                        position: 'absolute',
                        top: idx * TABLEAU_OVERLAP,
                        width: CARD_W,
                        height: CARD_H,
                        zIndex: idx,
                        opacity: isDimmed ? 0.25 : 1,
                        touchAction: 'none',
                      }}
                      onPointerDown={card.faceUp ? e => startDrag(
                        e,
                        { type: 'tableau', col: ci, cardIdx: idx },
                        col.slice(idx),
                        () => handleTableauClick(ci, idx),
                      ) : undefined}
                    >
                      <CardView
                        card={card}
                        onClick={card.faceUp ? undefined : () => handleTableauClick(ci, idx)}
                        selected={isSelected}
                      />
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-white/30 text-xs font-mono">{game.moves} MOVES</span>
        <div className="flex gap-2">
          <button
            onClick={handleAutoMove}
            className="px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
          >
            AUTO
          </button>
          <button
            onClick={resetGame}
            className="px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Suit pairing reference */}
      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
        <div className="text-white/25 text-[9px] font-bold tracking-widest mb-2">PLACE ON OPPOSITE GROUP</div>
        <div className="flex items-center gap-2">
          {/* Warm group */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: '#E63946' }} />
              <div className="w-3 h-3 rounded-sm" style={{ background: '#F5C518' }} />
            </div>
            <span className="text-[9px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>WARM</span>
          </div>
          {/* Arrow */}
          <span className="text-white/20 text-xs font-bold">↔</span>
          {/* Cool group */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: '#9B5DE5' }} />
              <div className="w-3 h-3 rounded-sm" style={{ background: '#4DB87A' }} />
            </div>
            <span className="text-[9px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>COOL</span>
          </div>
          {/* Separator */}
          <div className="flex-1" />
          {/* Per-suit detail */}
          <div className="flex flex-col gap-1">
            {[
              { suit: 'coral', color: '#E63946', on: ['#9B5DE5', '#4DB87A'] },
              { suit: 'amber', color: '#F5C518', on: ['#9B5DE5', '#4DB87A'] },
              { suit: 'blue',  color: '#9B5DE5', on: ['#E63946', '#F5C518'] },
              { suit: 'green', color: '#4DB87A', on: ['#E63946', '#F5C518'] },
            ].map(row => (
              <div key={row.suit} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: row.color }} />
                <span className="text-white/20 text-[8px]">on</span>
                {row.on.map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-[3px]" style={{ background: c }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Win overlay */}
      {won && (
        <WinOverlay
          moves={game.moves}
          label={chainData.label}
          date={chainData.today}
          onReset={resetGame}
        />
      )}
    </div>
  );
}
