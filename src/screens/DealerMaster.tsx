import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet, Alert } from 'react-native'
import { Button, Card, Header } from '../components/UI'
import { theme } from '../theme'
import { addDealer, getDealers, saveDealers } from '../services/masters'

export default function DealerMaster(){
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    try {
      setLoading(true)
      setError('')
      const dealers = await getDealers()
      setList(dealers)
      console.log('Dealers loaded:', dealers.length)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError('Failed to load dealers: ' + msg)
      console.error('getDealers error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const add = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Dealer name is required')
      return
    }

    try {
      const dealer = { name: name.trim(), phone: phone.trim(), address: address.trim(), city: city.trim() }
      const created = await addDealer(dealer)
      console.log('Dealer added:', created.name)
      Alert.alert('Success', 'Dealer added successfully')
      setName(''); setPhone(''); setAddress(''); setCity('')
      await refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      Alert.alert('Error', 'Failed to add dealer: ' + msg)
      console.error('addDealer error:', e)
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Dealer Master" />
      {loading && <Text style={styles.loadingText}>Loading dealers...</Text>}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Card>
        <TextInput placeholder="Dealer name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
        <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
        <Button onPress={add}>Add Dealer</Button>
      </Card>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemText}>{item.phone || 'No phone'}</Text>
            <Text style={styles.itemText}>{item.city || item.address || 'No location'}</Text>
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
