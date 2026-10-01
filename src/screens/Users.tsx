import React, { useCallback, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING } from '../theme'
import { Avatar, Card, EmptyState, Screen, ScreenHeader } from '../components/CollectionUI'
import { AppUser, ensureSeed } from '../services/users'
import { useAuth } from '../context/AuthContext'

/**
 * User list -- 1:1 with Collectionapp's (tabs)/user/index.jsx:
 * avatar tile, username, count-by-role subtitle, shield for Admins, plus button bottom-right.
 * The data source is the device store (services/users.ts) because the API has no /users route.
 */
export default function UsersScreen(){
  const navigation = useNavigation()
  const { user } = useAuth()
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (mode: 'initial' | 'refresh' = 'initial')=>{
    if(mode === 'refresh') setRefreshing(true)
    const seeded = await ensureSeed(user)
    setUsers(seeded)
    setLoading(false)
    setRefreshing(false)
  }, [user])

  // Reload on focus so a user added/edited in UserEdit shows up immediately.
  useFocusEffect(useCallback(()=>{ load('initial') }, [load]))

  const goEdit = (id: string)=> (navigation as any).navigate('UserEdit', { id })

  const renderUser = ({ item }: { item: AppUser })=> (
    <TouchableOpacity activeOpacity={0.7} onPress={()=> goEdit(item.id)}>
      <Card style={styles.row}>
        <Avatar name={item.username} size={44} />
        <View style={styles.rowMid}>
          <Text style={styles.rowTitle}>{item.username}</Text>
          <Text style={styles.rowSubtitle}>
            {item.role === 'Admin' ? 'Administrator' : 'Standard user'}
            {item.createdAt ? ` · joined ${new Date(item.createdAt).toLocaleDateString()}` : ''}
          </Text>
        </View>
        {item.role === 'Admin' ? (
          <View style={styles.shield}>
            <Ionicons name="shield-checkmark" size={14} color="#fff" />
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={19} color={COLORS.textMuted} />
      </Card>
    </TouchableOpacity>
  )

  return (
    <Screen>
      <ScreenHeader
        title="User Management"
        subtitle={loading ? 'Loading…' : `${users.length} account${users.length === 1 ? '' : 's'}`}
      />
      <FlatList
        data={users}
        keyExtractor={(u)=> u.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        ListEmptyComponent={loading ? null : <EmptyState text="No users yet. Add your first account below." />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=> load('refresh')} tintColor={COLORS.primary} />}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={()=> goEdit('new')}
        accessibilityRole="button"
        accessibilityLabel="Add user"
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: { padding: SPACING.md, gap: 12, paddingBottom: 120 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  rowMid: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  rowSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  shield: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.xl,
    width: 58,
    height: 58,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // RN 0.71 / react-native-web both support the array form of boxShadow.
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.45)',
    elevation: 6,
  } as any,
})