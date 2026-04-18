import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const CORAL  = '#F4654A';
const AMBER  = '#F5B340';
const BLUE   = '#9B5DE5';
const GREEN  = '#4DB87A';
const SUITS  = [CORAL, AMBER, BLUE, GREEN];

function MockCard({ color, rank, x, y }: { color: string; rank: string; x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 120,
        height: 168,
        borderRadius: 16,
        background: color,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 900, color: '#111111', display: 'flex' }}>{rank}</div>
    </div>
  );
}

function CardBack({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 120,
        height: 168,
        borderRadius: 16,
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.15)', display: 'flex' }}>CD</div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#111111',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 40,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#ffffff', letterSpacing: -2, display: 'flex' }}>CHAIN DEAL</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 8, display: 'flex' }}>ON BASE</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {SUITS.map((c, i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c, display: 'flex' }} />
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 16,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 6, display: 'flex' }}>
            2026-04-18   GAS 0.01GWEI   ETH +3.11%   UTILIZATION 10%   DECK
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: GREEN, letterSpacing: 6, marginLeft: 12, display: 'flex' }}>CALM</div>
        </div>

        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, paddingLeft: 40, paddingTop: 32 }}>
          <div style={{ fontSize: 96, fontWeight: 900, color: GREEN, letterSpacing: -4, display: 'flex' }}>CALM</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, display: 'flex' }}>TODAY&apos;S DECK</div>
        </div>

        {/* Game area */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 40, paddingRight: 40, paddingTop: 32, gap: 24, position: 'relative', flex: 1 }}>

          {/* Top row: stock + waste + foundations */}
          <div style={{ display: 'flex', gap: 16 }}>
            <CardBack x={0} y={0} />
            <MockCard color={AMBER} rank="7" x={136} y={0} />
            <div style={{ flex: 1, display: 'flex' }} />
            {SUITS.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 120,
                  height: 168,
                  borderRadius: 16,
                  border: '2px dashed rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: i > 0 ? 16 : 0,
                }}
              >
                <div style={{ fontSize: 24, color: c, fontWeight: 900, display: 'flex' }}>A</div>
              </div>
            ))}
          </div>

          {/* Tableau */}
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              [{ c: '#1e1e1e', r: '' }],
              [{ c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }],
              [{ c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: CORAL, r: 'K' }],
              [{ c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: BLUE, r: 'Q' }],
              [{ c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: AMBER, r: 'J' }],
              [{ c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: GREEN, r: '10' }],
              [{ c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: '#1e1e1e', r: '' }, { c: CORAL, r: '9' }],
            ].map((col, ci) => (
              <div key={ci} style={{ width: 120, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.map((card, ri) => (
                  <div
                    key={ri}
                    style={{
                      width: 120,
                      height: ri === col.length - 1 ? 168 : 48,
                      borderRadius: 16,
                      background: card.c,
                      border: card.c === '#1e1e1e' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: 10,
                      flexShrink: 0,
                    }}
                  >
                    {card.r && <div style={{ fontSize: ri === col.length - 1 ? 32 : 20, fontWeight: 900, color: '#111111', display: 'flex' }}>{card.r}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Move counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingBottom: 40 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 4, display: 'flex' }}>12 MOVES</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10, borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>AUTO</div>
              </div>
              <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10, borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>RESET</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 24,
            paddingBottom: 24,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 8, display: 'flex' }}>POWERED BY BASE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {SUITS.map((c, i) => (
              <div key={i} style={{ width: 8, height: 32, borderRadius: 4, background: c, opacity: 0.5, display: 'flex' }} />
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 }
  );
}
