import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, goals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { ABI, CONTRACT_ADDRESS } from '@/lib/contract';

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.ALCHEMY_SEPOLIA_URL!),
});

export async function POST(req: NextRequest) {
    const { walletAddress } = await req.json();

    if(!walletAddress) {
        return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 });
    }

    const address = walletAddress.toLowerCase();

    // Read goals from contract 
    const contractGoals = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getGoals',
        args: [address],
    });

    if(!contractGoals || contractGoals.length === 0) {
        return NextResponse.json({ synced: 0 });
    }

    // Find or create user
    let user = await db.query.users.findFirst({
        where: eq(users.walletAddress, address),
    });

    if(!user) {
        const [newUser] = await db.insert(users).values({
            walletAddress: address,
        }).returning();

        user = newUser;
    }

    // Sync goals to database
    let synced = 0;

    for(let i = 0; i < contractGoals.length; i++) {
        const g = contractGoals[i];
        const existingGoal = await db.query.goals.findFirst({
            where: eq(goals.goalIndex, i.toString()),
        });

        if(!existingGoal) {
            await db.insert(goals).values({
                ownerId: user.id,
                name: g.name,
                targetAmount: g.targetAmount.toString(),
                currentAmount: g.currentAmount.toString(),
                dreamPower: g.dreamPower.toString(),
                isFulfilled: g.isFulfilled,
                goalIndex: i.toString(),
            });
            synced++;
        }
    }

    return NextResponse.json({ synced });
}
