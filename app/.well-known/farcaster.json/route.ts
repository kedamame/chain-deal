import { NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://chain-deal.vercel.app';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header:    process.env.FARCASTER_HEADER    ?? '',
      payload:   process.env.FARCASTER_PAYLOAD   ?? '',
      signature: process.env.FARCASTER_SIGNATURE ?? '',
    },
    frame: {
      version:             '1',
      name:                'CHAIN DEAL',
      iconUrl:             `${APP_URL}/icon.png`,
      homeUrl:             APP_URL,
      imageUrl:            `${APP_URL}/og-image.png`,
      buttonTitle:         "DEAL TODAY'S HAND",
      splashImageUrl:      `${APP_URL}/splash.png`,
      splashBackgroundColor: '#111111',
    },
  };

  return NextResponse.json(manifest);
}
