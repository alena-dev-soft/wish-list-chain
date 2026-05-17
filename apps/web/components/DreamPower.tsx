'use client';

import { useReadContract  } from "wagmi";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = '0x90de4a1934d0B062423adAEeDEe37Bb6fD12D0Ca'; 

const ABI = [
    {
    name: 'totalDreamPower',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const; 

export function DreamPower() {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalDreamPower',
  });

  if(isLoading) return <div>Loading...</div>;
  if(isError) return <div>Error loading dream power</div>;

  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm">Global DreamPower</p>
      <p className="text-4xl font-bold text-purple-400">
        ✨ {formatEther(data ?? 0n)} ETH
      </p>
    </div>
  );
}