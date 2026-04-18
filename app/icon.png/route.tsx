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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111111',
        }}
      >
        {/* 2x2 colored quadrant background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 512, height: 512, background: CORAL, display: 'flex' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 512, height: 512, background: AMBER, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 512, height: 512, background: GREEN, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 512, height: 512, background: BLUE, display: 'flex' }} />

        {/* Center black circle with CD text */}
        <div
          style={{
            width: 640,
            height: 640,
            borderRadius: 320,
            background: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 240,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: -12,
              lineHeight: 1,
              display: 'flex',
            }}
          >
            CD
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: 16,
              marginTop: 8,
              display: 'flex',
            }}
          >
            BASE
          </div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
