import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { COLORS, RADIUS, SPACING } from '../theme'
import {
  Avatar,
  Card,
  MenuRow,
  PrimaryButton,
  RowDivider,
  Screen,
  ScreenHeader,
  SectionTitle,
  confirmAction,
} from '../components/CollectionUI'
import { useAuth } from '../context/AuthContext'
import { languageOption, useI18n } from '../i18n'
// Read straight from app.json (tsconfig has resolveJsonModule) instead of
// expo-constants, which is only a transitive dependency of `expo` here.
import appConfig from '../../app.json'

/**
 * Settings hub: profile card + grouped rows + logout, following the
 * Collectionapp settings/index.jsx layout (its rows use the same
 * icon-tile / title / subtitle / chevron rhythm).
 */
export default function SettingsScreen(){
  const navigation = useNavigation()
  const { user, logout } = useAuth()
  const { t, language } = useI18n()
  const isAdmin = user?.role !== 'User'
  const version = appConfig.expo?.version || '1.0.0'
  const appName = appConfig.expo?.name || t('settings.appName')

  const onLogout = ()=>{
    confirmAction(t('settings.logout'), t('settings.logoutBody'), ()=>{
      logout()
      // AppRoutes swaps MainStack for AuthStack as soon as the session clears,
      // so the whole stack (including this screen) unmounts and Login shows.
    })
  }

  return (
    <Screen>
      <ScreenHeader title={t('settings.title')} subtitle={user?.username || t('settings.guest')} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Card style={styles.profile}>
          <Avatar name={user?.username || t('settings.guest')} size={56} />
          <View style={styles.profileMid}>
            <Text style={styles.profileName}>{user?.username || t('settings.guest')}</Text>
            <Text style={styles.profileMeta}>
              {user?.id ? t('settings.accountNumber', { id: user.id }) : ''}
              {isAdmin ? t('common.administrator') : t('common.standardUser')}
            </Text>
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{isAdmin ? t('common.admin') : t('common.user')}</Text>
          </View>
        </Card>

        <View style={styles.group}>
          <SectionTitle>{t('settings.preferences')}</SectionTitle>
          <Card style={styles.groupCard}>
            <MenuRow
              icon="globe-outline"
              title={t('language.title')}
              subtitle={languageOption(language).nativeLabel}
              onPress={()=> (navigation as any).navigate('Language')}
            />
          </Card>
        </View>

        <View style={styles.group}>
          <SectionTitle>{t('settings.account')}</SectionTitle>
          <Card style={styles.groupCard}>
            <MenuRow
              icon="lock-closed"
              title={t('settings.changePassword')}
              subtitle={t('settings.changePasswordSub')}
              onPress={()=> (navigation as any).navigate('ChangePassword')}
            />
            <RowDivider />
            <MenuRow
              icon="grid"
              title={t('settings.allMenu')}
              subtitle={t('settings.allMenuSub')}
              onPress={()=> (navigation as any).navigate('Menu')}
            />
          </Card>
        </View>

        {isAdmin ? (
          <View style={styles.group}>
            <SectionTitle>{t('settings.administration')}</SectionTitle>
            <Card style={styles.groupCard}>
              <MenuRow
                icon="people"
                title={t('settings.userManagement')}
                subtitle={t('settings.userManagementSub')}
                onPress={()=> (navigation as any).navigate('Users')}
              />
            </Card>
          </View>
        ) : null}

        <View style={styles.group}>
          <SectionTitle>{t('settings.security')}</SectionTitle>
          <Card style={styles.groupCard}>
            <MenuRow icon="log-out" title={t('settings.logout')} subtitle={t('settings.logoutSub')} danger onPress={onLogout} />
          </Card>
        </View>

        <View style={styles.group}>
          <SectionTitle>{t('settings.about')}</SectionTitle>
          <Card style={styles.about}>
            <AboutRow label={t('settings.appRow')} value={appName} />
            <AboutRow label={t('settings.version')} value={version} />
            <AboutRow label={t('settings.storage')} value={t('settings.storageValue')} />
            <AboutRow label={t('language.title')} value={languageOption(language).nativeLabel} />
          </Card>
        </View>

        <PrimaryButton label={t('settings.logout')} variant="danger" onPress={onLogout} />
      </ScrollView>
    </Screen>
  )
}

function AboutRow({ label, value }: { label: string; value: string }){
  return (
    <View style={styles.aboutRow}>
      <Text style={styles.aboutLabel}>{label}</Text>
      <Text style={styles.aboutValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  body: { padding: SPACING.md, gap: SPACING.lg },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileMid: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  profileMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  rolePill: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  rolePillText: { fontSize: 11, fontWeight: '800', color: COLORS.primary },
  group: { gap: SPACING.sm },
  groupCard: { padding: 0, overflow: 'hidden' },
  about: { gap: 10 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aboutLabel: { fontSize: 13, color: COLORS.textSecondary },
  aboutValue: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
})