import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createStyles } from './styles';
import dayjs from 'dayjs';

interface CalendarStats {
  [date: string]: {
    total: number;
    completed: number;
  };
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

export default function CalendarScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 状态
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [calendarStats, setCalendarStats] = useState<CalendarStats>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // API 基础 URL
  const API_BASE = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

  // 获取日历统计数据
  const fetchCalendarStats = useCallback(async (month: dayjs.Dayjs) => {
    try {
      setLoading(true);
      /**
       * 服务端文件：server/src/routes/todos.ts
       * 接口：GET /api/v1/todos/calendar?month=2026-03
       */
      const response = await fetch(
        `${API_BASE}/api/v1/todos/calendar?month=${month.format('YYYY-MM')}`
      );
      const data = await response.json();
      setCalendarStats(data);
    } catch (error) {
      console.error('获取日历统计失败:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // 获取指定日期的待办事项
  const fetchTodosByDate = useCallback(async (date: string) => {
    try {
      /**
       * 服务端文件：server/src/routes/todos.ts
       * 接口：GET /api/v1/todos/date/:date
       */
      const response = await fetch(`${API_BASE}/api/v1/todos/date/${date}`);
      const data = await response.json();
      setSelectedTodos(data);
    } catch (error) {
      console.error('获取待办事项失败:', error);
    }
  }, [API_BASE]);

  // 页面聚焦时加载数据
  useFocusEffect(
    useCallback(() => {
      fetchCalendarStats(currentMonth);
    }, [fetchCalendarStats, currentMonth])
  );

  // 切换月份
  const changeMonth = (delta: number) => {
    setCurrentMonth(currentMonth.add(delta, 'month'));
  };

  // 生成日历网格
  const renderCalendarGrid = () => {
    const year = currentMonth.year();
    const month = currentMonth.month();
    const firstDay = dayjs().year(year).month(month).startOf('month');
    const lastDay = dayjs().year(year).month(month).endOf('month');
    const startDayOfWeek = firstDay.day(); // 0-6, 0=周日
    const totalDays = lastDay.date();

    const days = [];

    // 填充空白（上个月的日期）
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // 填充当月日期
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = dayjs().year(year).month(month).date(day).format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      const stats = calendarStats[dateStr];
      const isToday = dateStr === today;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            selectedDate === dateStr && styles.selectedCell,
          ]}
          onPress={() => handleDatePress(dateStr)}
        >
          <ThemedText
            variant="body"
            style={[styles.dayNumber, isToday && styles.todayNumber]}
            color={isToday ? theme.buttonPrimaryText : theme.textPrimary}
          >
            {day}
          </ThemedText>
          {stats && stats.total > 0 && (
            <View style={styles.statsBadge}>
              <ThemedText variant="caption" color={theme.buttonPrimaryText}>
                {stats.completed}/{stats.total}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  // 处理日期点击
  const handleDatePress = async (dateStr: string) => {
    setSelectedDate(dateStr);
    await fetchTodosByDate(dateStr);
    setDetailModalVisible(true);
  };

  // 渲染星期标题
  const renderWeekdayHeader = () => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays.map((day, index) => (
      <View key={index} style={styles.weekdayCell}>
        <ThemedText variant="caption" color={theme.textMuted}>
          {day}
        </ThemedText>
      </View>
    ));
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 月份选择器 */}
        <ThemedView level="default" style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <FontAwesome6 name="chevron-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary}>
            {currentMonth.format('YYYY年 M月')}
          </ThemedText>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
            <FontAwesome6 name="chevron-right" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </ThemedView>

        {/* 日历网格 */}
        <ThemedView level="default" style={styles.calendarContainer}>
          {/* 星期标题 */}
          <View style={styles.weekdayRow}>{renderWeekdayHeader()}</View>
          {/* 日期网格 */}
          <View style={styles.daysGrid}>{renderCalendarGrid()}</View>
        </ThemedView>

        {/* 统计信息 */}
        <ThemedView level="default" style={styles.summaryCard}>
          <ThemedText variant="h4" color={theme.textPrimary}>
            本月统计
          </ThemedText>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText variant="stat" color={theme.primary}>
                {Object.values(calendarStats).reduce((sum, s) => sum + s.total, 0)}
              </ThemedText>
              <ThemedText variant="caption" color={theme.textMuted}>
                总待办
              </ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText variant="stat" color={theme.success}>
                {Object.values(calendarStats).reduce((sum, s) => sum + s.completed, 0)}
              </ThemedText>
              <ThemedText variant="caption" color={theme.textMuted}>
                已完成
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>

      {/* 详情 Modal */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText variant="h4" color={theme.textPrimary}>
                {selectedDate}
              </ThemedText>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <FontAwesome6 name="xmark" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedTodos.length === 0 ? (
                <ThemedText variant="body" color={theme.textMuted} style={styles.emptyText}>
                  这一天没有待办事项
                </ThemedText>
              ) : (
                selectedTodos.map(todo => (
                  <View key={todo.id} style={styles.todoItem}>
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
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {todo.category}
                      </ThemedText>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
