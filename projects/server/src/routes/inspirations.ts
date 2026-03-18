import { Router } from 'express';
import { db, inspiration, todo } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { generateAISteps, type AIStep } from '../services/aiService.js';
import dayjs from 'dayjs';

const router = Router();

/**
 * 获取所有灵感记录
 * GET /api/v1/inspirations
 */
router.get('/', async (req, res) => {
  try {
    const inspirations = await db
      .select()
      .from(inspiration)
      .orderBy(inspiration.createdAt);

    res.json(inspirations);
  } catch (error) {
    console.error('获取灵感记录失败:', error);
    res.status(500).json({ error: '获取灵感记录失败' });
  }
});

/**
 * 创建灵感记录并生成 AI 计划，自动创建待办事项
 * POST /api/v1/inspirations
 * Body: { content: string, generateAI?: boolean }
 */
router.post('/', async (req, res) => {
  try {
    const { content, generateAI = true } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: '灵感内容不能为空' });
    }

    const now = Date.now();
    const today = dayjs().format('YYYY-MM-DD');

    // 先创建灵感记录
    const [newInspiration] = await db
      .insert(inspiration)
      .values({
        content,
        aiPlan: JSON.stringify({ message: 'AI正在生成步骤...' }),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // 异步生成 AI 步骤并创建待办事项（不阻塞响应）
    if (generateAI) {
      generateAISteps(content)
        .then(async (steps: AIStep[]) => {
          if (steps.length > 0) {
            // 更新灵感的AI计划（保存为JSON）
            await db
              .update(inspiration)
              .set({
                aiPlan: JSON.stringify({ steps, message: `已自动生成 ${steps.length} 个待办事项` }),
                updatedAt: Date.now(),
              })
              .where(eq(inspiration.id, newInspiration.id));

            // 自动创建待办事项（分类：日常）
            for (const step of steps) {
              await db.insert(todo).values({
                title: step.content,
                category: '日常',
                completed: false,
                date: today,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
            }

            console.log(`已为灵感 #${newInspiration.id} 自动创建 ${steps.length} 个待办事项`);
          } else {
            // 没有生成步骤
            await db
              .update(inspiration)
              .set({
                aiPlan: JSON.stringify({ message: '未能生成执行步骤，请重试' }),
                updatedAt: Date.now(),
              })
              .where(eq(inspiration.id, newInspiration.id));
          }
        })
        .catch((error) => {
          console.error('生成 AI 步骤失败:', error);
          // 更新错误信息
          db.update(inspiration)
            .set({
              aiPlan: JSON.stringify({ message: 'AI生成失败，请重试' }),
              updatedAt: Date.now(),
            })
            .where(eq(inspiration.id, newInspiration.id))
            .catch((err) => console.error('更新灵感状态失败:', err));
        });
    }

    res.json(newInspiration);
  } catch (error) {
    console.error('创建灵感记录失败:', error);
    res.status(500).json({ error: '创建灵感记录失败' });
  }
});

/**
 * 重新生成 AI 计划
 * POST /api/v1/inspirations/:id/regenerate
 */
router.post('/:id/regenerate', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db
      .select()
      .from(inspiration)
      .where(eq(inspiration.id, Number(id)));

    if (!existing) {
      return res.status(404).json({ error: '灵感记录不存在' });
    }

    const today = dayjs().format('YYYY-MM-DD');

    // 生成新的 AI 步骤
    const steps = await generateAISteps(existing.content);

    if (steps.length > 0) {
      // 更新记录
      const [updated] = await db
        .update(inspiration)
        .set({
          aiPlan: JSON.stringify({ steps, message: `已自动生成 ${steps.length} 个待办事项` }),
          updatedAt: Date.now(),
        })
        .where(eq(inspiration.id, Number(id)))
        .returning();

      // 自动创建待办事项
      for (const step of steps) {
        await db.insert(todo).values({
          title: step.content,
          category: '日常',
          completed: false,
          date: today,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      res.json(updated);
    } else {
      res.status(500).json({ error: '未能生成执行步骤' });
    }
  } catch (error) {
    console.error('重新生成 AI 计划失败:', error);
    res.status(500).json({ error: '重新生成 AI 计划失败' });
  }
});

/**
 * 删除灵感记录
 * DELETE /api/v1/inspirations/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(inspiration)
      .where(eq(inspiration.id, Number(id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: '灵感记录不存在' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('删除灵感记录失败:', error);
    res.status(500).json({ error: '删除灵感记录失败' });
  }
});

export default router;
