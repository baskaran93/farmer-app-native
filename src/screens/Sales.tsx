import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

export default function Sales(){
  const { salesData, refreshData, deleteSale } = useAuth()
  const navigation = useNavigation()
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')

  useFocusEffect(
    React.useCallback(() => {
      refreshData()
    }, [refreshData])
  )

  const sortedSales = [...salesData.sales].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return b.totalAmount - a.totalAmount
    }
  })

  const handleDelete = (id: string, date: string) => {
    Alert.alert('Delete Sale', `Are you sure you want to delete the sale from ${date}?`, [
      { text: 'Cancel', onPress: () => {} },
      { 
        text: 'Delete', 
        onPress: () => deleteSale(id),
        style: 'destructive'
      }
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={s.header}>
        <Text style={s.title}>All Sales</Text>
        <Text style={s.count}>{salesData.sales.length} entries</Text>
      </View>

      <View style={s.sortContainer}>
        <TouchableOpacity 
          style={[s.sortButton, sortBy === 'date' && s.sortButtonActive]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[s.sortButtonText, sortBy === 'date' && s.sortButtonTextActive]}>By Date</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[s.sortButton, sortBy === 'amount' && s.sortButtonActive]}
          onPress={() => setSortBy('amount')}
        >
          <Text style={[s.sortButtonText, sortBy === 'amount' && s.sortButtonTextActive]}>By Amount</Text>
        </TouchableOpacity>
      </View>

      {salesData.sales.length === 0 ? (
        <View style={s.emptyContainer}>
          <Text style={s.emptyText}>No sales recorded yet</Text>
          <TouchableOpacity 
            style={s.addButton}
            onPress={() => navigation.navigate('AddSale' as never)}
          >
            <Text style={s.addButtonText}>Add First Sale</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedSales}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={s.saleRow}
              onPress={() => navigation.navigate('SaleDetail' as never, { saleId: item.id } as never)}
            >
              <View style={s.saleInfo}>
                <Text style={s.saleDate}>{item.date}</Text>
                <View style={s.saleDetailsRow}>
                  <Text style={s.saleDetail}>
                    {item.firstKg} + {item.secondKg} kg • ₹{item.rate}
                  </Text>
                </View>
              </View>
              <View style={s.saleActions}>
                <Text style={s.saleAmount}>₹{item.totalAmount.toLocaleString()}</Text>
                <TouchableOpacity 
                  onPress={() => handleDelete(item.id, item.date)}
                  style={s.deleteButton}
                >
                  <Text style={s.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity 
        style={s.fab}
        onPress={() => navigation.navigate('AddSale' as never)}
      >
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  count: { fontSize: 12, color: theme.colors.muted, marginTop: 4 },
  
  sortContainer: { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 8 },
  sortButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: '#e5e7eb' },
  sortButtonActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  sortButtonText: { fontSize: 12, fontWeight: '500', color: theme.colors.muted },
  sortButtonTextActive: { color: '#fff' },
  
  listContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  saleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, marginBottom: 8, borderRadius: 8 },
  saleInfo: { flex: 1 },
  saleDate: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
  saleDetailsRow: { flexDirection: 'row', gap: 8 },
  saleDetail: { fontSize: 12, color: theme.colors.muted },
  
  saleActions: { alignItems: 'flex-end', gap: 8 },
  saleAmount: { fontSize: 16, fontWeight: '700', color: '#3b82f6' },
  deleteButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#fecaca', borderRadius: 4 },
  deleteButtonText: { fontSize: 11, color: '#dc2626', fontWeight: '500' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: theme.colors.muted, marginBottom: 16 },
  addButton: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#3b82f6', borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText: { fontSize: 28, color: '#fff', fontWeight: '700' }
})
