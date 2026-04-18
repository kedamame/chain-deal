import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://chain-deal.vercel.app';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ addr?: string; clears?: string; label?: string; moves?: string; date?: string }>;
}): Promise<Metadata> {
  const p = await searchParams;
  const qs = new URLSearchParams({
    addr:   p.addr   ?? '',
    clears: p.clears ?? '1',
    label:  p.label  ?? 'CALM',
    moves:  p.moves  ?? '?',
    date:   p.date   ?? '',
  }).toString();

  const clears = p.clears ?? '1';
  const label  = p.label  ?? 'CALM';

  return {
    title: `${clears} clears on CHAIN DEAL`,
    description: `Cleared today's ${label} deck. Play daily solitaire on Base.`,
    openGraph: {
      images: [`${APP_URL}/share/og?${qs}`],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': `${APP_URL}/share/og?${qs}`,
      'fc:frame:button:1': 'Play Today',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': APP_URL,
    },
  };
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  await searchParams;
  redirect(APP_URL);
}
