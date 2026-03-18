import { Router } from 'express';
import { db, todo } from '../db/index.js';
import { eq, and, gte, lte } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import dayjs from 'dayjs';

const router = Router();

/**
 * 获取今日待办清单
 * GET /api/v1/todos
 */
router.get('/', async (req, res) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    const todos = await db
      .select()
      .from(todo)
      .where(eq(todo.date, today))
      .orderBy(todo.createdAt);

    res.json(todos);
  } catch (error) {
    console.error('获取待办清单失败:', error);
    res.status(500).json({ error: '获取待办清单失败' });
  }
});

/**
 * 获取日历统计数据
 * GET /api/v1/todos/calendar?month=2026-03
 */
router.get('/calendar', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || typeof month !== 'string') {
      return res.status(400).json({ error: '月份参数不能为空，格式：YYYY-MM' });
    }

    // 解析月份范围
    const startDate = dayjs(month).startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs(month).endOf('month').format('YYYY-MM-DD');

    // 查询该月的所有待办事项
    const todos = await db
      .select({
        date: todo.date,
        completed: todo.completed,
      })
      .from(todo)
      .where(
        and(
          gte(todo.date, startDate),
          lte(todo.date, endDate)
        )
      );

    // 按日期统计
    const stats: Record<string, { total: number; completed: number }> = {};

    todos.forEach((t) => {
      if (!stats[t.date]) {
        stats[t.date] = { total: 0, completed: 0 };
      }
      stats[t.date].total++;
      if (t.completed) {
        stats[t.date].completed++;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('获取日历统计失败:', error);
    res.status(500).json({ error: '获取日历统计失败' });
  }
});

/**
 * 获取指定日期的待办清单
 * GET /api/v1/todos/date/:date
 */
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;

    if (!dayjs(date).isValid()) {
      return res.status(400).json({ error: '日期格式无效，格式：YYYY-MM-DD' });
    }

    const todos = await db
      .select()
      .from(todo)
      .where(eq(todo.date, date))
      .orderBy(todo.createdAt);

    res.json(todos);
  } catch (error) {
    console.error('获取指定日期待办清单失败:', error);
    res.status(500).json({ error: '获取指定日期待办清单失败' });
  }
});

/**
 * 创建待办事项
 * POST /api/v1/todos
 * Body: { title: string, category: '琐事' | '日常' | '生活学习' }
 */
router.post('/', async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: '标题不能为空' });
    }

    if (!category || !['琐事', '日常', '生活学习'].includes(category)) {
      return res.status(400).json({ error: '分类无效' });
    }

    const today = dayjs().format('YYYY-MM-DD');
    const now = Date.now();

    const [newTodo] = await db
      .insert(todo)
      .values({
        title,
        category,
        date: today,
        completed: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    res.json(newTodo);
  } catch (error) {
    console.error('创建待办事项失败:', error);
    res.status(500).json({ error: '创建待办事项失败' });
  }
});

/**
 * 更新待办事项
 * PUT /api/v1/todos/:id
 * Body: { title?: string, completed?: boolean }
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const updates: any = { updatedAt: Date.now() };

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: '标题不能为空' });
      }
      updates.title = title;
    }

    if (completed !== undefined) {
      updates.completed = completed;
    }

    const [updated] = await db
      .update(todo)
      .set(updates)
      .where(eq(todo.id, Number(id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: '待办事项不存在' });
    }

    res.json(updated);
  } catch (error) {
    console.error('更新待办事项失败:', error);
    res.status(500).json({ error: '更新待办事项失败' });
  }
});

/**
 * 删除待办事项
 * DELETE /api/v1/todos/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(todo)
      .where(eq(todo.id, Number(id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: '待办事项不存在' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('删除待办事项失败:', error);
    res.status(500).json({ error: '删除待办事项失败' });
  }
});

export default router;
