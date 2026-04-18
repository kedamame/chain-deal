import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BG = '#F5B340'; // amber background — matches qude.audio reference card style
const INK = '#111111';

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
          background: BG,
          position: 'relative',
        }}
      >
        {/* ── Solitaire tableau icon ── */}
        {/* Foundation row: 4 small card outlines at top */}
        <div
          style={{
            position: 'absolute',
            top: 168,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {['A', 'A', 'A', 'A'].map((_, i) => (
            <div
              key={i}
              style={{
                width: 96,
                height: 136,
                borderRadius: 14,
                border: `5px solid ${INK}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 44, fontWeight: 900, color: INK, display: 'flex' }}>A</div>
            </div>
          ))}
        </div>

        {/* Tableau columns: classic klondike staircase */}
        {/* Col 1: 1 face-up card */}
        {/* Col 2: 1 face-down + 1 face-up */}
        {/* Col 3: 2 face-down + 1 face-up */}
        <div
          style={{
            position: 'absolute',
            top: 368,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            alignItems: 'flex-start',
          }}
        >
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 150 }}>
            <div style={{ width: 150, height: 210, borderRadius: 20, background: INK, display: 'flex', alignItems: 'flex-start', paddingTop: 16, paddingLeft: 18 }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: BG, lineHeight: 1, display: 'flex' }}>K</div>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', width: 150 }}>
            {/* face-down */}
            <div style={{ width: 150, height: 52, borderRadius: 20, background: INK, display: 'flex', marginBottom: -32 }} />
            {/* face-up */}
            <div style={{ width: 150, height: 210, borderRadius: 20, background: INK, display: 'flex', alignItems: 'flex-start', paddingTop: 16, paddingLeft: 18 }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: BG, lineHeight: 1, display: 'flex' }}>Q</div>
            </div>
          </div>

          {/* Column 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', width: 150 }}>
            {/* face-down 1 */}
            <div style={{ width: 150, height: 52, borderRadius: 20, background: INK, display: 'flex', marginBottom: -32 }} />
            {/* face-down 2 */}
            <div style={{ width: 150, height: 52, borderRadius: 20, background: INK, display: 'flex', marginBottom: -32, opacity: 0.7 }} />
            {/* face-up */}
            <div style={{ width: 150, height: 210, borderRadius: 20, background: INK, display: 'flex', alignItems: 'flex-start', paddingTop: 16, paddingLeft: 18 }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: BG, lineHeight: 1, display: 'flex' }}>J</div>
            </div>
          </div>
        </div>

        {/* Bottom wordmark */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 900, color: INK, letterSpacing: 10, display: 'flex' }}>
            CHAIN DEAL
          </div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
