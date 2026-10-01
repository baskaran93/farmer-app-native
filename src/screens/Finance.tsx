import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { load } from '../services/storage'
import { Card, Header } from '../components/UI'
import { theme } from '../theme'

export default function Finance(){
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)

  useEffect(()=>{ ;(async ()=>{
    const tx = await load<any[]>('transactions', [])
    const inc = tx.filter(t=>t.type==='sale').reduce((s,t)=>s+(Number(t.amount)||0),0)
    const exp = tx.filter(t=>t.type!=='sale').reduce((s,t)=>s+(Number(t.amount)||0),0)
    setIncome(inc); setExpenses(exp)
  })() }, [])

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background}] }>
      <Header title="Finance" />
      <Card><Text style={styles.label}>Income</Text><Text style={styles.value}>{income}</Text></Card>
      <Card><Text style={styles.label}>Expenses</Text><Text style={styles.value}>{expenses}</Text></Card>
      <Card><Text style={styles.label}>Profit</Text><Text style={styles.value}>{income-expenses}</Text></Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  title:{fontSize:22,fontWeight:'700',marginBottom:12,color:theme.colors.text},
  card:{backgroundColor:theme.colors.surface,padding:12,borderRadius:10,marginBottom:10},
  label:{color:theme.colors.muted},
  value:{fontSize:18,fontWeight:'700',marginTop:6,color:theme.colors.text}
})
