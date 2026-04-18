import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';

export const runtime = 'edge';

const BG    = '#111111';
const CORAL = '#F4654A';
const AMBER = '#F5B340';
const BLUE  = '#7BCBD4';
const GREEN = '#4DB87A';
const BACK  = 'repeating-linear-gradient(45deg,#1e1e1e 0,#1e1e1e 5px,#161616 5px,#161616 14px)';

const CW = 80;
const CH = 112;
const CR = 10;
const OVERLAP = 28;

// A single face-up card
const FaceCard = ({ x, y, color, rank }: { x: number; y: number; color: string; rank: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: CR, background: color, display: 'flex', paddingLeft: 8, paddingTop: 6 }}>
    <div style={{ fontSize: 26, fontWeight: 900, color: '#111111', display: 'flex' }}>{rank}</div>
  </div>
);

// A face-down card
const BackCard = ({ x, y }: { x: number; y: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: CR, background: BACK, border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }} />
);

// Foundation slot outline
const FoundSlot = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: CR, border: `2px dashed ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontSize: 22, fontWeight: 900, color: `${color}55`, display: 'flex' }}>A</div>
  </div>
);

export async function GET() {
  // Game area: left 520px, right panel: 380px
  // Game area origin at x=40, y=0
  const GX = 40;
  const GY = 80; // top of game area

  // Foundation row y
  const FY = GY;
  // Tableau row y
  const TY = FY + CH + 20;

  // 4 foundation slots
  const founds = [
    { x: GX + 0 * (CW + 12), color: CORAL },
    { x: GX + 1 * (CW + 12), color: AMBER },
    { x: GX + 2 * (CW + 12), color: BLUE  },
    { x: GX + 3 * (CW + 12), color: GREEN },
  ];

  // 5 tableau columns: each has N face-down + 1 face-up
  const tableau = [
    { x: GX + 0 * (CW + 10), backs: 0, face: { color: CORAL, rank: 'K' } },
    { x: GX + 1 * (CW + 10), backs: 1, face: { color: BLUE,  rank: 'Q' } },
    { x: GX + 2 * (CW + 10), backs: 2, face: { color: AMBER, rank: 'J' } },
    { x: GX + 3 * (CW + 10), backs: 3, face: { color: GREEN, rank: '10' } },
    { x: GX + 4 * (CW + 10), backs: 4, face: { color: CORAL, rank: '9' } },
  ];

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: BG, position: 'relative' }}>

        {/* Left: game mockup */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 520, height: 600, display: 'flex' }}>

          {/* Foundation slots */}
          {founds.map((f, i) => (
            <FoundSlot key={i} x={f.x} y={FY} color={f.color} />
          ))}

          {/* Tableau columns */}
          {tableau.map((col, ci) => {
            const els: ReactElement[] = [];
            for (let b = 0; b < col.backs; b++) {
              els.push(<BackCard key={`b${b}`} x={col.x} y={TY + b * OVERLAP} />);
            }
            els.push(
              <FaceCard
                key="face"
                x={col.x}
                y={TY + col.backs * OVERLAP}
                color={col.face.color}
                rank={col.face.rank}
              />
            );
            return els;
          })}
        </div>

        {/* Vertical divider */}
        <div style={{ position: 'absolute', left: 520, top: 40, width: 1, height: 520, background: 'rgba(255,255,255,0.08)', display: 'flex' }} />

        {/* Right panel */}
        <div style={{ position: 'absolute', left: 540, top: 0, width: 360, height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 20, paddingRight: 40, gap: 0 }}>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
            <div style={{ fontSize: 88, fontWeight: 900, color: '#ffffff', letterSpacing: -4, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>CHAIN</div>
            <div style={{ fontSize: 88, fontWeight: 900, color: '#ffffff', letterSpacing: -4, lineHeight: 0.88, display: 'flex', whiteSpace: 'nowrap' }}>DEAL</div>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 5, display: 'flex', whiteSpace: 'nowrap', marginBottom: 40 }}>
            DAILY SOLITAIRE ON BASE
          </div>

          {/* Difficulty badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: GREEN, display: 'flex' }} />
              <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, letterSpacing: 3, display: 'flex' }}>CALM</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: AMBER, display: 'flex' }} />
              <div style={{ fontSize: 22, fontWeight: 900, color: AMBER, letterSpacing: 3, display: 'flex' }}>ACTIVE</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: CORAL, display: 'flex' }} />
              <div style={{ fontSize: 22, fontWeight: 900, color: CORAL, letterSpacing: 3, display: 'flex' }}>WILD</div>
            </div>
          </div>

          {/* Base tag */}
          <div style={{ marginTop: 40, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: 6, display: 'flex', whiteSpace: 'nowrap' }}>
            POWERED BY BASE
          </div>
        </div>

      </div>
    ),
    { width: 900, height: 600 }
  );
}
