import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const CORAL = '#F4654A';
const AMBER = '#F5B340';
const BLUE  = '#B07FEE';
const GREEN = '#4DB87A';

function labelColor(label: string) {
  if (label === 'WILD')   return CORAL;
  if (label === 'ACTIVE') return AMBER;
  return GREEN;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clears = Math.max(1, parseInt(searchParams.get('clears') ?? '1', 10));
  const label  = searchParams.get('label') ?? 'CALM';
  const moves  = searchParams.get('moves') ?? '?';
  const date   = searchParams.get('date') ?? '';
  const addr   = searchParams.get('addr') ?? '';
  const short  = addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
  const accent = labelColor(label);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#111111',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: 'flex', height: 6 }}>
          {[CORAL, AMBER, BLUE, GREEN].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c, display: 'flex' }} />
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, paddingLeft: 56, paddingRight: 56, paddingTop: 56, paddingBottom: 0 }}>

          {/* Left: YOU WIN + moves + date */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 8, display: 'flex', whiteSpace: 'nowrap', marginBottom: 16 }}>
              CHAIN DEAL
            </div>
            <div style={{ fontSize: 100, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>
              YOU
            </div>
            <div style={{ fontSize: 100, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>
              WIN
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 28, alignItems: 'baseline' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: accent, letterSpacing: 2, display: 'flex', whiteSpace: 'nowrap' }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, display: 'flex', whiteSpace: 'nowrap' }}>{moves} MOVES</div>
            </div>
            {date && (
              <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 6, display: 'flex', marginTop: 12, whiteSpace: 'nowrap' }}>
                {date}
              </div>
            )}
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', marginLeft: 48, marginRight: 48, display: 'flex', alignSelf: 'stretch' }} />

          {/* Right: Clear count */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', width: 280, gap: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 6, display: 'flex', whiteSpace: 'nowrap', marginBottom: 12 }}>
              TOTAL CLEARS
            </div>
            <div style={{ fontSize: 160, fontWeight: 900, color: accent, letterSpacing: -8, lineHeight: 0.85, display: 'flex' }}>
              {clears}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
              {[CORAL, AMBER, BLUE, GREEN].map((c, i) => (
                <div key={i} style={{ width: 8, height: 32, borderRadius: 4, background: c, opacity: 0.4, display: 'flex' }} />
              ))}
            </div>
            {short && (
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 2, display: 'flex', marginTop: 12, whiteSpace: 'nowrap' }}>
                {short}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 56, paddingRight: 56, paddingBottom: 32, paddingTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.12)', letterSpacing: 6, display: 'flex', whiteSpace: 'nowrap' }}>
            POWERED BY BASE
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.12)', letterSpacing: 4, display: 'flex', whiteSpace: 'nowrap' }}>
            chain-deal.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
