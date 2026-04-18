import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const CORAL  = '#F4654A';
const AMBER  = '#F5B340';
const BLUE   = '#B07FEE';
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
        <div style={{ position: 'absolute', top: 0, left: 0, width: 100, height: 100, background: CORAL, display: 'flex' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: AMBER, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 100, height: 100, background: GREEN, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 100, height: 100, background: BLUE, display: 'flex' }} />

        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: 64,
            background: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: '#ffffff', letterSpacing: -3, display: 'flex' }}>
            CD
          </div>
        </div>
      </div>
    ),
    { width: 200, height: 200 }
  );
}
