export interface ChainData {
  today: string;
  blockHash: string;
  blockNumber: number;
  gasPriceGwei: number;
  gasUtilization: number;
  txCount: number;
  ethPrice: number | null;
  priceChange24h: number;
  difficulty: number;
  seed: number;
  label: 'CALM' | 'ACTIVE' | 'WILD';
}

export function getLabelColor(label: string): string {
  if (label === 'WILD') return '#F4654A';
  if (label === 'ACTIVE') return '#F5B340';
  return '#4DB87A';
}
