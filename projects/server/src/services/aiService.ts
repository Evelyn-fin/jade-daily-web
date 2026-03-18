import { LLMClient, Config } from 'coze-coding-dev-sdk';

export interface AIPlanRequest {
  inspiration: string;
}

export interface AIStep {
  stepNumber: number;
  content: string;
}

/**
 * 使用豆包 AI 生成执行步骤（返回JSON格式）
 */
export async function generateAISteps(inspiration: string): Promise<AIStep[]> {
  const prompt = `用户有一个想法："${inspiration}"

请根据这个想法，生成具体的、可执行的步骤计划。

要求：
1. 步骤要具体、可操作，不要泛泛而谈
2. 按时间顺序排列，有清晰的阶段划分
3. 每个步骤都是用户可以直接执行的
4. 使用简洁明了的语言
5. 步骤数量控制在 5-8 条之间
6. 每个步骤应该是一个独立的待办事项

输出格式（必须是有效的JSON数组，不要有其他内容）：
[
  {"stepNumber": 1, "content": "第一个具体步骤"},
  {"stepNumber": 2, "content": "第二个具体步骤"},
  {"stepNumber": 3, "content": "第三个具体步骤"}
]

请直接输出JSON数组，不要添加任何其他文字或解释。`;

  try {
    const config = new Config();
    const client = new LLMClient(config);

    const messages = [
      {
        role: 'user' as const,
        content: prompt,
      },
    ];

    const response = await client.invoke(messages, {
      model: 'doubao-seed-1-8-251228',
      temperature: 0.7,
    });

    const content = response.content || '[]';

    // 尝试解析JSON
    try {
      // 移除可能的markdown代码块标记
      let jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const steps = JSON.parse(jsonStr);

      // 验证格式
      if (Array.isArray(steps) && steps.length > 0 && steps[0].stepNumber && steps[0].content) {
        return steps as AIStep[];
      } else {
        console.warn('AI返回的步骤格式不正确，使用备用格式');
        // 如果格式不对，尝试从文本中提取步骤
        return parseStepsFromText(content);
      }
    } catch (parseError) {
      console.warn('JSON解析失败，尝试从文本中提取步骤:', parseError);
      return parseStepsFromText(content);
    }
  } catch (error) {
    console.error('AI 生成失败:', error);
    throw new Error('AI 生成失败，请稍后重试');
  }
}

/**
 * 从文本中解析步骤（备用方案）
 */
function parseStepsFromText(text: string): AIStep[] {
  const steps: AIStep[] = [];
  const lines = text.split('\n');
  let stepNumber = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    // 匹配 "1. 步骤内容" 或 "1、步骤内容" 格式
    const match = trimmed.match(/^(\d+)[.、]\s*(.+)$/);
    if (match) {
      steps.push({
        stepNumber: parseInt(match[1]),
        content: match[2],
      });
    } else if (trimmed.startsWith('执行步骤') || trimmed.startsWith('步骤')) {
      // 跳过标题行
      continue;
    }
  }

  // 如果没有匹配到，尝试按行分割
  if (steps.length === 0) {
    const nonEmptyLines = text.split('\n').filter(l => l.trim());
    nonEmptyLines.forEach((line, idx) => {
      if (line.trim() && !line.trim().startsWith('执行') && !line.trim().startsWith('步骤')) {
        steps.push({
          stepNumber: idx + 1,
          content: line.trim(),
        });
      }
    });
  }

  return steps.slice(0, 8); // 最多8个步骤
}
