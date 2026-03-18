export const Colors = {
  light: {
    textPrimary: "#422006", // 暖棕黑，搭配橙色调
    textSecondary: "#78350F", // 暖灰
    textMuted: "#A16207", // 暖色辅助文本
    primary: "#EA580C", // Warm Orange - 白橙风格主色
    accent: "#F97316", // Orange-500 - 辅助橙色
    success: "#10B981", // Emerald-500
    error: "#EF4444",
    backgroundRoot: "#FFF7ED", // Orange-50 - 浅橙白背景
    backgroundDefault: "rgba(255,255,255,0.9)", // 半透明白色卡片背景
    backgroundTertiary: "#FFEDD5", // Orange-100 - 去线留白背景
    buttonPrimaryText: "#FFFFFF",
    tabIconSelected: "#EA580C",
    border: "#FDBA74", // Orange-300 - 橙色边框
    borderLight: "#FFEDD5", // Orange-100 - 浅色边框
  },
  dark: {
    textPrimary: "#FFEDD5",
    textSecondary: "#FED7AA",
    textMuted: "#A16207",
    primary: "#FB923C", // Orange-400 - 暗色模式橙色
    accent: "#F97316", // Orange-500
    success: "#34D399",
    error: "#F87171",
    backgroundRoot: "#1C1917", // 深色背景
    backgroundDefault: "rgba(255,255,255,0.1)",
    backgroundTertiary: "rgba(255,255,255,0.05)",
    buttonPrimaryText: "#1C1917",
    tabIconSelected: "#FB923C",
    border: "#431407",
    borderLight: "#292524",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -4,
  },
  displayLarge: {
    fontSize: 112,
    lineHeight: 112,
    fontWeight: "200" as const,
    letterSpacing: -2,
  },
  displayMedium: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "300" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
  labelTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  stat: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300" as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
};

export type Theme = typeof Colors.light;
