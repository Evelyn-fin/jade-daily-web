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
    quoteCard: {
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.xl,
      borderWidth: 2,
      borderColor: theme.borderLight,
    },
    quoteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    quoteContent: {
      lineHeight: 32,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: Spacing.sm,
      alignItems: 'center',
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.md,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    todoList: {
      gap: Spacing.sm,
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
    deleteButton: {
      padding: Spacing.xs,
    },
    emptyText: {
      textAlign: 'center',
      paddingVertical: Spacing.lg,
      fontStyle: 'italic',
    },
    inspirationList: {
      gap: Spacing.md,
    },
    inspirationCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
    },
    inspirationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    aiPlanSection: {
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    aiPlanLabel: {
      marginBottom: Spacing.sm,
    },
    stepsList: {
      marginTop: Spacing.sm,
      gap: Spacing.xs,
    },
    stepItem: {
      lineHeight: 20,
    },
    aiPlanContent: {
      lineHeight: 22,
    },
    generatingText: {
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: Spacing.sm,
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
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    modalTitle: {
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    textInput: {
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      fontSize: 16,
      minHeight: 100,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inspirationInput: {
      minHeight: 150,
    },
    categorySelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    categoryOption: {
      flex: 1,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: Spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    submitButton: {
      backgroundColor: theme.primary,
    },
  });
};
