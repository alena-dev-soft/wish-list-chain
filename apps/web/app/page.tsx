'use client'; 

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DreamPower } from "@/components/DreamPower";
import { AddGoalForm } from '@/components/AddGoalForm';
import { GoalList } from "@/components/GoalList";

import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function Home() {
  const { address } = useAccount();
  const [refresh, setRefresh] = useState(0);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">WishList Chain</h1>
      <p className="text-gray-400">Receive donations for your wishes</p>
      <DreamPower />
      <ConnectButton />
      {address && (
        <>
          <AddGoalForm onSuccess={() => setRefresh(r => r + 1)} />
          <GoalList key={refresh} owner={address} />
        </>
      )}
    </main>
  )
}
