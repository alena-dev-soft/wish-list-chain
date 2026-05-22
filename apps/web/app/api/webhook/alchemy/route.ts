import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, goals, donations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { decodeEventLog } from 'viem';

const DREAM_POWER_INCREASED_ABI = [{
  name: 'DreamPowerIncreased',
  type: 'event',
  inputs: [
    { name: 'owner', type: 'address', indexed: true },
    { name: 'goalIndex', type: 'uint256', indexed: true },
    { name: 'addedPower', type: 'uint256', indexed: false },
    { name: 'newTotalPower', type: 'uint256', indexed: false },
  ],
}] as const;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const logs = body?.event?.data?.block?.logs;
  if (!logs || logs.length === 0) {
    return NextResponse.json({ ok: true });
  }

  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
        abi: DREAM_POWER_INCREASED_ABI,
        data: log.data,
        topics: log.topics,
      });

      const ownerAddress = decoded.args.owner.toLowerCase();
      const goalIndex = decoded.args.goalIndex.toString();
      const addedPower = decoded.args.addedPower.toString();
      const txHash = log.transaction.hash;

      // Find or create user
      let user = await db.query.users.findFirst({
        where: eq(users.walletAddress, ownerAddress),
      });

      if (!user) {
        const [newUser] = await db.insert(users).values({
          walletAddress: ownerAddress,
        }).returning();
        user = newUser;
      }

      // Find goal
      const goal = await db.query.goals.findFirst({
        where: and(
          eq(goals.ownerId, user.id),
          eq(goals.goalIndex, goalIndex),
        ),
      });

      if (!goal) {
        console.log('Goal not found:', ownerAddress, goalIndex);
        continue;
      }

      // Save donation
      await db.insert(donations).values({
        goalId: goal.id,
        donorAddress: log.transaction.from.address.toLowerCase(),
        amount: addedPower,
        txHash,
      }).onConflictDoNothing();

      // Update goal currentAmount
      await db.update(goals)
        .set({ currentAmount: addedPower })
        .where(eq(goals.id, goal.id));

      console.log('Donation saved:', txHash);

    } catch (err) {
      console.error('Error processing log:', err);
    }
  }

  return NextResponse.json({ ok: true });
}