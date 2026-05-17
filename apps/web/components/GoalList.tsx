'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther } from "viem";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { useState } from "react";

type Goal = {
    name: string;
    targetAmount: bigint;
    currentAmount: bigint;
    dreamPower: bigint;
    isFulfilled: boolean;
    createdAt: bigint;
};

export function GoalList({ owner }: { owner: `0x${string}`}) {
    const [donatingIndex, setDonatingIndex] = useState<number | null>(null);
    const [donateAmount, setDonateAmount] = useState('0.001');


    const { data: goals, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getGoals',
        args: [owner],
    });

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
        onReplaced: () => refetch()
    });

    function handleDonate(index: number) {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'donate',
            args: [owner, BigInt(index)],
            value: parseEther(donateAmount),
        });
        setDonatingIndex(null);
    }

    if (!goals || goals.length === 0) {
        return <p className="text-gray-400">No goals yet. Create your first one!</p>;
    }

    return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <h2 className="text-xl font-bold">🎯 My Goals</h2>
      {(goals as Goal[]).map((goal, index) => {
        const progress = goal.targetAmount > 0n
          ? Number((goal.currentAmount * 100n) / goal.targetAmount)
          : 0;

        return (
          <div key={index} className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{goal.name}</h3>
              {goal.isFulfilled && <span className="text-green-400 text-sm">✅ Fulfilled</span>}
            </div>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatEther(goal.currentAmount)} ETH raised</span>
              <span>Goal: {formatEther(goal.targetAmount)} ETH</span>
            </div>

            {!goal.isFulfilled && (
              donatingIndex === index ? (
                <div className="flex gap-2">
                  <input
                    className="bg-white/10 rounded-lg px-3 py-1 outline-none flex-1 text-sm"
                    value={donateAmount}
                    onChange={e => setDonateAmount(e.target.value)}
                    placeholder="ETH amount"
                  />
                  <button
                    onClick={() => handleDonate(index)}
                    disabled={isPending || isConfirming}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg px-3 py-1 text-sm font-bold transition"
                  >
                    {isPending || isConfirming ? '...' : 'Send'}
                  </button>
                  <button
                    onClick={() => setDonatingIndex(null)}
                    className="text-gray-400 text-sm px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDonatingIndex(index)}
                  className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm transition"
                >
                  💜 Donate
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}