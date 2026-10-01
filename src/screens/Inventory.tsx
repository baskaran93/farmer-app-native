import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import { load, addItem } from '../services/storage'
import * as api from '../services/api'
import { Button, Card, Header } from '../components/UI'
import { theme } from '../theme'

export default function Inventory(){
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')

  useEffect(()=>{ refresh() }, [])
  async function refresh(){
    try{ setItems(await api.getInventory()) }
    catch(e){ setItems(await load('inventory', [])) }
  }

  async function add(){
    if(!name) return;
    const itemObj = { name, qty: Number(qty||0) }
    try{ await api.addInventory(itemObj) }
    catch(e){ await addItem('inventory', itemObj) }
    setName(''); setQty(''); refresh()
  }

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background}] }>
      <Header title="Inventory" />
      <Card>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Qty" value={qty} onChangeText={setQty} style={[styles.input,{width:80}]} keyboardType="numeric" />
        <Button onPress={add}>Add</Button>
      </Card>
      <FlatList data={items} keyExtractor={i=>i.id} renderItem={({item})=> (
        <View style={styles.item}><Text>{item.name}</Text><Text style={{fontWeight:'700'}}>{item.qty}</Text></View>
      )} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  title:{fontSize:22,fontWeight:'700',marginBottom:12,color:theme.colors.text},
  row:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12},
  input:{backgroundColor:theme.colors.surface,padding:10,borderRadius:8,flex:1,marginBottom:8},
  item:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:theme.colors.surface,borderRadius:8,marginBottom:8}
})
