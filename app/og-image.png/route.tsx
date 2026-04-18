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
  const GX = 56;
  const FY = 90;
  const TY = FY + CH + 24;

  const founds = [
    { x: GX + 0 * (CW + 14), color: CORAL },
    { x: GX + 1 * (CW + 14), color: AMBER },
    { x: GX + 2 * (CW + 14), color: BLUE  },
    { x: GX + 3 * (CW + 14), color: GREEN },
  ];

  const tableau = [
    { x: GX + 0 * (CW + 12), backs: 0, face: { color: CORAL, rank: 'K' } },
    { x: GX + 1 * (CW + 12), backs: 1, face: { color: BLUE,  rank: 'Q' } },
    { x: GX + 2 * (CW + 12), backs: 2, face: { color: AMBER, rank: 'J' } },
    { x: GX + 3 * (CW + 12), backs: 3, face: { color: GREEN, rank: '10' } },
    { x: GX + 4 * (CW + 12), backs: 4, face: { color: CORAL, rank: '9' } },
  ];

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: BG, position: 'relative' }}>

        {/* Left game mockup */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 680, height: 630, display: 'flex' }}>
          {founds.map((f, i) => (
            <FoundSlot key={i} x={f.x} y={FY} color={f.color} />
          ))}
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
        <div style={{ position: 'absolute', left: 704, top: 0, width: 496, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 56, gap: 0 }}>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 36 }}>
            <div style={{ fontSize: 112, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>CHAIN</div>
            <div style={{ fontSize: 112, fontWeight: 900, color: '#ffffff', letterSpacing: -6, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>DEAL</div>
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 5, display: 'flex', whiteSpace: 'nowrap', marginBottom: 44 }}>
            DAILY SOLITAIRE ON BASE
          </div>

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
