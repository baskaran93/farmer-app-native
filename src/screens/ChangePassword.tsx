import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { COLORS, SPACING } from '../theme'
import {
  Banner,
  Card,
  Field,
  PrimaryButton,
  Screen,
  ScreenHeader,
  inputStyle,
} from '../components/CollectionUI'
import { AppUser, ensureSeed, findByUsername, saveUser, verifySecret } from '../services/users'
import { useAuth } from '../context/AuthContext'

/**
 * Password change for the signed-in account. The backend has no
 * /api/auth/change-password route yet, so the new password is written to the
 * device store (services/users.ts) -- the info banner says so explicitly
 * rather than pretending the server was updated.
 */
export default function ChangePasswordScreen(){
  const navigation = useNavigation()
  const { user } = useAuth()
  const [account, setAccount] = useState<AppUser | null>(null)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  useEffect(()=>{
    let active = true
    ensureSeed(user).then(async ()=>{
      const found = user?.username ? await findByUsername(user.username) : null
      if(active) setAccount(found)
    })
    return ()=>{ active = false }
  }, [user])

  const submit = async ()=>{
    setError('')
    setDone('')
    if(next.length < 6){
      setError('New password must be at least 6 characters.')
      return
    }
    if(next !== confirm){
      setError('New passwords do not match.')
      return
    }
    if(!account){
      setError('No local account found for this sign-in. Add it from User Management first.')
      return
    }
    if(!verifySecret(account, current)){
      setError('Your current password is not correct.')
      return
    }
    setSaving(true)
    const result = await saveUser({ id: account.id, username: account.username, role: account.role, password: next })
    setSaving(false)
    if(!result.ok){
      setError(result.error)
      return
    }
    setDone('Password updated on this device.')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <Screen>
      <ScreenHeader title="Change Password" subtitle={user?.username || 'Account'} onSave={submit} saving={saving} saveLabel="Update" />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {error ? <Banner tone="error" text={error} /> : null}
        {done ? <Banner tone="success" text={done} /> : null}
        <Banner
          tone="info"
          text="Passwords are hashed and kept on this device until the API supports change-password."
        />
        <Card>
          <Field label="Current Password" required>
            <TextInput
              value={current}
              onChangeText={setCurrent}
              placeholder="••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoCapitalize="none"
              style={inputStyle}
            />
          </Field>
          <Field label="New Password" required hint="At least 6 characters.">
            <TextInput
              value={next}
              onChangeText={setNext}
              placeholder="••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoCapitalize="none"
              style={inputStyle}
            />
          </Field>
          <Field label="Confirm New Password" required>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoCapitalize="none"
              style={inputStyle}
            />
          </Field>
        </Card>
        <View>
          <PrimaryButton label="Update Password" onPress={submit} loading={saving} />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  body: { padding: SPACING.md, gap: SPACING.md },
})