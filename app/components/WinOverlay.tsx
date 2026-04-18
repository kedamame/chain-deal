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

  // Read current streak + lastClearDay
  const { data: streakData, refetch } = useReadContract({
    address: STREAK_CONTRACT_ADDRESS,
    abi: STREAK_ABI,
    functionName: 'getStreak',
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACT_ENABLED },
  });

  const onChainStreak = streakData ? Number(streakData[0]) : 0;
  const lastDay       = streakData ? Number(streakData[1]) : 0;
  const alreadyDone   = lastDay === TODAY_DAY;
  const pendingStreak = alreadyDone ? onChainStreak : onChainStreak + 1;

  // Write contract
  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // Refetch streak after confirmation
  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  const displayStreak = (isConfirmed || alreadyDone) ? onChainStreak : pendingStreak;

  const handleRecord = () => {
    writeContract({
      address: STREAK_CONTRACT_ADDRESS,
      abi: STREAK_ABI,
      functionName: 'clearDay',
    });
  };

  const handleShare = async () => {
    const streak = displayStreak;
    const text = `Cleared today's CHAIN DEAL deck in ${moves} moves! ${streak} day streak on Base.`;
    const shareUrl = `${APP_URL}/share?addr=${address}&streak=${streak}&label=${label}&moves=${moves}&date=${date}`;
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

        {/* YOU WIN */}
        <div className="text-6xl font-black text-white tracking-tighter mb-1">YOU WIN</div>
        <div className="text-white/40 text-sm mb-1">{moves} MOVES</div>
        <div className="text-white/30 text-xs mb-8 tracking-widest">TODAY&apos;S DECK: {label}</div>

        {/* Streak area */}
        {CONTRACT_ENABLED && address && (
          <div className="mb-8">
            {(isConfirmed || alreadyDone) ? (
              <div className="flex flex-col items-center gap-1">
                <div
                  className="text-7xl font-black tracking-tighter leading-none"
                  style={{ color: label === 'WILD' ? '#F4654A' : label === 'ACTIVE' ? '#F5B340' : '#4DB87A' }}
                >
                  {displayStreak}
                </div>
                <div className="text-white/40 text-xs font-bold tracking-widest">DAY STREAK</div>
                {alreadyDone && !isConfirmed && (
                  <div className="text-white/25 text-[10px] tracking-widest mt-1">ALREADY RECORDED TODAY</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="text-white/30 text-xs tracking-widest">
                  {isRecording ? 'RECORDING...' : `CURRENT STREAK: ${onChainStreak}`}
                </div>
                {writeError && (
                  <div className="text-[#F4654A] text-[10px] tracking-wide">TX FAILED</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 items-center">
          {canRecord && (
            <button
              onClick={handleRecord}
              disabled={isRecording}
              className="w-full py-3 rounded-full font-black text-sm tracking-wider transition-all"
              style={{
                background: label === 'WILD' ? '#F4654A' : label === 'ACTIVE' ? '#F5B340' : '#4DB87A',
                color: '#111111',
                opacity: isRecording ? 0.6 : 1,
              }}
            >
              {isRecording ? 'RECORDING...' : 'RECORD STREAK'}
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
