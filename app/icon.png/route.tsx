import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BG    = '#111111';
const CORAL = '#F4654A';
const AMBER = '#F5B340';
const BLUE  = '#7BCBD4';
const GREEN = '#4DB87A';
const BACK  = 'repeating-linear-gradient(45deg,#1e1e1e 0,#1e1e1e 5px,#161616 5px,#161616 14px)';

// Dimensions
const FW = 140; const FH = 196; const FR = 18;
const TW = 200; const TH = 280; const TR = 24;
const PEEK = 64;
const GAP_F = 22; const GAP_T = 40;

// Vertical centering: FH + 44 + PEEK*2 + TH = 196+44+128+280 = 648 → top=(1024-648)/2=188
const FY = 188;
const TY = FY + FH + 44;

const FX = (1024 - (4 * FW + 3 * GAP_F)) / 2; // 199
const TX = (1024 - (3 * TW + 2 * GAP_T)) / 2; // 172

const solidCard = (x: number, y: number, w: number, h: number, r: number, bg: string) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: bg, display: 'flex' }} />
);

const peekCard = (x: number, y: number, w: number) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: PEEK, borderRadius: TR, background: BACK, display: 'flex' }} />
);

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: BG, position: 'relative' }}>

        {/* Foundation: 4 solid colored cards */}
        {solidCard(FX + 0 * (FW + GAP_F), FY, FW, FH, FR, CORAL)}
        {solidCard(FX + 1 * (FW + GAP_F), FY, FW, FH, FR, AMBER)}
        {solidCard(FX + 2 * (FW + GAP_F), FY, FW, FH, FR, BLUE)}
        {solidCard(FX + 3 * (FW + GAP_F), FY, FW, FH, FR, GREEN)}

        {/* Col 1: solid CORAL */}
        {solidCard(TX, TY, TW, TH, TR, CORAL)}

        {/* Col 2: 1 back peek + solid BLUE */}
        {peekCard(TX + TW + GAP_T, TY, TW)}
        {solidCard(TX + TW + GAP_T, TY + PEEK, TW, TH, TR, BLUE)}

        {/* Col 3: 2 back peeks + solid GREEN */}
        {peekCard(TX + (TW + GAP_T) * 2, TY, TW)}
        {peekCard(TX + (TW + GAP_T) * 2, TY + PEEK, TW)}
        {solidCard(TX + (TW + GAP_T) * 2, TY + PEEK * 2, TW, TH, TR, GREEN)}

      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
