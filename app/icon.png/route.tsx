import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const CORAL = '#F4654A';
const AMBER = '#F5B340';
const BLUE  = '#7BCBD4';
const GREEN = '#4DB87A';

// Card: 220x310, fanned from bottom-center
// 4 cards offset horizontally with slight vertical stagger
const CARDS = [
  { color: CORAL, rank: 'A', x: 60,  y: 420 },
  { color: AMBER, rank: 'K', x: 250, y: 350 },
  { color: BLUE,  rank: 'Q', x: 440, y: 350 },
  { color: GREEN, rank: 'J', x: 630, y: 420 },
];

const W = 220;
const H = 310;
const R = 28;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#111111',
          position: 'relative',
        }}
      >
        {/* Face-down card stack top-left — signals "stock pile" */}
        <div style={{ position: 'absolute', top: 56, left: 56, width: 110, height: 154, borderRadius: 14, background: '#222222', border: '2px solid rgba(255,255,255,0.12)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 62, left: 62, width: 110, height: 154, borderRadius: 14, background: '#1a1a1a', border: '2px solid rgba(255,255,255,0.08)', display: 'flex' }} />
        <div
          style={{
            position: 'absolute', top: 68, left: 68,
            width: 110, height: 154, borderRadius: 14,
            background: '#161616', border: '2px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.15)', display: 'flex' }}>CD</div>
        </div>

        {/* 4 fanned face-up cards */}
        {CARDS.map((c) => (
          <div
            key={c.rank}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y,
              width: W,
              height: H,
              borderRadius: R,
              background: c.color,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 18,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 18,
            }}
          >
            {/* Rank top-left */}
            <div style={{ fontSize: 72, fontWeight: 900, color: '#111111', lineHeight: 1, display: 'flex' }}>
              {c.rank}
            </div>
            {/* Center rank large */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 120, fontWeight: 900, color: 'rgba(0,0,0,0.15)', display: 'flex' }}>
                {c.rank}
              </div>
            </div>
          </div>
        ))}

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 900, color: 'rgba(255,255,255,0.25)', letterSpacing: 12, display: 'flex' }}>
            SOLITAIRE
          </div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
