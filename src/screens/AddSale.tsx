import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'
import { useNavigation } from '@react-navigation/native'
import { getDealers, getItems } from '../services/masters'

export default function AddSale(){
  const { addSale } = useAuth()
  const navigation = useNavigation()
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [rate, setRate] = useState('')
  const [qty, setQty] = useState('')
  const [dealers, setDealers] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [selectedDealerId, setSelectedDealerId] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')

  useEffect(() => {
    ;(async () => {
      const [dealerList, itemList] = await Promise.all([getDealers(), getItems()])
      setDealers(dealerList)
      setItems(itemList)
      if (dealerList[0]) setSelectedDealerId(dealerList[0].id)
      if (itemList[0]) setSelectedItemId(itemList[0].id)
    })()
  }, [])

  const selectedDealer = dealers.find(d => d.id === selectedDealerId)
  const selectedItem = items.find(i => i.id === selectedItemId)
  const totalAmount = (Number(qty) || 0) * (Number(rate) || 0)

  const handleSave = async () => {
    if (!date || !rate || !qty || !selectedDealerId || !selectedItemId) {
      Alert.alert('Required Fields', 'Please fill in the date, rate, quantity, dealer and item')
      return
    }

    try {
      await addSale({
        date,
        rate: Number(rate),
        firstKg: Number(qty),
        secondKg: 0,
        firstAmount: totalAmount,
        secondRate: Number(rate),
        secondAmount: 0,
        totalAmount,
        dealerId: selectedDealerId,
        dealerName: selectedDealer?.name || 'Dealer',
        itemId: selectedItemId,
        itemName: selectedItem?.name || 'Item'
      } as any)
      Alert.alert('Success', 'Sale added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } catch (error) {
      Alert.alert('Error', 'Failed to add sale')
    }
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={s.container}>
      <Text style={s.title}>Add Daily Sale</Text>

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
        <Text style={s.label}>Dealer</Text>
        <View style={s.optionGroup}>
          {dealers.length === 0 ? (
            <Text style={s.emptyText}>No dealers added yet.</Text>
          ) : dealers.map((dealer) => (
            <TouchableOpacity
              key={dealer.id}
              style={[s.optionButton, selectedDealerId === dealer.id && s.optionButtonActive]}
              onPress={() => setSelectedDealerId(dealer.id)}
            >
              <Text style={[s.optionText, selectedDealerId === dealer.id && s.optionTextActive]}>{dealer.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.label}>Vegetable / Item</Text>
        <View style={s.optionGroup}>
          {items.length === 0 ? (
            <Text style={s.emptyText}>No items added yet.</Text>
          ) : items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[s.optionButton, selectedItemId === item.id && s.optionButtonActive]}
              onPress={() => setSelectedItemId(item.id)}
            >
              <Text style={[s.optionText, selectedItemId === item.id && s.optionTextActive]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.label}>Rate per Kg (₹)</Text>
        <TextInput 
          style={s.input}
          placeholder="Enter rate"
          value={rate}
          onChangeText={setRate}
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.muted}
        />
      </View>

      <View style={s.section}>
        <Text style={s.label}>Quantity (Kg)</Text>
        <TextInput 
          style={s.input}
          placeholder="0"
          value={qty}
          onChangeText={setQty}
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.muted}
        />
      </View>

      <View style={s.divider} />

      <View style={s.calculationSection}>
        <View style={s.calcRow}>
          <Text style={s.calcLabel}>Item</Text>
          <Text style={s.calcValue}>{selectedItem?.name || 'Select item'}</Text>
        </View>
        <View style={s.calcRow}>
          <Text style={s.calcLabel}>Dealer</Text>
          <Text style={s.calcValue}>{selectedDealer?.name || 'Select dealer'}</Text>
        </View>
        <View style={s.calcRow}>
          <Text style={s.calcLabel}>Total Amount</Text>
          <Text style={s.calcValue}>₹{totalAmount.toLocaleString()}</Text>
        </View>
        <View style={[s.calcRow, s.totalRow]}>
          <Text style={s.totalLabel}>Net Total</Text>
          <Text style={s.totalValue}>₹{totalAmount.toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={s.saveButton}
        onPress={handleSave}
      >
        <Text style={s.saveButtonText}>Save Sale</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={s.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={s.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text, marginBottom: 24 },
  section: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
  input: { 
    backgroundColor: theme.colors.surface, 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    fontSize: 14, 
    color: theme.colors.text 
  },
  optionGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  optionButtonActive: { backgroundColor: '#dbeafe', borderColor: '#60a5fa' },
  optionText: { color: theme.colors.text, fontSize: 12 },
  optionTextActive: { color: '#1d4ed8', fontWeight: '700' },
  emptyText: { color: theme.colors.muted, fontSize: 12 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 16 },
  calculationSection: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 10, marginBottom: 20 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  calcLabel: { fontSize: 14, color: theme.colors.muted },
  calcValue: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  totalRow: { borderBottomWidth: 0, paddingTop: 12, borderTopWidth: 2, borderTopColor: '#3b82f6' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#3b82f6' },
  saveButton: { backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { backgroundColor: theme.colors.surface, paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  cancelButtonText: { color: theme.colors.muted, fontSize: 16, fontWeight: '600' }
})
