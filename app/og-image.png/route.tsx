import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';

export const runtime = 'edge';

const BG    = '#111111';
const CORAL = '#F4654A';
const AMBER = '#F5B340';
const BLUE  = '#7BCBD4';
const GREEN = '#4DB87A';
const BACK  = 'repeating-linear-gradient(45deg,#1e1e1e 0,#1e1e1e 5px,#161616 5px,#161616 14px)';

const CW = 96;
const CH = 134;
const CR = 12;
const OVERLAP = 32;
const GAP_S = 12;
const GAP_G = 36;

const FX_WARM = 56;
const FX_COOL = FX_WARM + 2 * CW + GAP_S + GAP_G;
const FY = 90;
const TY = FY + CH + 24;

const FaceCard = ({ x, y, color, rank }: { x: number; y: number; color: string; rank: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: CR, background: color, display: 'flex', paddingLeft: 10, paddingTop: 8 }}>
    <div style={{ fontSize: 30, fontWeight: 900, color: '#111111', display: 'flex' }}>{rank}</div>
  </div>
);

const BackCard = ({ x, y }: { x: number; y: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: CR, background: BACK, border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }} />
);

const FoundSlot = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: CR, border: `2px dashed ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontSize: 26, fontWeight: 900, color: `${color}55`, display: 'flex' }}>A</div>
  </div>
);

export async function GET() {
  const TX_BASE = 56;
  const tableau = [
    { x: TX_BASE + 0 * (CW + 12), backs: 0, face: { color: CORAL, rank: 'K' } },
    { x: TX_BASE + 1 * (CW + 12), backs: 1, face: { color: BLUE,  rank: 'Q' } },
    { x: TX_BASE + 2 * (CW + 12), backs: 2, face: { color: AMBER, rank: 'J' } },
    { x: TX_BASE + 3 * (CW + 12), backs: 3, face: { color: GREEN, rank: '10' } },
    { x: TX_BASE + 4 * (CW + 12), backs: 4, face: { color: CORAL, rank: '9' } },
  ];

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: BG, position: 'relative' }}>

        {/* Left game mockup */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 680, height: 630, display: 'flex' }}>

          {/* Foundation warm pair */}
          <FoundSlot x={FX_WARM}             y={FY} color={CORAL} />
          <FoundSlot x={FX_WARM + CW + GAP_S} y={FY} color={AMBER} />
          {/* Foundation cool pair */}
          <FoundSlot x={FX_COOL}             y={FY} color={BLUE} />
          <FoundSlot x={FX_COOL + CW + GAP_S} y={FY} color={GREEN} />

          {/* Tableau */}
          {tableau.map((col) => {
            const els: ReactElement[] = [];
            for (let b = 0; b < col.backs; b++) {
              els.push(<BackCard key={`b${b}`} x={col.x} y={TY + b * OVERLAP} />);
            }
            els.push(<FaceCard key="face" x={col.x} y={TY + col.backs * OVERLAP} color={col.face.color} rank={col.face.rank} />);
            return els;
          })}
        </div>

        {/* Divider */}
        <div style={{ position: 'absolute', left: 680, top: 48, width: 1, height: 534, background: 'rgba(255,255,255,0.08)', display: 'flex' }} />

        {/* Right panel */}
        <div style={{ position: 'absolute', left: 704, top: 0, width: 496, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 56 }}>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 36 }}>
            <div style={{ fontSize: 112, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>CHAIN</div>
            <div style={{ fontSize: 112, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>DEAL</div>
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 5, display: 'flex', whiteSpace: 'nowrap', marginBottom: 44 }}>
            DAILY SOLITAIRE ON BASE
          </div>

          {/* Warm/Cool pairs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: CORAL, display: 'flex' }} />
              <div style={{ width: 14, height: 14, borderRadius: 7, background: AMBER, display: 'flex' }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, display: 'flex', whiteSpace: 'nowrap', marginLeft: 8 }}>WARM</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: BLUE, display: 'flex' }} />
              <div style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, display: 'flex' }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, display: 'flex', whiteSpace: 'nowrap', marginLeft: 8 }}>COOL</div>
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: GREEN, display: 'flex' }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: GREEN, letterSpacing: 3, display: 'flex' }}>CALM</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: AMBER, display: 'flex' }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: AMBER, letterSpacing: 3, display: 'flex' }}>ACTIVE</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: CORAL, display: 'flex' }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: CORAL, letterSpacing: 3, display: 'flex' }}>WILD</div>
            </div>
          </div>

          <div style={{ marginTop: 44, fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 6, display: 'flex', whiteSpace: 'nowrap' }}>
            POWERED BY BASE
          </div>
        </div>

      </div>
    ),
    { width: 1200, height: 630 }
  );
}
