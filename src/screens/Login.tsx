import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { COLORS, theme } from '../theme'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'

export default function Login(){
  const auth = useAuth()
  const { t } = useI18n()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  useEffect(()=>{
    mounted.current = true
    return ()=>{ mounted.current = false }
  }, [])

  function showError(message: string){
    // Alert.alert() is an empty stub in react-native-web, so on web the message
    // has to be rendered inline or the user sees nothing at all.
    setError(message)
    if(Platform.OS !== 'web') Alert.alert(t('login.alertTitle'), message)
  }

  async function submit(){
    if(loading) return
    if(!username.trim()){ showError(t('login.errUsername')); return }
    if(password.length && password.length < 4){ showError(t('login.errPasswordShort')); return }
    setError(null)
    setLoading(true)
    try {
      await auth.login(username.trim(), password || undefined)
      // No navigation call here on purpose: AuthProvider flips `user`, and AppRoutes
      // swaps the Login stack for the Main stack. (The old navigation.replace('Dashboard')
      // targeted a route that is not registered in the auth stack -> unhandled action error.)
    } catch (e: any) {
      showError(e?.message || t('login.errFailed'))
    } finally {
      if(mounted.current) setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>{t('app.brand')}</Text>
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('app.tagline')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t('common.username')}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder={t('login.usernamePlaceholder')}
            returnKeyType="next"
          />
          <Text style={styles.label}>{t('common.password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder={t('login.passwordPlaceholder')}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={submit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>{t('login.signIn')}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  header: { marginBottom: 18, alignItems: 'center' },
  brand: { color: COLORS.primary, fontWeight: '700', fontSize: 14, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  subtitle: { marginTop: 6, color: theme.colors.muted },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  label: { fontWeight: '600', marginBottom: 6, color: theme.colors.text },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: COLORS.background, color: theme.colors.text, marginBottom: 12 },
  errorBox: { backgroundColor: COLORS.dangerBg, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  errorText: { color: COLORS.dangerText, fontSize: 13 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
