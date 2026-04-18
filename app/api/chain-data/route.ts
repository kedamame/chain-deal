import { NextResponse } from 'next/server';
import { fetchChainData, buildFallback } from '@/app/lib/getChainData';

export const runtime = 'nodejs';
export const maxDuration = 15;

export async function GET() {
  try {
    const data = await fetchChainData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(buildFallback());
  }
}
