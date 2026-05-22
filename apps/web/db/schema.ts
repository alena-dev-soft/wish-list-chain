import { pgTable, text, timestamp, uuid, boolean, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').notNull().unique(),
  telegramId: text('telegram_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  targetAmount: numeric('target_amount').notNull(),
  currentAmount: numeric('current_amount').default('0').notNull(),
  dreamPower: numeric('dream_power').default('0').notNull(),
  isFulfilled: boolean('is_fulfilled').default(false).notNull(),
  goalIndex: numeric('goal_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const donations = pgTable('donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => goals.id).notNull(),
  donorAddress: text('donor_address').notNull(),
  amount: numeric('amount').notNull(),
  txHash: text('tx_hash').notNull().unique(),
  aiComment: text('ai_comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dreamPowerSnapshots = pgTable('dream_power_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  totalDreamPower: numeric('total_dream_power').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});