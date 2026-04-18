import { GamePage } from '@/app/components/GamePage';
import { fetchChainData, buildFallback } from '@/app/lib/getChainData';

export const revalidate = 3600;

export default async function Home() {
  const chainData = await fetchChainData().catch(() => buildFallback());
  return <GamePage chainData={chainData} />;
}
