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
          background: '#111111',
          position: 'relative',
        }}
      >
        {/* Top-right headline */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: 120, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.9, display: 'flex', whiteSpace: 'nowrap' }}>
            CHAIN
          </div>
          <div style={{ fontSize: 120, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.9, display: 'flex', whiteSpace: 'nowrap' }}>
            DEAL
          </div>
        </div>

        {/* Bottom-left: colored cards */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          {[
            { color: CORAL, h: 160 },
            { color: AMBER, h: 200 },
            { color: BLUE,  h: 175 },
            { color: GREEN, h: 145 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                width: 90,
                height: c.h,
                borderRadius: 12,
                background: c.color,
                display: 'flex',
              }}
            />
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, display: 'flex', whiteSpace: 'nowrap' }}>
            DAILY SOLITAIRE ON BASE
          </div>
        </div>
      </div>
    ),
    { width: 900, height: 600 }
  );
}
