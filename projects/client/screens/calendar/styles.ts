import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing["5xl"],
    },
    monthSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.lg,
    },
    monthButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    calendarContainer: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.lg,
    },
    weekdayRow: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    weekdayCell: {
      flex: 1,
      alignItems: 'center',
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BorderRadius.sm,
      marginBottom: Spacing.xs,
    },
    todayCell: {
      backgroundColor: theme.primary,
    },
    selectedCell: {
      backgroundColor: `${theme.primary}40`,
    },
    dayNumber: {
      fontWeight: '600',
    },
    todayNumber: {
      color: theme.buttonPrimaryText,
    },
    statsBadge: {
      position: 'absolute',
      bottom: 2,
      backgroundColor: `${theme.primary}20`,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 8,
    },
    summaryCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: Spacing.md,
    },
    summaryItem: {
      alignItems: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    modalContent: {
      width: '100%',
      maxHeight: '80%',
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    modalBody: {
      padding: Spacing.lg,
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      gap: Spacing.md,
    },
    todoCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    todoCheckboxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    todoContent: {
      flex: 1,
    },
    todoTitle: {
      flex: 1,
    },
    todoTitleCompleted: {
      textDecorationLine: 'line-through',
    },
    emptyText: {
      textAlign: 'center',
      paddingVertical: Spacing.xl,
    },
  });
};
