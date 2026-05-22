import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, goals, donations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { decodeEventLog, formatEther } from 'viem';
import Athropic from '@anthropic-ai/sdk';
import { Bot } from 'grammy';

const anthropic = new Athropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

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

async function generateAiComment(goalName: string, amount: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5', // Use the latest model available
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: `Someone just donated ${formatEther(BigInt(amount))} ETH to a dream called "${goalName}". 
      Write a short inspiring comment (1-2 sentences, max 100 chars) to encourage them. 
      Be warm and enthusiastic.`,
    }],
  });

  return (message.content[0] as { text: string }).text;
}

async function sendTelegramNotification(goalName: string, amount: string, donorAddress: string, aiComment: string) {
  const ethAmount = formatEther(BigInt(amount));
  const shortAddress = `${donorAddress.slice(0, 6)}...${donorAddress.slice(-4)}`;

  await bot.api.sendMessage(
    process.env.TELEGRAM_CHAT_ID!,
    `💜 New donation to "${goalName}"!\n\nAmount: ${ethAmount} ETH\nFrom: ${shortAddress}\n\n✨ ${aiComment}`
  );
}

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

      const aiComment = await generateAiComment(goal.name, addedPower);
      console.log('Generated AI comment:', aiComment);

      // Save donation
      await db.insert(donations).values({
        goalId: goal.id,
        donorAddress: log.transaction.from.address.toLowerCase(),
        amount: addedPower,
        txHash,
        aiComment,
      }).onConflictDoNothing();

      // Update goal currentAmount
      await db.update(goals)
        .set({ currentAmount: addedPower })
        .where(eq(goals.id, goal.id));

      console.log('Donation saved:', txHash);
      
      await sendTelegramNotification(
        goal.name,
        addedPower,
        log.transaction.from.address,
        aiComment,
      );

    } catch (err) {
      console.error('Error processing log:', err);
    }
  }

  return NextResponse.json({ ok: true });
}