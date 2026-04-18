'use client';

import { SolitaireGame } from './SolitaireGame';
import { SUIT_COLORS, SUITS } from '@/app/lib/deck';
import { ChainData, getLabelColor } from '@/app/lib/types';

export function GamePage({ chainData }: { chainData: ChainData }) {
  const accentColor = getLabelColor(chainData.label);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <div className="font-black text-white tracking-tighter leading-none" style={{ fontSize: 22, fontFamily: 'Barlow Condensed, sans-serif' }}>
            CHAIN DEAL
          </div>
          <div className="text-white/30 text-[10px] tracking-widest font-bold">ON BASE</div>
        </div>
        <div className="flex items-center gap-1.5">
          {SUITS.map(s => (
            <div key={s} className="w-2 h-2 rounded-full" style={{ background: SUIT_COLORS[s] }} />
          ))}
        </div>
      </header>

      {/* Thin divider */}
      <div className="h-px bg-white/10 mx-4" />

      {/* Scrolling ticker */}
      <div className="overflow-hidden py-1.5 border-b border-white/10">
        <div className="marquee-track flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="text-white/20 text-[10px] font-bold tracking-widest mr-8">
              {chainData.today}&nbsp;&nbsp;
              GAS {chainData.gasPriceGwei}GWEI&nbsp;&nbsp;
              ETH {chainData.priceChange24h >= 0 ? '+' : ''}{chainData.priceChange24h}%&nbsp;&nbsp;
              UTILIZATION {chainData.gasUtilization}%&nbsp;&nbsp;
              DECK&nbsp;
              <span style={{ color: accentColor }}>{chainData.label}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Deck label banner */}
      <div className="px-4 pt-3 pb-1 flex items-baseline gap-3">
        <span
          className="font-black leading-none tracking-tighter"
          style={{ fontSize: 36, color: accentColor, fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          {chainData.label}
        </span>
        <span className="text-white/30 text-xs font-bold tracking-widest">TODAY&apos;S DECK</span>
      </div>

      {/* Game */}
      <main className="flex-1 px-2 pb-6 fade-in">
        <SolitaireGame chainData={chainData} />
      </main>

      {/* Footer */}
      <footer className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-white/20 text-[10px] font-bold tracking-widest">POWERED BY BASE</span>
        <div className="flex gap-1">
          {SUITS.map((s, i) => (
            <div
              key={s}
              className="w-1.5 h-4 rounded-sm"
              style={{
                background: SUIT_COLORS[s],
                opacity: 0.3 + (chainData.difficulty * 0.7 * ((i + 1) / 4)),
              }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
