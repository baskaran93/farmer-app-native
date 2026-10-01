import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

export default function Advances(){
  const { salesData, refreshData, addAdvance, deleteAdvance } = useAuth()
  const navigation = useNavigation()
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('Advance')

  useFocusEffect(
    React.useCallback(() => {
      refreshData()
    }, [refreshData])
  )

  const totalAdvances = salesData.advances.reduce((sum, a) => sum + a.amount, 0)
  const totalSales = salesData.sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const balance = totalSales - totalAdvances

  const handleAddAdvance = async () => {
    if (!date || !amount) {
      Alert.alert('Required Fields', 'Please fill in date and amount')
      return
    }

    try {
      await addAdvance({
        date,
        amount: Number(amount),
        description: description || 'Advance'
      })
      setDate(new Date().toISOString().split('T')[0])
      setAmount('')
      setDescription('Advance')
      setShowForm(false)
      Alert.alert('Success', 'Advance added')
    } catch (error) {
      Alert.alert('Error', 'Failed to add advance')
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert('Delete Advance', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => deleteAdvance(id), style: 'destructive' }
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Summary Card */}
      <View style={s.summaryContainer}>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Total Advances</Text>
          <Text style={s.summaryValue}>₹{totalAdvances.toLocaleString()}</Text>
        </View>
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Balance</Text>
          <Text style={[s.summaryValue, { color: balance >= 0 ? '#10b981' : '#ef4444' }]}>
            ₹{balance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Form Section */}
      {showForm && (
        <View style={s.formContainer}>
          <Text style={s.formTitle}>Add Advance</Text>
          
          <View style={s.section}>
            <Text style={s.label}>Date</Text>
            <TextInput 
              style={s.input}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={theme.colors.muted}
            />
          </View>

          <View style={s.section}>
            <Text style={s.label}>Amount (₹)</Text>
            <TextInput 
              style={s.input}
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.muted}
            />
          </View>

          <View style={s.section}>
            <Text style={s.label}>Description</Text>
            <TextInput 
              style={s.input}
              placeholder="e.g., Advance 1"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={theme.colors.muted}
            />
          </View>

          <View style={s.buttonGroup}>
            <TouchableOpacity style={[s.button, s.buttonPrimary]} onPress={handleAddAdvance}>
              <Text style={s.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.button, s.buttonSecondary]} onPress={() => setShowForm(false)}>
              <Text style={s.buttonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List Section */}
      {salesData.advances.length === 0 ? (
        <View style={s.emptyContainer}>
          <Text style={s.emptyText}>No advances recorded</Text>
        </View>
      ) : (
        <FlatList
          data={salesData.advances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContainer}
          renderItem={({ item }) => (
            <View style={s.advanceRow}>
              <View style={s.advanceInfo}>
                <Text style={s.advanceDate}>{item.date}</Text>
                <Text style={s.advanceDescription}>{item.description}</Text>
              </View>
              <View style={s.advanceActions}>
                <Text style={s.advanceAmount}>₹{item.amount.toLocaleString()}</Text>
                <TouchableOpacity 
                  onPress={() => handleDelete(item.id)}
                  style={s.deleteButton}
                >
                  <Text style={s.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {!showForm && (
        <TouchableOpacity 
          style={s.fab}
          onPress={() => setShowForm(true)}
        >
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  summaryContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  summaryCard: { flex: 1, backgroundColor: theme.colors.surface, padding: 16, borderRadius: 10, alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: theme.colors.muted, marginBottom: 8 },
  summaryValue: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  
  formContainer: { padding: 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  formTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 16 },
  
  section: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: theme.colors.text, marginBottom: 6 },
  input: { 
    backgroundColor: theme.colors.background, 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 6, 
    paddingHorizontal: 10, 
    paddingVertical: 10, 
    fontSize: 14, 
    color: theme.colors.text 
  },
  
  buttonGroup: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#3b82f6' },
  buttonSecondary: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: '#e5e7eb' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buttonSecondaryText: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  
  listContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  advanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, marginBottom: 8, borderRadius: 8 },
  advanceInfo: { flex: 1 },
  advanceDate: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  advanceDescription: { fontSize: 12, color: theme.colors.muted, marginTop: 4 },
  
  advanceActions: { alignItems: 'flex-end', gap: 8 },
  advanceAmount: { fontSize: 16, fontWeight: '700', color: '#f59e0b' },
  deleteButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#fecaca', borderRadius: 4 },
  deleteButtonText: { fontSize: 11, color: '#dc2626', fontWeight: '500' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: theme.colors.muted },
  
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText: { fontSize: 28, color: '#fff', fontWeight: '700' }
})
