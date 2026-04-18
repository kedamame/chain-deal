'use client';

import { useState, useCallback } from 'react';
import {
  GameState, initGame, drawFromStock, moveWasteToFoundation,
  moveWasteToTableau, moveTableauToFoundation, moveTableauToTableau,
  autoMoveToFoundations,
} from '@/app/lib/solitaire';
import { SUITS, SUIT_COLORS, SUIT_SYMBOL } from '@/app/lib/deck';
import { ChainData, getLabelColor } from '@/app/lib/types';
import { CardView, EmptyPile } from './CardView';

interface Props {
  chainData: ChainData;
}

type Selection =
  | { source: 'waste' }
  | { source: 'tableau'; col: number; cardIdx: number }
  | null;

const CARD_W = 52;
const CARD_H = 72;
const TABLEAU_OVERLAP = 20;

export function SolitaireGame({ chainData }: Props) {
  const [game, setGame] = useState<GameState>(() => initGame(chainData.seed));
  const [selection, setSelection] = useState<Selection>(null);
  const [won, setWon] = useState(false);

  const update = useCallback((next: GameState) => {
    setGame(next);
    if (next.won) setWon(true);
  }, []);

  const resetGame = () => {
    setGame(initGame(chainData.seed));
    setSelection(null);
    setWon(false);
  };

  const handleStockClick = () => {
    setSelection(null);
    update(drawFromStock(game));
  };

  const handleWasteClick = () => {
    if (game.waste.length === 0) return;
    if (selection?.source === 'waste') {
      setSelection(null);
    } else {
      setSelection({ source: 'waste' });
    }
  };

  const handleFoundationClick = (fi: number) => {
    setSelection(null);
    if (selection?.source === 'waste') {
      update(moveWasteToFoundation(game));
    } else if (selection?.source === 'tableau') {
      update(moveTableauToFoundation(game, selection.col));
    }
  };

  const handleTableauClick = (col: number, cardIdx: number) => {
    const card = game.tableau[col][cardIdx];
    if (!card.faceUp) return;

    if (selection === null) {
      setSelection({ source: 'tableau', col, cardIdx });
      return;
    }

    if (selection.source === 'waste') {
      const next = moveWasteToTableau(game, col);
      if (next !== game) { update(next); setSelection(null); return; }
    } else if (selection.source === 'tableau') {
      if (selection.col === col && selection.cardIdx === cardIdx) {
        setSelection(null); return;
      }
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

  const handleAutoMove = () => {
    setSelection(null);
    update(autoMoveToFoundations(game));
  };

  const difficultyStars = Math.round(chainData.difficulty * 5);
  const labelColor = getLabelColor(chainData.label);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[400px] mx-auto px-2">

      {/* Chain info bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <span className="font-black text-xs tracking-widest" style={{ color: labelColor }}>{chainData.label}</span>
          <span className="text-white/30 text-xs">{'★'.repeat(difficultyStars)}{'☆'.repeat(5 - difficultyStars)}</span>
        </div>
        <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono">
          <span>{chainData.gasPriceGwei}gwei</span>
          <span className={chainData.priceChange24h >= 0 ? 'text-[#4DB87A]' : 'text-[#F4654A]'}>
            ETH {chainData.priceChange24h >= 0 ? '+' : ''}{chainData.priceChange24h}%
          </span>
        </div>
      </div>

      {/* Top row: stock + waste + spacer + foundations */}
      <div className="flex items-start gap-1.5">
        {/* Stock */}
        <div style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}>
          {game.stock.length > 0 ? (
            <CardView
              card={{ id: 'stock', suit: 'coral', rank: 1, faceUp: false }}
              onClick={handleStockClick}
            />
          ) : (
            <EmptyPile onClick={handleStockClick} label="↺" />
          )}
        </div>

        {/* Waste */}
        <div style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}>
          {game.waste.length > 0 ? (
            <CardView
              card={game.waste[game.waste.length - 1]}
              onClick={handleWasteClick}
              selected={selection?.source === 'waste'}
            />
          ) : (
            <EmptyPile />
          )}
        </div>

        <div className="flex-1" />

        {/* Foundations */}
        {SUITS.map((suit, fi) => (
          <div key={suit} style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}>
            {game.foundations[fi].length > 0 ? (
              <CardView
                card={game.foundations[fi][game.foundations[fi].length - 1]}
                onClick={() => handleFoundationClick(fi)}
              />
            ) : (
              <EmptyPile
                onClick={() => handleFoundationClick(fi)}
                label={SUIT_SYMBOL[suit]}
              />
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
                  return (
                    <div
                      key={card.id}
                      style={{
                        position: 'absolute',
                        top: idx * TABLEAU_OVERLAP,
                        width: CARD_W,
                        height: CARD_H,
                        zIndex: idx,
                      }}
                    >
                      <CardView
                        card={card}
                        onClick={() => handleTableauClick(ci, idx)}
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

      {/* Bottom controls */}
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

      {/* Win overlay */}
      {won && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center px-8">
            <div className="text-6xl font-black text-white tracking-tighter mb-2">YOU WIN</div>
            <div className="text-white/40 text-sm mb-1">{game.moves} MOVES</div>
            <div className="text-white/40 text-xs mb-8">TODAY&apos;S DECK: {chainData.label}</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 rounded-full font-black text-sm bg-white text-black hover:bg-white/90 transition-all"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
