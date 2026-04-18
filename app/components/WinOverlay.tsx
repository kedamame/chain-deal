'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import sdk from '@farcaster/miniapp-sdk';
import { STREAK_CONTRACT_ADDRESS, STREAK_ABI } from '@/app/lib/contract';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://chain-deal.vercel.app';
const CONTRACT_ENABLED = STREAK_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
const TODAY_DAY = Math.floor(Date.now() / 86400000);

interface Props {
  moves: number;
  label: string;
  date: string;
  onReset: () => void;
}

export function WinOverlay({ moves, label, date, onReset }: Props) {
  const { address } = useAccount();
  const [shared, setShared] = useState(false);

  const { data: clearsData, refetch } = useReadContract({
    address: STREAK_CONTRACT_ADDRESS,
    abi: STREAK_ABI,
    functionName: 'getClears',
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACT_ENABLED },
  });

  const onChainClears = clearsData ? Number(clearsData[0]) : 0;
  const lastDay       = clearsData ? Number(clearsData[1]) : 0;
  const alreadyDone   = lastDay === TODAY_DAY;
  const pendingClears = alreadyDone ? onChainClears : onChainClears + 1;

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  const displayClears = (isConfirmed || alreadyDone) ? onChainClears : pendingClears;

  const handleRecord = () => {
    writeContract({
      address: STREAK_CONTRACT_ADDRESS,
      abi: STREAK_ABI,
      functionName: 'clearDay',
    });
  };

  const handleShare = async () => {
    const clears = displayClears;
    const text = `Cleared today's CHAIN DEAL deck in ${moves} moves! ${clears} total clears on Base.`;
    const shareUrl = `${APP_URL}/share?addr=${address}&clears=${clears}&label=${label}&moves=${moves}&date=${date}`;
    try {
      await sdk.actions.composeCast({ text, embeds: [shareUrl] });
      setShared(true);
    } catch {
      // sdk not available outside Farcaster
    }
  };

  const isRecording = isPending || isConfirming;
  const canRecord   = CONTRACT_ENABLED && !!address && !alreadyDone && !isConfirmed;
  const showShare   = !!address && (isConfirmed || alreadyDone);

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div className="text-center px-8 w-full max-w-sm">

        <div className="text-6xl font-black text-white tracking-tighter mb-1">YOU WIN</div>
        <div className="text-white/40 text-sm mb-1">{moves} MOVES</div>
        <div className="text-white/30 text-xs mb-8 tracking-widest">TODAY&apos;S DECK: {label}</div>

        {CONTRACT_ENABLED && address && (
          <div className="mb-8">
            {(isConfirmed || alreadyDone) ? (
              <div className="flex flex-col items-center gap-1">
                <div
                  className="text-7xl font-black tracking-tighter leading-none"
                  style={{ color: label === 'WILD' ? '#E63946' : label === 'ACTIVE' ? '#F5C518' : '#4DB87A' }}
                >
                  {displayClears}
                </div>
                <div className="text-white/40 text-xs font-bold tracking-widest">TOTAL CLEARS</div>
                {alreadyDone && !isConfirmed && (
                  <div className="text-white/25 text-[10px] tracking-widest mt-1">ALREADY RECORDED TODAY</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="text-white/30 text-xs tracking-widest">
                  {isRecording ? 'RECORDING...' : `TOTAL CLEARS: ${onChainClears}`}
                </div>
                {writeError && (
                  <div className="text-[#E63946] text-[10px] tracking-wide">TX FAILED</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 items-center">
          {canRecord && (
            <button
              onClick={handleRecord}
              disabled={isRecording}
              className="w-full py-3 rounded-full font-black text-sm tracking-wider transition-all"
              style={{
                background: label === 'WILD' ? '#E63946' : label === 'ACTIVE' ? '#F5C518' : '#4DB87A',
                color: '#111111',
                opacity: isRecording ? 0.6 : 1,
              }}
            >
              {isRecording ? 'RECORDING...' : 'RECORD CLEAR'}
            </button>
          )}

          {showShare && (
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-full font-black text-sm tracking-wider bg-white text-black transition-all hover:bg-white/90"
            >
              {shared ? 'SHARED!' : 'SHARE RESULT'}
            </button>
          )}

          <button
            onClick={onReset}
            className="px-6 py-2 rounded-full text-xs font-bold border border-white/15 text-white/40 hover:text-white hover:border-white/30 transition-all"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}
