'use client';

import { useState, useEffect } from "react";
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";


export function AddGoalForm({onSuccess} : {onSuccess: () => void }) {
    const { address } = useAccount();
    const [name, setName] = useState('');
    const [target, setTarget] = useState(''); 
    

    const { writeContract, data: hash, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash
    });

    useEffect(() => {
    if (isSuccess) {
        onSuccess();
        setName('');
        setTarget('');
    }
    }, [isSuccess]);

    function handleSubmit() {
        if (!address || !name || !target) return;

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'addGoal',
            args: [name, parseEther(target)],
        });
    }

    return (
         <div className="w-full max-w-md bg-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold">➕ New Goal</h2>
            <input
                className="bg-white/10 rounded-lg px-4 py-2 outline-none"
                placeholder="Goal name..."
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                className="bg-white/10 rounded-lg px-4 py-2 outline-none"
                placeholder="Amount in ETH (e.g., 0.1)"
                value={target}
                onChange={e => setTarget(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                disabled={isPending || isConfirming || !address}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg px-4 py-2 font-bold transition"
            >
                {isPending ? 'Confirm in MetaMask...' : isConfirming ? 'Waiting for blockchain...' : 'Create Goal'}
            </button>
            {!address && <p className="text-gray-400 text-sm text-center">Connect your wallet</p>}
            </div>
    );
}