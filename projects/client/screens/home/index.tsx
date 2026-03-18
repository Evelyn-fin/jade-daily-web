import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';

interface DailyQuote {
  id: number;
  date: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface Todo {
  id: number;
  title: string;
  category: '琐事' | '日常' | '生活学习';
  completed: boolean;
  date: string;
  createdAt: number;
  updatedAt: number;
}

interface Inspiration {
  id: number;
  content: string;
  aiPlan: string | null;
  createdAt: number;
  updatedAt: number;
}

const CATEGORIES = ['琐事', '日常', '生活学习'] as const;

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 状态
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);

  // 导航
  const router = useSafeRouter();

  // Modal 状态
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [todoModalVisible, setTodoModalVisible] = useState(false);
  const [inspirationModalVisible, setInspirationModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // 输入状态
  const [quoteInput, setQuoteInput] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [todoCategory, setTodoCategory] = useState<'琐事' | '日常' | '生活学习'>('琐事');
  const [inspirationContent, setInspirationContent] = useState('');

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [inspirationLoading, setInspirationLoading] = useState(false);

  // API 基础 URL
  const API_BASE = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

  // 获取今日语录
  const fetchDailyQuote = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/daily-quotes/today`);
      const data = await response.json();
      setDailyQuote(data);
    } catch (error) {
      console.error('获取今日语录失败:', error);
    }
  }, [API_BASE]);

  // 获取待办清单
  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('获取待办清单失败:', error);
    }
  }, [API_BASE]);

  // 获取灵感记录
  const fetchInspirations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/inspirations`);
      const data = await response.json();
      setInspirations(data);
    } catch (error) {
      console.error('获取灵感记录失败:', error);
    }
  }, [API_BASE]);

  // 更新今日语录
  const updateDailyQuote = async () => {
    if (!quoteInput.trim()) {
      Alert.alert('提示', '语录内容不能为空');
      return;
    }

    setLoading(true);
    try {
      /**
       * 服务端文件：server/src/routes/daily-quotes.ts
       * 接口：PUT /api/v1/daily-quotes/today
       * Body 参数：content: string
       */
      const response = await fetch(`${API_BASE}/api/v1/daily-quotes/today`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: quoteInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setDailyQuote(data);
        setQuoteModalVisible(false);
        setQuoteInput('');
      } else {
        Alert.alert('错误', '更新失败');
      }
    } catch (error) {
      console.error('更新今日语录失败:', error);
      Alert.alert('错误', '网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 创建待办事项
  const createTodo = async () => {
    if (!todoTitle.trim()) {
      Alert.alert('提示', '标题不能为空');
      return;
    }

    setLoading(true);
    try {
      /**
       * 服务端文件：server/src/routes/todos.ts
       * 接口：POST /api/v1/todos
       * Body 参数：title: string, category: '琐事' | '日常' | '生活学习'
       */
      const response = await fetch(`${API_BASE}/api/v1/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: todoTitle, category: todoCategory }),
      });

      if (response.ok) {
        await fetchTodos();
        setTodoModalVisible(false);
        setTodoTitle('');
        setTodoCategory('琐事');
      } else {
        Alert.alert('错误', '创建失败');
      }
    } catch (error) {
      console.error('创建待办事项失败:', error);
      Alert.alert('错误', '网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 切换待办事项完成状态
  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      /**
       * 服务端文件：server/src/routes/todos.ts
       * 接口：PUT /api/v1/todos/:id
       * Body 参数：completed: boolean
       */
      const response = await fetch(`${API_BASE}/api/v1/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  };

  // 删除待办事项
  const deleteTodo = async (id: number) => {
    Alert.alert('确认删除', '确定要删除这个待办事项吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            /**
             * 服务端文件：server/src/routes/todos.ts
             * 接口：DELETE /api/v1/todos/:id
             */
            const response = await fetch(`${API_BASE}/api/v1/todos/${id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              await fetchTodos();
            }
          } catch (error) {
            console.error('删除待办事项失败:', error);
          }
        },
      },
    ]);
  };

  // 创建灵感记录
  const createInspiration = async () => {
    if (!inspirationContent.trim()) {
      Alert.alert('提示', '灵感内容不能为空');
      return;
    }

    setInspirationLoading(true);
    try {
      /**
       * 服务端文件：server/src/routes/inspirations.ts
       * 接口：POST /api/v1/inspirations
       * Body 参数：content: string, generateAI: boolean
       */
      const response = await fetch(`${API_BASE}/api/v1/inspirations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inspirationContent, generateAI: true }),
      });

      if (response.ok) {
        await fetchInspirations();
        setInspirationModalVisible(false);
        setInspirationContent('');
        Alert.alert('成功', '灵感记录已创建，AI 正在生成计划...');
      } else {
        Alert.alert('错误', '创建失败');
      }
    } catch (error) {
      console.error('创建灵感记录失败:', error);
      Alert.alert('错误', '网络错误');
    } finally {
      setInspirationLoading(false);
    }
  };

  // 删除灵感记录
  const deleteInspiration = async (id: number) => {
    Alert.alert('确认删除', '确定要删除这个灵感记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            /**
             * 服务端文件：server/src/routes/inspirations.ts
             * 接口：DELETE /api/v1/inspirations/:id
             */
            const response = await fetch(`${API_BASE}/api/v1/inspirations/${id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              await fetchInspirations();
            }
          } catch (error) {
            console.error('删除灵感记录失败:', error);
          }
        },
      },
    ]);
  };

  // 页面聚焦时加载数据
  useFocusEffect(
    useCallback(() => {
      fetchDailyQuote();
      fetchTodos();
      fetchInspirations();
    }, [fetchDailyQuote, fetchTodos, fetchInspirations])
  );

  // 打开编辑语录 Modal
  const openQuoteModal = () => {
    setQuoteInput(dailyQuote?.content || '');
    setQuoteModalVisible(true);
  };

  // 打开创建待办 Modal
  const openTodoModal = () => {
    setTodoTitle('');
    setTodoCategory('琐事');
    setTodoModalVisible(true);
  };

  // 打开灵感记录 Modal
  const openInspirationModal = () => {
    setInspirationContent('');
    setInspirationModalVisible(true);
  };

  // 渲染待办事项列表
  const renderTodoItem = (todo: Todo) => (
    <TouchableOpacity
      key={todo.id}
      style={styles.todoItem}
      onPress={() => toggleTodo(todo.id, !todo.completed)}
    >
      <View style={[styles.todoCheckbox, todo.completed && styles.todoCheckboxChecked]}>
        {todo.completed && <FontAwesome6 name="check" size={12} color={theme.buttonPrimaryText} />}
      </View>
      <View style={styles.todoContent}>
        <ThemedText
          variant="body"
          style={[styles.todoTitle, todo.completed && styles.todoTitleCompleted]}
          color={todo.completed ? theme.textMuted : theme.textPrimary}
        >
          {todo.title}
        </ThemedText>
      </View>
      <TouchableOpacity onPress={() => deleteTodo(todo.id)} style={styles.deleteButton}>
        <FontAwesome6 name="trash" size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // 渲染分类待办清单
  const renderCategoryTodos = (category: typeof CATEGORIES[number]) => {
    const categoryTodos = todos.filter(t => t.category === category);
    return (
      <ThemedView key={category} level="default" style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <ThemedText variant="h4" color={theme.textPrimary}>
            {category}
          </ThemedText>
          <ThemedText variant="caption" color={theme.textMuted}>
            {categoryTodos.filter(t => t.completed).length}/{categoryTodos.length}
          </ThemedText>
        </View>
        <View style={styles.todoList}>
          {categoryTodos.length === 0 ? (
            <ThemedText variant="small" color={theme.textMuted} style={styles.emptyText}>
              暂无待办事项
            </ThemedText>
          ) : (
            categoryTodos.map(renderTodoItem)
          )}
        </View>
      </ThemedView>
    );
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 每日语录 */}
        <ThemedView level="default" style={styles.quoteCard}>
          <TouchableOpacity onPress={openQuoteModal} style={styles.quoteHeader}>
            <ThemedText variant="label" color={theme.primary}>
              Jade&apos;s Daily Schedule
            </ThemedText>
            <FontAwesome6 name="pen" size={16} color={theme.primary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary} style={styles.quoteContent}>
            {dailyQuote?.content || '该吃吃，该喝喝，凡事别往心里搁'}
          </ThemedText>
        </ThemedView>

        {/* 待办清单 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h3" color={theme.textPrimary}>
              今日待办
            </ThemedText>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => router.push('/calendar')} style={styles.iconButton}>
                <FontAwesome6 name="calendar" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openTodoModal} style={styles.addButton}>
                <FontAwesome6 name="plus" size={20} color={theme.buttonPrimaryText} />
              </TouchableOpacity>
            </View>
          </View>
          {CATEGORIES.map(renderCategoryTodos)}
        </View>

        {/* 灵感记录 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h3" color={theme.textPrimary}>
              每日灵感
            </ThemedText>
            <TouchableOpacity onPress={openInspirationModal} style={styles.addButton}>
              <FontAwesome6 name="plus" size={20} color={theme.buttonPrimaryText} />
            </TouchableOpacity>
          </View>
          <View style={styles.inspirationList}>
            {inspirations.length === 0 ? (
              <ThemedText variant="small" color={theme.textMuted} style={styles.emptyText}>
                暂无灵感记录
              </ThemedText>
            ) : (
              inspirations.map(inspiration => {
                let aiPlanData = null;
                let isGenerating = false;

                try {
                  if (inspiration.aiPlan) {
                    aiPlanData = JSON.parse(inspiration.aiPlan);
                  }
                } catch (e) {
                  aiPlanData = { message: inspiration.aiPlan };
                }

                isGenerating = Boolean(inspiration.aiPlan && inspiration.aiPlan.includes('正在生成'));

                return (
                  <ThemedView key={inspiration.id} level="default" style={styles.inspirationCard}>
                    <View style={styles.inspirationHeader}>
                      <ThemedText variant="body" color={theme.textPrimary}>
                        {inspiration.content}
                      </ThemedText>
                      <TouchableOpacity onPress={() => deleteInspiration(inspiration.id)} style={styles.deleteButton}>
                        <FontAwesome6 name="trash" size={16} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                    {aiPlanData && aiPlanData.message && (
                      <View style={styles.aiPlanSection}>
                        <ThemedText variant="caption" color={theme.textMuted}>
                          {aiPlanData.message}
                        </ThemedText>
                      </View>
                    )}
                    {aiPlanData && aiPlanData.steps && aiPlanData.steps.length > 0 && (
                      <View style={styles.aiPlanSection}>
                        <ThemedText variant="label" color={theme.primary} style={styles.aiPlanLabel}>
                          已自动生成 {aiPlanData.steps.length} 个待办事项
                        </ThemedText>
                        <View style={styles.stepsList}>
                          {aiPlanData.steps.map((step: any, idx: number) => (
                            <ThemedText key={idx} variant="small" color={theme.textSecondary} style={styles.stepItem}>
                              {step.stepNumber}. {step.content}
                            </ThemedText>
                          ))}
                        </View>
                      </View>
                    )}
                    {isGenerating && (
                      <ThemedText variant="small" color={theme.textMuted} style={styles.generatingText}>
                        AI 正在生成计划...
                      </ThemedText>
                    )}
                  </ThemedView>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {/* 语录编辑 Modal */}
      <Modal visible={quoteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.modalTitle}>
              编辑今日语录
            </ThemedText>
            <TextInput
              style={[styles.textInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary }]}
              value={quoteInput}
              onChangeText={setQuoteInput}
              placeholder="输入今日语录..."
              placeholderTextColor={theme.textMuted}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setQuoteModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <ThemedText variant="body" color={theme.textSecondary}>
                  取消
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={updateDailyQuote} style={[styles.modalButton, styles.submitButton]}>
                {loading ? (
                  <ActivityIndicator size="small" color={theme.buttonPrimaryText} />
                ) : (
                  <ThemedText variant="body" color={theme.buttonPrimaryText}>
                    保存
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 待办事项 Modal */}
      <Modal visible={todoModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.modalTitle}>
              新增待办事项
            </ThemedText>
            <TextInput
              style={[styles.textInput, { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary }]}
              value={todoTitle}
              onChangeText={setTodoTitle}
              placeholder="输入待办事项..."
              placeholderTextColor={theme.textMuted}
            />
            <View style={styles.categorySelector}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryOption,
                    todoCategory === cat && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setTodoCategory(cat)}
                >
                  <ThemedText
                    variant="small"
                    color={todoCategory === cat ? theme.buttonPrimaryText : theme.textPrimary}
                  >
                    {cat}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setTodoModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <ThemedText variant="body" color={theme.textSecondary}>
                  取消
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={createTodo} style={[styles.modalButton, styles.submitButton]}>
                {loading ? (
                  <ActivityIndicator size="small" color={theme.buttonPrimaryText} />
                ) : (
                  <ThemedText variant="body" color={theme.buttonPrimaryText}>
                    添加
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 灵感记录 Modal */}
      <Modal visible={inspirationModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText variant="h4" color={theme.textPrimary} style={styles.modalTitle}>
              新增灵感
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                styles.inspirationInput,
                { color: theme.textPrimary, backgroundColor: theme.backgroundTertiary },
              ]}
              value={inspirationContent}
              onChangeText={setInspirationContent}
              placeholder="输入你的想法..."
              placeholderTextColor={theme.textMuted}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setInspirationModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <ThemedText variant="body" color={theme.textSecondary}>
                  取消
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={createInspiration} style={[styles.modalButton, styles.submitButton]}>
                {inspirationLoading ? (
                  <ActivityIndicator size="small" color={theme.buttonPrimaryText} />
                ) : (
                  <ThemedText variant="body" color={theme.buttonPrimaryText}>
                    创建并生成计划
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
