import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING } from '../theme'
import {
  Banner,
  Card,
  RowDivider,
  Screen,
  ScreenHeader,
  SectionTitle,
} from '../components/CollectionUI'
import { LANGUAGES, translateAs, useI18n } from '../i18n'

/**
 * Language picker (Settings > Language).
 *
 * Selecting a language writes to AsyncStorage and re-renders every subscribed screen
 * through context, so the switch is immediate -- no restart, and nothing is cached in a
 * navigation title. Each row previews its own language so the choice is readable without
 * knowing English.
 */
export default function LanguageScreen(){
  const { language, setLanguage, t } = useI18n()

  const choose = (code: 'en' | 'ta')=>{
    if(code !== language) void setLanguage(code)
  }

  return (
    <Screen>
      <ScreenHeader title={t('language.title')} subtitle={t('language.subtitle')} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.group}>
          <SectionTitle>{t('language.title')}</SectionTitle>
          <Card style={styles.groupCard}>
            {LANGUAGES.map((option, index)=>{
              const active = option.code === language
              const sample = translateAs(option.code, 'dashboard.title')
              return (
                <React.Fragment key={option.code}>
                  {index > 0 ? <RowDivider /> : null}
                  <TouchableOpacity
                    style={styles.row}
                    activeOpacity={0.7}
                    onPress={()=> choose(option.code)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <View style={styles.rowIcon}>
                      <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.rowMid}>
                      <Text style={styles.rowTitle}>{option.nativeLabel}</Text>
                      <Text style={styles.rowSubtitle} numberOfLines={1}>
                        {option.label === option.nativeLabel ? sample : `${option.label} · ${sample}`}
                      </Text>
                    </View>
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={active ? COLORS.primary : COLORS.border}
                    />
                  </TouchableOpacity>
                </React.Fragment>
              )
            })}
          </Card>
        </View>

        <Banner tone="info" text={t('language.hint')} />

        <View style={styles.group}>
          <SectionTitle>{t('settings.about')}</SectionTitle>
          <Card style={styles.about}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('language.title')}</Text>
              <Text style={styles.aboutValue}>{t('language.select')}: {LANGUAGES.find((l)=> l.code === language)?.nativeLabel}</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  body: { padding: SPACING.md, gap: SPACING.md },
  group: { gap: SPACING.sm },
  groupCard: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.md,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowMid: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  rowSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  about: { gap: 10 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aboutLabel: { fontSize: 13, color: COLORS.textSecondary },
  aboutValue: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
})
