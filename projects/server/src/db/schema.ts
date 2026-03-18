import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 每日语录
export const dailyQuote = sqliteTable('daily_quote', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull().unique(), // YYYY-MM-DD
  content: text('content').notNull(),
  createdAt: integer('created_at').notNull().$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at').notNull().$defaultFn(() => Date.now()),
});

// 待办清单
export const todo = sqliteTable('todo', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  category: text('category').notNull(), // '琐事' | '日常' | '生活学习'
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  date: text('date').notNull(), // YYYY-MM-DD
  createdAt: integer('created_at').notNull().$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at').notNull().$defaultFn(() => Date.now()),
});

// 灵感记录
export const inspiration = sqliteTable('inspiration', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  aiPlan: text('ai_plan'), // AI 生成的执行步骤
  createdAt: integer('created_at').notNull().$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at').notNull().$defaultFn(() => Date.now()),
});

// 类型定义
export type DailyQuote = typeof dailyQuote.$inferSelect;
export type NewDailyQuote = typeof dailyQuote.$inferInsert;
export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
export type Inspiration = typeof inspiration.$inferSelect;
export type NewInspiration = typeof inspiration.$inferInsert;
