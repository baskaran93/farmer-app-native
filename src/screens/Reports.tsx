import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'
import { useFocusEffect } from '@react-navigation/native'

export default function Reports(){
  const { salesData, refreshData } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all')

  useFocusEffect(
    React.useCallback(() => {
      refreshData()
    }, [refreshData])
  )

  const getFilteredSales = () => {
    const now = new Date()
    let startDate = new Date(0)

    if (selectedPeriod === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (selectedPeriod === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    return salesData.sales.filter(s => new Date(s.date) >= startDate)
  }

  const filteredSales = getFilteredSales()
  const totalFirstKg = filteredSales.reduce((sum, s) => sum + s.firstKg, 0)
  const totalSecondKg = filteredSales.reduce((sum, s) => sum + s.secondKg, 0)
  const totalKg = totalFirstKg + totalSecondKg
  const totalSales = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0)
  const avgRate = filteredSales.length > 0 
    ? (filteredSales.reduce((sum, s) => sum + s.rate, 0) / filteredSales.length).toFixed(0)
    : 0
  const daysWithSales = new Set(filteredSales.map(s => s.date)).size

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={s.container}>
      <Text style={s.title}>Reports & Analytics</Text>

      {/* Period Selector */}
      <View style={s.periodSelector}>
        <TouchableOpacity 
          style={[s.periodButton, selectedPeriod === 'all' && s.periodButtonActive]}
          onPress={() => setSelectedPeriod('all')}
        >
          <Text style={[s.periodButtonText, selectedPeriod === 'all' && s.periodButtonTextActive]}>All Time</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[s.periodButton, selectedPeriod === 'month' && s.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[s.periodButtonText, selectedPeriod === 'month' && s.periodButtonTextActive]}>This Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[s.periodButton, selectedPeriod === 'week' && s.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[s.periodButtonText, selectedPeriod === 'week' && s.periodButtonTextActive]}>This Week</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={s.summaryGrid}>
        <View style={[s.card, s.cardPrimary]}>
          <Text style={s.cardLabel}>Total Sales</Text>
          <Text style={s.cardValue}>₹{totalSales.toLocaleString()}</Text>
        </View>
        <View style={[s.card, s.cardSecondary]}>
          <Text style={s.cardLabel}>Total Kg</Text>
          <Text style={s.cardValue}>{totalKg.toLocaleString()}</Text>
        </View>
      </View>

      <View style={s.summaryGrid}>
        <View style={[s.card, s.cardInfo]}>
          <Text style={s.cardLabel}>Avg Rate</Text>
          <Text style={s.cardValue}>₹{avgRate}</Text>
        </View>
        <View style={[s.card, s.cardSuccess]}>
          <Text style={s.cardLabel}>Entries</Text>
          <Text style={s.cardValue}>{filteredSales.length}</Text>
        </View>
      </View>

      {/* Detailed Breakdown */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Quantity Breakdown</Text>
        <View style={s.detailCard}>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>1st Quality Kg</Text>
            <Text style={s.detailValue}>{totalFirstKg.toLocaleString()} kg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>2nd Quality Kg</Text>
            <Text style={s.detailValue}>{totalSecondKg.toLocaleString()} kg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.detailRow}>
            <Text style={[s.detailLabel, { fontWeight: '700' }]}>Total Kg</Text>
            <Text style={[s.detailValue, { fontWeight: '700' }]}>{totalKg.toLocaleString()} kg</Text>
          </View>
        </View>
      </View>

      {/* Additional Stats */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Additional Stats</Text>
        <View style={s.detailCard}>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Days with Sales</Text>
            <Text style={s.detailValue}>{daysWithSales}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Total Entries</Text>
            <Text style={s.detailValue}>{filteredSales.length}</Text>
          </View>
          {filteredSales.length > 0 && (
            <>
              <View style={s.divider} />
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Avg/Day</Text>
                <Text style={s.detailValue}>₹{(totalSales / daysWithSales).toLocaleString()}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Top Entries */}
      {filteredSales.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Top 5 Sales</Text>
          <View style={s.detailCard}>
            {filteredSales
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .slice(0, 5)
              .map((sale, index) => (
                <View key={sale.id}>
                  <View style={s.topRow}>
                    <View>
                      <Text style={s.topDate}>{sale.date}</Text>
                      <Text style={s.topDetail}>{sale.firstKg} + {sale.secondKg} kg @ ₹{sale.rate}</Text>
                    </View>
                    <Text style={s.topAmount}>₹{sale.totalAmount.toLocaleString()}</Text>
                  </View>
                  {index < Math.min(4, filteredSales.length - 1) && <View style={s.divider} />}
                </View>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 20 },
  
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodButton: { flex: 1, paddingVertical: 10, borderRadius: 6, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  periodButtonActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  periodButtonText: { fontSize: 12, fontWeight: '500', color: theme.colors.muted },
  periodButtonTextActive: { color: '#fff' },
  
  summaryGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  card: { flex: 1, padding: 16, borderRadius: 12, elevation: 2 },
  cardPrimary: { backgroundColor: '#3b82f6' },
  cardSecondary: { backgroundColor: '#f59e0b' },
  cardSuccess: { backgroundColor: '#10b981' },
  cardInfo: { backgroundColor: '#8b5cf6' },
  cardLabel: { fontSize: 12, fontWeight: '500', color: '#fff', opacity: 0.9, marginBottom: 8 },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
  
  detailCard: { backgroundColor: theme.colors.surface, borderRadius: 10, padding: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  detailLabel: { fontSize: 14, color: theme.colors.muted, fontWeight: '500' },
  detailValue: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  
  topRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  topDate: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  topDetail: { fontSize: 12, color: theme.colors.muted, marginTop: 4 },
  topAmount: { fontSize: 16, fontWeight: '700', color: '#3b82f6' },
  
  divider: { height: 1, backgroundColor: '#f3f4f6' }
})
