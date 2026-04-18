import { ChainData } from './types';

const BLOCKSCOUT = 'https://base.blockscout.com/api';
const BASE_RPC = 'https://mainnet.base.org';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

async function fetchLatestBlock() {
  const res = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBlockByNumber', params: ['latest', false], id: 1 }),
    cache: 'no-store',
  }).then(r => r.json());
  return res?.result ?? null;
}

async function fetchGasPrice() {
  const res = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 }),
    cache: 'no-store',
  }).then(r => r.json());
  return res?.result ?? null;
}

async function fetchTxCount() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  const res = await fetch(
    `${BLOCKSCOUT}?module=stats&action=dailytxns&startdate=${dateStr}&enddate=${dateStr}`,
    { cache: 'no-store' }
  ).then(r => r.text()).then(text => {
    try { return JSON.parse(text); } catch { return null; }
  });
  if (res?.status === '1' && Array.isArray(res.result) && res.result.length > 0) {
    return parseInt(res.result[0].txnCount, 10);
  }
  return null;
}

async function fetchEthPrice() {
  const res = await withTimeout(
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true', {
      cache: 'no-store',
    }).then(r => r.json()),
    5000
  );
  if (res?.ethereum) {
    return { price: res.ethereum.usd as number, change24h: res.ethereum.usd_24h_change as number };
  }
  return null;
}

export function buildFallback(): ChainData {
  const today = new Date().toISOString().split('T')[0];
  const seed = (parseInt(today.replace(/-/g, '').slice(-8), 10)) >>> 0;
  return { today, blockHash: '0x0', blockNumber: 0, gasPriceGwei: 0.5, gasUtilization: 50, txCount: 0, ethPrice: null, priceChange24h: 0, difficulty: 0.2, seed, label: 'CALM' };
}

export async function fetchChainData(): Promise<ChainData> {
  const today = new Date().toISOString().split('T')[0];

  const [block, gasHex, txCount, ethData] = await Promise.all([
    withTimeout(fetchLatestBlock(), 5000),
    withTimeout(fetchGasPrice(), 5000),
    withTimeout(fetchTxCount(), 8000),
    fetchEthPrice(),
  ]);

  const blockHash = block?.hash ?? `0x${today.replace(/-/g, '')}deadbeef`;
  const blockNumber = block ? parseInt(block.number, 16) : 0;

  // Correctly parse txCount from block: transactions is an array of hashes (false was passed to eth_getBlockByNumber)
  const txInBlock = Array.isArray(block?.transactions)
    ? block.transactions.length
    : block?.transactionCount != null
    ? parseInt(block.transactionCount, 10)
    : 0;

  const gasUsed = block ? parseInt(block.gasUsed, 16) : 0;
  const gasLimit = block ? parseInt(block.gasLimit, 16) : 1;
  const gasUtilization = gasLimit > 0 ? Math.round((gasUsed / gasLimit) * 100) : 50;
  const gasPriceGwei = gasHex ? Math.round((parseInt(gasHex, 16) / 1e9) * 100) / 100 : 1;
  const priceChange = ethData?.change24h ?? 0;
  const absChange = Math.abs(priceChange);

  const gasFactor = Math.min(gasPriceGwei / 5, 1);
  const changeFactor = Math.min(absChange / 10, 1);
  const utilFactor = gasUtilization / 100;
  const difficulty = Math.round((gasFactor * 0.4 + changeFactor * 0.4 + utilFactor * 0.2) * 100) / 100;

  // Seed: daily-consistent, same for all users — intended design (not a security primitive)
  const seedHex = blockHash.replace('0x', '').slice(0, 8);
  const seed = (parseInt(seedHex, 16) >>> 0) || ((Date.now() / 86400000 | 0) >>> 0);

  const label: ChainData['label'] = difficulty < 0.33 ? 'CALM' : difficulty < 0.66 ? 'ACTIVE' : 'WILD';

  return {
    today, blockHash, blockNumber,
    gasPriceGwei, gasUtilization,
    txCount: txCount ?? txInBlock,
    ethPrice: ethData?.price ?? null,
    priceChange24h: Math.round(priceChange * 100) / 100,
    difficulty, seed, label,
  };
}
