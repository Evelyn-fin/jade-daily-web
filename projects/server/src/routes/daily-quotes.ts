import { Router } from 'express';
import { db, dailyQuote } from '../db/index.js';
import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';

const router = Router();

/**
 * 获取今日语录
 * GET /api/v1/daily-quotes/today
 */
router.get('/today', async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    const [quote] = await db
      .select()
      .from(dailyQuote)
      .where(eq(dailyQuote.date, today));

    if (!quote) {
      // 如果今日没有语录，返回默认语录
      const defaultQuote = {
        id: 0,
        date: today,
        content: '该吃吃，该喝喝，凡事别往心里搁',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return res.json(defaultQuote);
    }

    res.json(quote);
  } catch (error) {
    console.error('获取今日语录失败:', error);
    res.status(500).json({ error: '获取今日语录失败' });
  }
});

/**
 * 更新今日语录
 * PUT /api/v1/daily-quotes/today
 * Body: { content: string }
 */
router.put('/today', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: '语录内容不能为空' });
    }

    const today = dayjs().format('YYYY-MM-DD');
    const [existingQuote] = await db
      .select()
      .from(dailyQuote)
      .where(eq(dailyQuote.date, today));

    const now = Date.now();

    if (existingQuote) {
      // 更新现有语录
      await db
        .update(dailyQuote)
        .set({ content, updatedAt: now })
        .where(eq(dailyQuote.date, today));

      const [updated] = await db
        .select()
        .from(dailyQuote)
        .where(eq(dailyQuote.date, today));

      return res.json(updated);
    } else {
      // 创建新语录
      const [newQuote] = await db
        .insert(dailyQuote)
        .values({
          date: today,
          content,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return res.json(newQuote);
    }
  } catch (error) {
    console.error('更新今日语录失败:', error);
    res.status(500).json({ error: '更新今日语录失败' });
  }
});

export default router;
