import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const CORAL  = '#F4654A';
const AMBER  = '#F5B340';
const BLUE   = '#7BCBD4';
const GREEN  = '#4DB87A';

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 40, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#ffffff', letterSpacing: -2, display: 'flex' }}>CHAIN DEAL</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 8, display: 'flex' }}>ON BASE</div>
          </div>
        </div>

        {/* WILD deck banner */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, paddingLeft: 40, paddingTop: 40, paddingBottom: 20 }}>
          <div style={{ fontSize: 96, fontWeight: 900, color: CORAL, letterSpacing: -4, display: 'flex' }}>WILD</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, display: 'flex' }}>TODAY&apos;S DECK</div>
        </div>

        {/* Chain info bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 40, marginRight: 40, padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: CORAL, letterSpacing: 4, display: 'flex' }}>WILD</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'rgba(255,255,255,0.2)', display: 'flex' }}>**</div>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.3)', display: 'flex' }}>4.2gwei</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: CORAL, display: 'flex' }}>ETH -8.3%</div>
          </div>
        </div>

        {/* Win screen mockup */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {/* Big YOU WIN */}
          <div style={{ fontSize: 160, fontWeight: 900, color: '#ffffff', letterSpacing: -8, lineHeight: 0.9, display: 'flex' }}>YOU WIN</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, display: 'flex' }}>47 MOVES</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 6, display: 'flex' }}>TODAY&apos;S DECK: WILD</div>

          {/* 4 colored blocks as confetti */}
          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            {[CORAL, AMBER, BLUE, GREEN].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 100,
                  height: 140,
                  borderRadius: 14,
                  background: c,
                  display: 'flex',
                  transform: i % 2 === 0 ? 'rotate(-8deg)' : 'rotate(8deg)',
                }}
              />
            ))}
          </div>

          {/* Play Again button */}
          <div
            style={{
              marginTop: 48,
              paddingLeft: 80,
              paddingRight: 80,
              paddingTop: 28,
              paddingBottom: 28,
              borderRadius: 60,
              background: '#ffffff',
              display: 'flex',
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 900, color: '#111111', letterSpacing: 2, display: 'flex' }}>PLAY AGAIN</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 40, paddingRight: 40, paddingTop: 24, paddingBottom: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 8, display: 'flex' }}>POWERED BY BASE</div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 }
  );
}
