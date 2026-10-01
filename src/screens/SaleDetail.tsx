import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function SaleDetail(){
  const { salesData, deleteSale, updateSale } = useAuth()
  const navigation = useNavigation()
  const route = useRoute()
  const saleId = (route.params as any)?.saleId

  const sale = salesData.sales.find(s => s.id === saleId)

  if (!sale) {
    return (
      <View style={s.container}>
        <Text style={s.title}>Sale not found</Text>
      </View>
    )
  }

  const handleDelete = () => {
    Alert.alert('Delete Sale', `Are you sure you want to delete the sale from ${sale.date}?`, [
      { text: 'Cancel' },
      { 
        text: 'Delete', 
        onPress: () => {
          deleteSale(saleId)
          navigation.goBack()
        },
        style: 'destructive'
      }
    ])
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={s.container}>
      <Text style={s.date}>{sale.date}</Text>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Sale Details</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Rate per Kg</Text>
            <Text style={s.value}>₹{sale.rate}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.label}>1st Quality</Text>
            <Text style={s.value}>{sale.firstKg} kg × ₹{sale.rate}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.label}>1st Amount</Text>
            <Text style={[s.value, { color: '#3b82f6' }]}>₹{sale.firstAmount.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>2nd Quality (50% Rate)</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>2nd Quality</Text>
            <Text style={s.value}>{sale.secondKg} kg × ₹{sale.secondRate.toFixed(0)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.label}>2nd Rate</Text>
            <Text style={s.value}>₹{sale.secondRate.toFixed(0)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.label}>2nd Amount</Text>
            <Text style={[s.value, { color: '#f59e0b' }]}>₹{sale.secondAmount.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Total</Text>
        <View style={[s.card, s.totalCard]}>
          <View style={s.row}>
            <Text style={s.totalLabel}>Total Quantity</Text>
            <Text style={s.totalValue}>{sale.firstKg + sale.secondKg} kg</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.totalLabel}>Total Amount</Text>
            <Text style={[s.totalValue, { color: '#10b981' }]}>₹{sale.totalAmount.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={s.buttonGroup}>
        <TouchableOpacity 
          style={[s.button, s.buttonPrimary]}
          onPress={() => navigation.navigate('AddSale' as never)}
        >
          <Text style={s.buttonText}>Edit Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[s.button, s.buttonDanger]}
          onPress={handleDelete}
        >
          <Text style={s.buttonText}>Delete Sale</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 24 },

  date: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 24 },
  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: 10, padding: 16 },
  totalCard: { backgroundColor: '#f0fdf4', borderWidth: 2, borderColor: '#10b981' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  label: { fontSize: 14, color: theme.colors.muted, fontWeight: '500' },
  value: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  
  totalLabel: { fontSize: 16, color: '#15803d', fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  
  divider: { height: 1, backgroundColor: '#e5e7eb' },
  
  buttonGroup: { flexDirection: 'row', gap: 12, marginTop: 24 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#3b82f6' },
  buttonDanger: { backgroundColor: '#ef4444' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' }
})
