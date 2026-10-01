import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import { load, addItem } from '../services/storage'
import * as api from '../services/api'
import { Button, Card, Header } from '../components/UI'
import { theme } from '../theme'

export default function Customers(){
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(()=>{ refresh() }, [])
  async function refresh(){
    try{ setList(await api.getCustomers()) }
    catch(e){ setList(await load('customers', [])) }
  }

  async function add(){
    if(!name) return
    const c = { name, phone }
    try{ await api.addCustomer(c) }
    catch(e){ await addItem('customers', c) }
    setName(''); setPhone(''); refresh()
  }

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background}] }>
      <Header title="Customers" />
      <Card>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={[styles.input,{width:130}]} keyboardType="phone-pad" />
        <Button onPress={add}>Add</Button>
      </Card>
      <FlatList data={list} keyExtractor={i=>i.id} renderItem={({item})=> (
        <View style={styles.item}><Text>{item.name}</Text><Text style={{color:theme.colors.muted}}>{item.phone}</Text></View>
      )} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  title:{fontSize:22,fontWeight:'700',marginBottom:12,color:theme.colors.text},
  row:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12},
  input:{backgroundColor:theme.colors.surface,padding:10,borderRadius:8,flex:1,marginBottom:8},
  item:{padding:12,backgroundColor:theme.colors.surface,borderRadius:8,marginBottom:8}
})
