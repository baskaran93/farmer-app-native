import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'
import { useFocusEffect } from '@react-navigation/native'

export default function Settlement(){
  const { salesData, refreshData } = useAuth()

  useFocusEffect(
    React.useCallback(() => {
      refreshData()
    }, [refreshData])
  )

  const totalFirstKg = salesData.sales.reduce((sum, s) => sum + s.firstKg, 0)
  const totalSecondKg = salesData.sales.reduce((sum, s) => sum + s.secondKg, 0)
  const totalKg = totalFirstKg + totalSecondKg
  const totalSales = salesData.sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalAdvances = salesData.advances.reduce((sum, a) => sum + a.amount, 0)
  const balance = totalSales - totalAdvances

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={s.container}>
      <Text style={s.title}>Settlement & Balance</Text>

      {/* Sales Summary */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Sales Summary</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Total 1st Kg</Text>
            <Text style={s.value}>{totalFirstKg.toLocaleString()} kg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.label}>Total 2nd Kg</Text>
            <Text style={s.value}>{totalSecondKg.toLocaleString()} kg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={[s.label, { fontWeight: '700' }]}>Total Quantity</Text>
            <Text style={[s.value, { fontWeight: '700' }]}>{totalKg.toLocaleString()} kg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.label}>Total Sales</Text>
            <Text style={[s.value, { color: '#3b82f6', fontWeight: '700' }]}>₹{totalSales.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Advances */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Advances Received</Text>
        <View style={s.card}>
          {salesData.advances.length === 0 ? (
            <Text style={[s.label, { color: theme.colors.muted, fontStyle: 'italic' }]}>No advances recorded</Text>
          ) : (
            <>
              {salesData.advances.map((advance, index) => (
                <View key={advance.id}>
                  <View style={s.row}>
                    <Text style={s.label}>{advance.description}</Text>
                    <Text style={s.value}>₹{advance.amount.toLocaleString()}</Text>
                  </View>
                  {index < salesData.advances.length - 1 && <View style={s.divider} />}
                </View>
              ))}
              <View style={s.divider} />
              <View style={s.row}>
                <Text style={[s.label, { fontWeight: '700' }]}>Total Advances</Text>
                <Text style={[s.value, { color: '#f59e0b', fontWeight: '700' }]}>₹{totalAdvances.toLocaleString()}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Balance Calculation */}
      <View style={[s.section, { marginBottom: 0 }]}>
        <Text style={s.sectionTitle}>Balance Calculation</Text>
        <View style={[s.card, s.balanceCard]}>
          <View style={s.balanceRow}>
            <Text style={s.balanceLabel}>Total Sales</Text>
            <Text style={[s.balanceValue, { color: '#3b82f6' }]}>₹{totalSales.toLocaleString()}</Text>
          </View>
          <Text style={s.operator}>−</Text>
          <View style={s.balanceRow}>
            <Text style={s.balanceLabel}>Total Advances</Text>
            <Text style={[s.balanceValue, { color: '#f59e0b' }]}>₹{totalAdvances.toLocaleString()}</Text>
          </View>
          <View style={s.balanceDivider} />
          <View style={s.balanceRow}>
            <Text style={s.balanceLabelFinal}>Balance Receivable</Text>
            <Text style={[s.balanceValueFinal, { color: balance >= 0 ? '#10b981' : '#ef4444' }]}>
              ₹{balance.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 24 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, elevation: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: 14, color: theme.colors.muted, fontWeight: '500' },
  value: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  
  divider: { height: 1, backgroundColor: '#e5e7eb' },
  
  balanceCard: { backgroundColor: '#f0f9ff', borderWidth: 2, borderColor: '#3b82f6' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  balanceLabel: { fontSize: 16, color: '#1e40af', fontWeight: '600' },
  balanceValue: { fontSize: 18, fontWeight: '700' },
  
  balanceLabelFinal: { fontSize: 18, color: '#1e40af', fontWeight: '700' },
  balanceValueFinal: { fontSize: 24, fontWeight: '700' },
  
  operator: { textAlign: 'center', fontSize: 20, color: '#6b7280', fontWeight: '700', marginVertical: 4 },
  balanceDivider: { height: 2, backgroundColor: '#3b82f6', marginVertical: 8 }
})
