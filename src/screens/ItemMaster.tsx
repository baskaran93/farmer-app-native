import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet, Alert } from 'react-native'
import { Button, Card, Header } from '../components/UI'
import { theme } from '../theme'
import { addItemMaster, getItems, saveItems } from '../services/masters'

export default function ItemMaster(){
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('kg')
  const [rate, setRate] = useState('')
  const [category, setCategory] = useState('Vegetable')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    try {
      setLoading(true)
      setError('')
      const items = await getItems()
      setList(items)
      console.log('Items loaded:', items.length)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError('Failed to load items: ' + msg)
      console.error('getItems error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const add = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Item name is required')
      return
    }

    try {
      const item = {
        name: name.trim(),
        unit: unit.trim() || 'kg',
        rate: Number(rate || 0),
        category: category.trim() || 'Vegetable',
      }

      const created = await addItemMaster(item)
      console.log('Item added:', created.name)
      Alert.alert('Success', 'Item added successfully')
      setName(''); setUnit('kg'); setRate(''); setCategory('Vegetable')
      await refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      Alert.alert('Error', 'Failed to add item: ' + msg)
      console.error('addItemMaster error:', e)
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Item Master" />
      {loading && <Text style={styles.loadingText}>Loading items...</Text>}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Card>
        <TextInput placeholder="Vegetable name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Unit (kg, box, bundle)" value={unit} onChangeText={setUnit} style={styles.input} />
        <TextInput placeholder="Rate" value={rate} onChangeText={setRate} keyboardType="decimal-pad" style={styles.input} />
        <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
        <Button onPress={add}>Add Item</Button>
      </Card>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemText}>{item.category || 'Vegetable'} • {item.unit || 'kg'}</Text>
            <Text style={styles.itemText}>Rate: ₹{Number(item.rate || 0).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  input: { backgroundColor: theme.colors.surface, padding: 10, borderRadius: 8, marginBottom: 8 },
  item: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, marginBottom: 8 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  itemText: { fontSize: 12, color: theme.colors.muted, marginTop: 3 },
  loadingText: { fontSize: 14, color: theme.colors.muted, textAlign: 'center', marginVertical: 12 },
  errorText: { fontSize: 12, color: '#dc2626', backgroundColor: '#fee2e2', padding: 10, borderRadius: 6, marginBottom: 12 },
})
