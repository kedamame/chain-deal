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
        {/* Top-right headline block (qude.audio style) */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ fontSize: 160, fontWeight: 900, color: '#ffffff', letterSpacing: -8, lineHeight: 0.9, display: 'flex', whiteSpace: 'nowrap' }}>
            CHAIN
          </div>
          <div style={{ fontSize: 160, fontWeight: 900, color: '#ffffff', letterSpacing: -8, lineHeight: 0.9, display: 'flex', whiteSpace: 'nowrap' }}>
            DEAL
          </div>
        </div>

        {/* Bottom-left: 4 colored card shapes */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 60,
            display: 'flex',
            gap: 16,
            alignItems: 'flex-end',
          }}
        >
          {[
            { color: CORAL, h: 200 },
            { color: AMBER, h: 260 },
            { color: BLUE,  h: 220 },
            { color: GREEN, h: 180 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                width: 120,
                height: c.h,
                borderRadius: 16,
                background: c.color,
                display: 'flex',
              }}
            />
          ))}
        </div>

        {/* Bottom-right tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 8, display: 'flex', whiteSpace: 'nowrap' }}>
            DAILY SOLITAIRE
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 8, display: 'flex', whiteSpace: 'nowrap' }}>
            POWERED BY BASE
          </div>
        </div>

        {/* Center horizontal line */}
        <div
          style={{
            position: 'absolute',
            top: 315,
            left: 60,
            right: 60,
            height: 1,
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
