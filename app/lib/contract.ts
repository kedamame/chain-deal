export const STREAK_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_STREAK_CONTRACT ?? '0x0000000000000000000000000000000000000000'
) as `0x${string}`;

export const STREAK_ABI = [
  {
    name: 'clearDay',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'getClears',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'uint256' },
    ],
  },
] as const;
