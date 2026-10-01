import React from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, RADIUS, SPACING } from '../theme'
import { useI18n } from '../i18n'

/* ------------------------------------------------------------------ *
 * Feedback helpers.
 * Alert.alert() is an EMPTY STUB in react-native-web (see
 * node_modules/react-native-web/dist/exports/Alert), so on web a dialog would
 * silently never appear. These helpers use browser dialogs on web and the
 * native ones everywhere else, so feedback is never invisible.
 * ------------------------------------------------------------------ */
export function showMessage(title: string, message?: string){
  if(Platform.OS === 'web'){
    const w = globalThis as any
    if(typeof w.alert === 'function') w.alert(message ? `${title}\n${message}` : title)
    return
  }
  Alert.alert(title, message)
}

export function confirmAction(title: string, message: string, onConfirm: ()=>void, cancelLabel = 'Cancel'){
  if(Platform.OS === 'web'){
    const w = globalThis as any
    // No window.confirm (sandboxed iframe): run the action rather than dead-end the user.
    if(typeof w.confirm !== 'function'){ onConfirm(); return }
    if(w.confirm(`${title}\n\n${message}`)) onConfirm()
    return
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: title, style: 'destructive', onPress: onConfirm },
  ])
}

/* ------------------------------ Avatar ---------------------------- */
const PALETTE = [
  { bg: '#EEF2FF', text: '#6366F1' },
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#FEE2E2', text: '#EF4444' },
  { bg: '#DCFCE7', text: '#16A34A' },
  { bg: '#FDF2F8', text: '#DB2777' },
  { bg: '#F0F9FF', text: '#0284C7' },
]

export function getAvatarColor(name = ''){
  return PALETTE[(name.charCodeAt(0) || 0) % PALETTE.length]
}

export function Avatar({ name = '', size = 44, radius = RADIUS.md }){
  const initials = name
    .split(' ')
    .map((w)=> w[0] || '')
    .join('')
    .substring(0, 2)
    .toUpperCase()
  const { bg, text } = getAvatarColor(name)
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: radius, backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { color: text, fontSize: size * 0.34 }]}>{initials || '?'}</Text>
    </View>
  )
}

/* --------------------------- Screen header ------------------------ *
 * Replaces the native stack header on the new screens (they register with
 * headerShown: false), matching Collectionapp's components/ScreenHeader.jsx.
 * ------------------------------------------------------------------ */
export function ScreenHeader({
  title,
  subtitle,
  onSave,
  saving = false,
  saveLabel,
  onDelete,
  showDelete = false,
}: {
  title: string
  subtitle?: string
  onSave?: ()=>void
  saving?: boolean
  saveLabel?: string
  onDelete?: ()=>void
  showDelete?: boolean
}){
  const navigation = useNavigation()
  const { t } = useI18n()
  // No useSafeAreaInsets here: this project mounts no SafeAreaProvider, and App.tsx already
  // wraps the stack in a SafeAreaView, so the top inset is handled one level above.
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={()=> navigation.goBack()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerMid}>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.actions}>
        {showDelete && onDelete ? (
          <TouchableOpacity style={[styles.pill, styles.pillDanger]} onPress={onDelete} disabled={saving}>
            <Text style={styles.pillDangerText}>{t('common.delete')}</Text>
          </TouchableOpacity>
        ) : null}
        {onSave ? (
          <TouchableOpacity style={[styles.pill, styles.pillPrimary]} onPress={onSave} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.pillPrimaryText}>{saveLabel || t('common.save')}</Text>}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

/* ------------------------------ Layout ---------------------------- */
export function Screen({ children }: { children: React.ReactNode }){
  return <View style={styles.screen}>{children}</View>
}

export function Card({ children, style }: { children: React.ReactNode; style?: any }){
  return <View style={[styles.card, style]}>{children}</View>
}

export function SectionTitle({ children }: { children: React.ReactNode }){
  return <Text style={styles.sectionTitle}>{children}</Text>
}

export function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
  onPress: ()=>void
  danger?: boolean
  badge?: string
}){
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, danger && { backgroundColor: COLORS.dangerBg }]}>
        <Ionicons name={icon} size={19} color={danger ? COLORS.danger : COLORS.primary} />
      </View>
      <View style={styles.rowMid}>
        <Text style={[styles.rowTitle, danger && { color: COLORS.danger }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      {!danger ? <Ionicons name="chevron-forward" size={19} color={COLORS.textMuted} /> : null}
    </TouchableOpacity>
  )
}

export function RowDivider(){
  return <View style={styles.rowDivider} />
}

/* ------------------------------ Inputs ---------------------------- *
 * inputStyle is a plain object (not StyleSheet) so consumers can spread
 * dynamic overrides on top of it: style={[inputStyle, { height: 52 }]}
 * ------------------------------------------------------------------ */
export const inputStyle: any = {
  backgroundColor: COLORS.background,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.md,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 15,
  color: COLORS.textPrimary,
}

export function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}){
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={{ color: COLORS.danger }}> *</Text> : null}
      </Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  )
}

/** Two-option control. Keeps the app dependency-free (no @react-native-picker/picker),
 *  which also means it renders identically on web where Picker is flaky. */
export function RolePicker({ value, onChange }: { value: 'User' | 'Admin'; onChange: (next: 'User' | 'Admin')=>void }){
  const options: Array<'User' | 'Admin'> = ['User', 'Admin']
  return (
    <View style={styles.segment}>
      {options.map((option)=>{
        const active = option === value
        return (
          <TouchableOpacity
            key={option}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
            onPress={()=> onChange(option)}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

/* ------------------------------ Actions --------------------------- */
export function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = 'primary',
}: {
  label: string
  onPress: ()=>void
  loading?: boolean
  variant?: 'primary' | 'danger' | 'ghost'
}){
  const boxStyle = variant === 'danger' ? styles.btnDanger : variant === 'ghost' ? styles.btnGhost : styles.btnPrimary
  const textStyle = variant === 'danger' ? styles.btnDangerText : variant === 'ghost' ? styles.btnGhostText : styles.btnPrimaryText
  return (
    <TouchableOpacity style={[styles.btn, boxStyle]} onPress={onPress} disabled={loading} activeOpacity={0.85}>
      {loading
        ? <ActivityIndicator color={variant === 'ghost' ? COLORS.primary : '#fff'} />
        : <Text style={textStyle}>{label}</Text>}
    </TouchableOpacity>
  )
}

/** Inline banner: unlike Alert on web this is always visible. */
export function Banner({ tone, text }: { tone: 'error' | 'success' | 'info'; text: string }){
  const boxStyle = tone === 'error' ? styles.bannerError : tone === 'success' ? styles.bannerSuccess : styles.bannerInfo
  const textStyle = tone === 'error' ? styles.bannerErrorText : tone === 'success' ? styles.bannerSuccessText : styles.bannerInfoText
  return (
    <View style={[styles.banner, boxStyle]}>
      <Text style={textStyle}>{text}</Text>
    </View>
  )
}

export function EmptyState({ text }: { text: string }){ return <View style={styles.empty}><Text style={styles.emptyText}>{text}</Text></View> }

/* ------------------------------ Styles ---------------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMid: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.sm, minWidth: 62, alignItems: 'center' },
  pillPrimary: { backgroundColor: COLORS.primary },
  pillPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  pillDanger: { backgroundColor: COLORS.dangerBg },
  pillDangerText: { color: COLORS.danger, fontWeight: '700', fontSize: 14 },

  // avatar
  avatar: { justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700' },

  // surfaces
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: SPACING.sm,
  },

  // menu rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowMid: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  rowSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  rowDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md + 36 + 12 },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginRight: 4,
  },

  // forms
  field: { marginBottom: SPACING.md },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  hint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 6 },
  segment: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 3,
  },
  segmentItem: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  segmentItemActive: { backgroundColor: COLORS.primary },
  segmentText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  segmentTextActive: { color: '#fff' },

  // buttons
  btn: { borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnDanger: { backgroundColor: COLORS.dangerBg },
  btnDangerText: { color: COLORS.danger, fontSize: 15, fontWeight: '700' },
  btnGhost: { backgroundColor: COLORS.primaryBg },
  btnGhostText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },

  // banners
  banner: { borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, marginBottom: SPACING.md },
  bannerError: { backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: '#FCA5A5' },
  bannerErrorText: { color: COLORS.dangerText, fontSize: 13, fontWeight: '600' },
  bannerSuccess: { backgroundColor: COLORS.successBg, borderWidth: 1, borderColor: '#86EFAC' },
  bannerSuccessText: { color: COLORS.successText, fontSize: 13, fontWeight: '600' },
  bannerInfo: { backgroundColor: COLORS.infoBg, borderWidth: 1, borderColor: '#BFDBFE' },
  bannerInfoText: { color: COLORS.infoText, fontSize: 13, fontWeight: '600' },

  // empty state
  empty: { padding: SPACING.xl, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
})
