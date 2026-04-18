import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BG  = '#F5B340';
const INK = '#111111';

// Card dimensions (enlarged)
const FW = 140; // foundation card width
const FH = 196; // foundation card height
const FR = 18;  // foundation border-radius
const FB = 7;   // border width

const TW = 200; // tableau card width
const TH = 280; // tableau card height
const TR = 24;
const PEEK = 62; // face-down peek height

// Vertical composition: foundation(196) + gap(44) + tableau(62+62+280=404) = 644
// Center: (1024-644)/2 = 190
const FY = 190;
const TY = FY + FH + 44;

// Horizontal: foundation 4×140+3×22 = 626 → xF=(1024-626)/2=199
//             tableau   3×200+2×40 = 680 → xT=(1024-680)/2=172
const FX = (1024 - (4 * FW + 3 * 22)) / 2;
const TX = (1024 - (3 * TW + 2 * 40)) / 2;

const card = (x: number, y: number, w: number, h: number, r: number, filled: boolean) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      background: filled ? INK : BG,
      border: `${FB}px solid ${INK}`,
      display: 'flex',
    }}
  />
);

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: BG,
          position: 'relative',
        }}
      >
        {/* Foundation row: 4 outlined cards (same color as BG) */}
        {[0, 1, 2, 3].map(i => card(FX + i * (FW + 22), FY, FW, FH, FR, false))}

        {/* Tableau col 1: 1 outlined card */}
        {card(TX, TY, TW, TH, TR, false)}

        {/* Tableau col 2: 1 filled peek + 1 outlined */}
        {card(TX + TW + 40, TY,        TW, PEEK, TR, true)}
        {card(TX + TW + 40, TY + PEEK, TW, TH,   TR, false)}

        {/* Tableau col 3: 2 filled peeks + 1 outlined */}
        {card(TX + (TW + 40) * 2, TY,             TW, PEEK, TR, true)}
        {card(TX + (TW + 40) * 2, TY + PEEK,      TW, PEEK, TR, true)}
        {card(TX + (TW + 40) * 2, TY + PEEK * 2,  TW, TH,   TR, false)}
      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
