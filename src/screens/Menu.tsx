import React, { useMemo } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING } from '../theme'
import { Avatar, Card, Screen, ScreenHeader, SectionTitle } from '../components/CollectionUI'
import { useAuth } from '../context/AuthContext'

/**
 * "All menu" grid -- the Collectionapp (tabs)/index.jsx pattern of grouping the
 * quick actions into labelled cards instead of one long button column.
 */
type Tile = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  hint: string
  route: string
}

type Section = { title: string; tiles: Tile[] }

const TILE_COLUMNS = 3

export default function MenuScreen(){
  const navigation = useNavigation()
  const { user } = useAuth()
  const isAdmin = user?.role !== 'User'

  const sections = useMemo<Section[]>(()=>{
    const base: Section[] = [
      {
        title: 'Day today',
        tiles: [
          { icon: 'add-circle', label: 'Add Sale', hint: 'New entry', route: 'AddSale' },
          { icon: 'receipt', label: 'Sales', hint: 'All entries', route: 'Sales' },
          { icon: 'cash', label: 'Advances', hint: 'Pre-payments', route: 'Advances' },
        ],
      },
      {
        title: 'Money',
        tiles: [
          { icon: 'checkmark-done', label: 'Settlement', hint: 'Pending', route: 'Settlement' },
          { icon: 'stats-chart', label: 'Reports', hint: 'Totals', route: 'Reports' },
          { icon: 'wallet', label: 'Finance', hint: 'Balance', route: 'Finance' },
          { icon: 'swap-horizontal', label: 'Transactions', hint: 'History', route: 'Transactions' },
        ],
      },
      {
        title: 'Manage',
        tiles: [
          { icon: 'people', label: 'Customers', hint: 'Directory', route: 'Customers' },
          { icon: 'briefcase', label: 'Dealer Master', hint: 'Buyers', route: 'DealerMaster' },
          { icon: 'leaf', label: 'Item Master', hint: 'Vegetables', route: 'ItemMaster' },
          { icon: 'cube', label: 'Inventory', hint: 'Stock', route: 'Inventory' },
          { icon: 'settings', label: 'Settings', hint: 'Account', route: 'Settings' },
        ],
      },
    ]
    if(isAdmin){
      base.push({
        title: 'Administration',
        tiles: [{ icon: 'person-add', label: 'User Management', hint: 'Accounts & roles', route: 'Users' }],
      })
    }
    return base
  }, [isAdmin])

  return (
    <View style={styles.root}>
      <ScreenHeader title="All Menu" subtitle="Every screen in one place" />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {sections.map((section)=>(
          <View key={section.title} style={styles.section}>
            <SectionTitle>{section.title}</SectionTitle>
            <View style={styles.grid}>
              {section.tiles.map((tile)=>(
                <TouchableOpacity
                  key={tile.route}
                  style={styles.tile}
                  activeOpacity={0.8}
                  onPress={()=> {
                    // Navigate using root navigation
                    try {
                      (navigation as any).navigate(tile.route)
                    } catch (e) {
                      console.error('Navigation error:', e)
                    }
                  }}
                >
                  <View style={styles.tileIcon}>
                    <Ionicons name={tile.icon} size={22} color={COLORS.primary} />
                  </View>
                  <Text style={styles.tileLabel} numberOfLines={1}>{tile.label}</Text>
                  <Text style={styles.tileHint} numberOfLines={1}>{tile.hint}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <Card style={styles.tip}>
          <View style={styles.tipRow}>
            <Avatar name={user?.username || 'Farmer'} size={40} />
            <View style={styles.tipMid}>
              <Text style={styles.tipTitle}>Signed in as {user?.username || 'guest'}</Text>
              <Text style={styles.tipText}>Accounts are stored on this device until the API exposes /api/users.</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  )
}

const tileWidth = `${Math.floor((Dimensions.get('window').width - SPACING.md * 2 - SPACING.sm * 2 - 32) / TILE_COLUMNS)}px` as `${number}px`

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  body: { padding: SPACING.md, gap: SPACING.lg },
  section: { gap: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tile: {
    width: tileWidth,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    gap: 6,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  tileHint: { fontSize: 11, color: COLORS.textMuted },
  tip: { gap: SPACING.sm },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tipMid: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  tipText: { fontSize: 12, color: COLORS.textSecondary },
})