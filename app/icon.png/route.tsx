import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const BG    = '#111111';
const CORAL = '#F4654A';
const AMBER = '#F5B340';
const BLUE  = '#9B5DE5';
const GREEN = '#4DB87A';
const BACK  = 'repeating-linear-gradient(45deg,#1e1e1e 0,#1e1e1e 5px,#161616 5px,#161616 14px)';

// Card dimensions
const FW = 136; const FH = 190; const FR = 18;
const TW = 196; const TH = 272; const TR = 24;
const PEEK = 62;
const GAP_S = 20;   // gap within same group
const GAP_G = 56;   // gap between warm/cool groups
const GAP_T = 38;

// Foundation row: [CORAL,AMBER] | GAP_G | [BLUE,GREEN]
// Warm pair width: 2*FW+GAP_S = 292, cool same
// Total: 292+GAP_G+292 = 640
const FX_WARM = (1024 - (2 * FW + GAP_S + GAP_G + 2 * FW + GAP_S)) / 2;
const FX_COOL = FX_WARM + 2 * FW + GAP_S + GAP_G;
const FY = 192;
const TY = FY + FH + 42;

// Tableau: 3 cols centered  col1=CORAL(warm) col2=peek+BLUE(cool) col3=peek+peek+AMBER(warm)
const TX = (1024 - (3 * TW + 2 * GAP_T)) / 2;

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

        {/* Foundation warm pair: CORAL + AMBER */}
        {solidCard(FX_WARM,          FY, FW, FH, FR, CORAL)}
        {solidCard(FX_WARM + FW + GAP_S, FY, FW, FH, FR, AMBER)}

        {/* Foundation cool pair: BLUE + GREEN */}
        {solidCard(FX_COOL,          FY, FW, FH, FR, BLUE)}
        {solidCard(FX_COOL + FW + GAP_S, FY, FW, FH, FR, GREEN)}

        {/* Tableau col 1: solid CORAL (warm) */}
        {solidCard(TX, TY, TW, TH, TR, CORAL)}

        {/* Tableau col 2: peek + BLUE (cool on warm) */}
        {peekCard(TX + TW + GAP_T, TY, TW)}
        {solidCard(TX + TW + GAP_T, TY + PEEK, TW, TH, TR, BLUE)}

        {/* Tableau col 3: 2 peeks + AMBER (warm on cool) */}
        {peekCard(TX + (TW + GAP_T) * 2, TY, TW)}
        {peekCard(TX + (TW + GAP_T) * 2, TY + PEEK, TW)}
        {solidCard(TX + (TW + GAP_T) * 2, TY + PEEK * 2, TW, TH, TR, AMBER)}

      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
