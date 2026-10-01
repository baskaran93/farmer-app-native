/**
 * Design tokens, aligned with the Collectionapp project (constants/theme.js) so both
 * apps share one visual language: indigo primary, #F0F1F8 canvas, 16px base spacing.
 *
 * `theme` is the legacy shape the existing screens import (background, surface, primary,
 * text, muted, danger, radius) -- the keys are unchanged, only the values were realigned.
 */
export const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4338CA',
  primaryLight: '#818CF8',
  primaryBg: '#EEF2FF',
  background: '#F0F1F8',
  white: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#22C55E',
  successBg: '#DCFCE7',
  successText: '#15803D',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  dangerText: '#991B1B',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  warningText: '#92400E',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  infoText: '#1D4ED8',
}

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, full: 100 }

export const theme = {
  colors: {
    background: COLORS.background,
    surface: COLORS.white,
    primary: COLORS.primary,
    primaryDark: COLORS.primaryDark,
    primaryBg: COLORS.primaryBg,
    text: COLORS.textPrimary,
    muted: COLORS.textSecondary,
    border: COLORS.border,
    danger: COLORS.danger,
    dangerBg: COLORS.dangerBg,
    success: COLORS.success,
    successBg: COLORS.successBg,
    warning: COLORS.warning,
    warningBg: COLORS.warningBg,
    info: COLORS.info,
    infoBg: COLORS.infoBg,
  },
  radius: RADIUS.md,
}
