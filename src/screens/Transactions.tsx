import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native'
import { load, addItem } from '../services/storage'
import * as api from '../services/api'
import { Button, Card, Header } from '../components/UI'
import { theme } from '../theme'

export default function Transactions(){
  const [list, setList] = useState<any[]>([])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(()=>{ refresh() }, [])
  async function refresh(){
    try{ setList(await api.getTransactions()) }
    catch(e){ setList(await load('transactions', [])) }
  }

  async function handleAdd(){
    if(!item) return
    const tx = { item, amount: Number(amount||0), date: new Date().toISOString().slice(0,10), type:'sale' }
    try{ await api.createTransaction(tx) }
    catch(e){ await addItem('transactions', tx) }
    setItem(''); setAmount(''); refresh()
  }

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background}]}>
      <Header title="Transactions" />
      <Card>
        <TextInput placeholder="Item" value={item} onChangeText={setItem} style={styles.input} />
        <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} style={[styles.input,{width:100}]} keyboardType="numeric" />
        <Button onPress={handleAdd}>Add</Button>
      </Card>
      <FlatList data={list} keyExtractor={i=>i.id} renderItem={({item})=> (
        <View style={styles.tx}><Text style={styles.txLeft}>{item.item}</Text><Text style={styles.txRight}>{item.amount}</Text></View>
      )} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  title:{fontSize:22,fontWeight:'700',marginBottom:12,color:theme.colors.text},
  formRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12},
  input:{backgroundColor:theme.colors.surface,padding:10,borderRadius:8,flex:1,marginBottom:8},
  tx:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:theme.colors.surface,borderRadius:8,marginBottom:8},
  txLeft:{fontWeight:'600',color:theme.colors.text},
  txRight:{fontWeight:'700',color:theme.colors.text}
})
