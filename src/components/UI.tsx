import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Alert, Platform } from 'react-native'
import { theme } from '../theme'
import { useAuth } from '../context/AuthContext'
import { useOptionalI18n } from '../i18n'

export function Button({ children, onPress }: { children: React.ReactNode; onPress?: ()=>void }){
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{children}</Text>
    </TouchableOpacity>
  )
}

export function Card({ children }: { children: React.ReactNode }){
  return <View style={styles.card}>{children}</View>
}

export function Header({ title }: { title: string }){
  const auth = (()=>{ try{ return useAuth() }catch{ return null } })()
  const { t } = useOptionalI18n()
  const confirmLogout = ()=>{
    if(!auth) return
    if(Platform.OS === 'web'){
      // Alert.alert() is an empty stub in react-native-web, so the dialog would never
      // appear and the Logout button would look broken. Use the browser confirm instead.
      const w = globalThis as any
      if(typeof w.confirm === 'function'){
        if(w.confirm(t('settings.logoutBody'))) void auth.logout()
      } else {
        void auth.logout()
      }
      return
    }
    Alert.alert(t('settings.logout'), t('settings.logoutBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.logout'), style: 'destructive', onPress: ()=> auth.logout() }
    ])
  }
  return (
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>{title}</Text>
      {auth && auth.user && (
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t('simple.logout')}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  btn:{backgroundColor: theme.colors.primary, padding:12, borderRadius:8, alignItems:'center'},
  btnText:{color:'white', fontWeight:'600'},
  card:{backgroundColor: theme.colors.surface, padding:16, borderRadius: theme.radius, marginBottom:12, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:6, elevation:2},
  headerRow:{padding:12, backgroundColor:theme.colors.surface, flexDirection:'row', justifyContent:'space-between', alignItems:'center'},
  headerText:{fontSize:18,fontWeight:'700',color:theme.colors.text},
  logoutBtn:{paddingHorizontal:8,paddingVertical:6,borderRadius:6,backgroundColor:'#F3F4F6'},
  logoutText:{color:theme.colors.muted}
})
