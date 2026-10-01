import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { theme, COLORS } from '../theme'
import { confirmAction } from '../components/CollectionUI'
import { useI18n } from '../i18n'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

export default function Dashboard(){
  const { salesData, refreshData, logout } = useAuth()
  const navigation = useNavigation()
  const { t } = useI18n()

  const onLogout = () => confirmAction(t('settings.logout'), t('settings.logoutBody'), () => logout(), t('common.cancel'))

  useFocusEffect(
    React.useCallback(() => {
      refreshData()
    }, [refreshData])
  )

  const totalSales = salesData.sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalAdvances = salesData.advances.reduce((sum, a) => sum + a.amount, 0)
  const balance = totalSales - totalAdvances
  
  const totalFirstKg = salesData.sales.reduce((sum, s) => sum + s.firstKg, 0)
  const totalSecondKg = salesData.sales.reduce((sum, s) => sum + s.secondKg, 0)
  const totalKg = totalFirstKg + totalSecondKg

  const todayString = new Date().toISOString().split('T')[0]
  const todaySales = salesData.sales.filter(s => s.date === todayString)
  const todayTotal = todaySales.reduce((sum, s) => sum + s.totalAmount, 0)

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={s.container}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <View style={s.headerTitles}>
            <Text style={s.title}>{t('dashboard.title')}</Text>
            <Text style={s.subtitle}>{t('dashboard.subtitle')}</Text>
          </View>
          {/* Menu / Settings / Logout -- the Collectionapp dashboard header pattern */}
          <View style={s.headerActions}>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => navigation.navigate('Menu' as never)}
              accessibilityRole="button"
              accessibilityLabel={t('dashboard.a11yMenu')}
            >
              <Ionicons name="grid-outline" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => navigation.navigate('Settings' as never)}
              accessibilityRole="button"
              accessibilityLabel={t('dashboard.a11ySettings')}
            >
              <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.iconBtn, s.iconBtnDanger]}
              onPress={onLogout}
              accessibilityRole="button"
              accessibilityLabel={t('dashboard.a11yLogout')}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={s.summaryGrid}>
        <View style={[s.card, s.cardPrimary]}>
          <Text style={s.cardLabel}>{t('dashboard.totalSales')}</Text>
          <Text style={s.cardValue}>₹{totalSales.toLocaleString()}</Text>
        </View>
        <View style={[s.card, s.cardSecondary]}>
          <Text style={s.cardLabel}>{t('dashboard.totalAdvances')}</Text>
          <Text style={s.cardValue}>₹{totalAdvances.toLocaleString()}</Text>
        </View>
      </View>

      <View style={s.summaryGrid}>
        <View style={[s.card, s.cardSuccess]}>
          <Text style={s.cardLabel}>{t('dashboard.balanceReceivable')}</Text>
          <Text style={[s.cardValue, { color: balance >= 0 ? '#10b981' : '#ef4444' }]}>
            ₹{balance.toLocaleString()}
          </Text>
        </View>
        <View style={[s.card, s.cardInfo]}>
          <Text style={s.cardLabel}>{t('common.totalKg')}</Text>
          <Text style={s.cardValue}>{totalKg.toLocaleString()}</Text>
        </View>
      </View>

      {/* Today's Sales */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('dashboard.todaysSales')}</Text>
        {todaySales.length > 0 ? (
          <View style={s.todayCard}>
            <View style={s.todayRow}>
              <Text style={s.todayLabel}>{t('common.entries')}</Text>
              <Text style={s.todayValue}>{todaySales.length}</Text>
            </View>
            <View style={s.todayRow}>
              <Text style={s.todayLabel}>{t('common.totalAmount')}</Text>
              <Text style={s.todayValue}>₹{todayTotal.toLocaleString()}</Text>
            </View>
          </View>
        ) : (
          <Text style={s.emptyText}>{t('dashboard.emptyToday')}</Text>
        )}
      </View>

      {/* Quantity Summary */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('dashboard.quantitySummary')}</Text>
        <View style={s.quantityCard}>
          <View style={s.quantityRow}>
            <Text style={s.quantityLabel}>{t('common.firstQualityKg')}</Text>
            <Text style={s.quantityValue}>{totalFirstKg.toLocaleString()}</Text>
          </View>
          <View style={s.quantityRow}>
            <Text style={s.quantityLabel}>{t('common.secondQualityKg')}</Text>
            <Text style={s.quantityValue}>{totalSecondKg.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={s.buttonsContainer}>
        <TouchableOpacity 
          style={[s.button, s.buttonPrimary]}
          onPress={() => navigation.navigate('AddSale' as never)}
        >
          <Text style={s.buttonText}>+ Add Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[s.button, s.buttonSecondary]}
          onPress={() => navigation.navigate('Advances' as never)}
        >
          <Text style={s.buttonText}>+ Add Advance</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Links */}
      <View style={s.linksContainer}>
        <TouchableOpacity 
          style={s.link}
          onPress={() => navigation.navigate('Sales' as never)}
        >
          <Text style={s.linkText}>📊 View All Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={s.link}
          onPress={() => navigation.navigate('Settlement' as never)}
        >
          <Text style={s.linkText}>⚖️ Settlement</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={s.link}
          onPress={() => navigation.navigate('Reports' as never)}
        >
          <Text style={s.linkText}>📈 Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerTitles: { flex: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDanger: { borderWidth: 1, borderColor: COLORS.dangerBg, backgroundColor: COLORS.dangerBg },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: theme.colors.muted },
  
  summaryGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  card: { flex: 1, padding: 16, borderRadius: 12, elevation: 2 },
  cardPrimary: { backgroundColor: COLORS.primary },
  cardSecondary: { backgroundColor: COLORS.warning },
  cardSuccess: { backgroundColor: COLORS.success },
  cardInfo: { backgroundColor: COLORS.info },
  cardLabel: { fontSize: 12, fontWeight: '500', color: '#fff', opacity: 0.9, marginBottom: 8 },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
  
  todayCard: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 10 },
  todayRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  todayLabel: { fontSize: 14, color: theme.colors.muted },
  todayValue: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  
  quantityCard: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 10 },
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  quantityLabel: { fontSize: 14, color: theme.colors.muted },
  quantityValue: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  
  emptyText: { color: theme.colors.muted, fontSize: 14, fontStyle: 'italic' },
  
  buttonsContainer: { gap: 12, marginBottom: 20 },
  button: { padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonPrimary: { backgroundColor: COLORS.primary },
  buttonSecondary: { backgroundColor: COLORS.success },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  linksContainer: { gap: 10 },
  link: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8 },
  linkText: { fontSize: 15, color: theme.colors.text, fontWeight: '500' }
})
