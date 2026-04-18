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

        {/* ACTIVE deck */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, paddingLeft: 40, paddingTop: 40 }}>
          <div style={{ fontSize: 96, fontWeight: 900, color: AMBER, letterSpacing: -4, display: 'flex' }}>ACTIVE</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 6, display: 'flex' }}>TODAY&apos;S DECK</div>
        </div>

        {/* Concept explanation section */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 40, paddingRight: 40, paddingTop: 48, gap: 48 }}>

          {/* Feature 1 */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: CORAL, flexShrink: 0, display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: -1, display: 'flex' }}>DAILY DECK</div>
              <div style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>New cards every day powered by Base chain data</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', display: 'flex' }} />

          {/* Feature 2 */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: AMBER, flexShrink: 0, display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: -1, display: 'flex' }}>3 DIFFICULTY LEVELS</div>
              <div style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>CALM / ACTIVE / WILD based on gas and ETH volatility</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', display: 'flex' }} />

          {/* Feature 3 */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: BLUE, flexShrink: 0, display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: -1, display: 'flex' }}>4 SUIT COLORS</div>
              <div style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>Coral, Amber, Blue, Green - all unique to CHAIN DEAL</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', display: 'flex' }} />

          {/* Feature 4 */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: GREEN, flexShrink: 0, display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: -1, display: 'flex' }}>FARCASTER NATIVE</div>
              <div style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>Play directly in your Farcaster feed on Base</div>
            </div>
          </div>
        </div>

        {/* Big bottom CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'auto',
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 80,
            paddingTop: 48,
            paddingBottom: 48,
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.15)',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: '#ffffff', letterSpacing: -2, display: 'flex' }}>DEAL TODAY&apos;S HAND</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, display: 'flex' }}>chain-deal.vercel.app</div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 40, paddingRight: 40, paddingTop: 24, paddingBottom: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 8, display: 'flex' }}>POWERED BY BASE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[CORAL, AMBER, BLUE, GREEN].map((c, i) => (
              <div key={i} style={{ width: 8, height: 32, borderRadius: 4, background: c, opacity: 0.5, display: 'flex' }} />
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 }
  );
}
