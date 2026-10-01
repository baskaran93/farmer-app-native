import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { COLORS, SPACING } from '../theme'
import {
  Banner,
  Card,
  Field,
  PrimaryButton,
  RolePicker,
  Screen,
  ScreenHeader,
  confirmAction,
  inputStyle,
} from '../components/CollectionUI'
import { AppUser, deleteUser, getUser, saveUser } from '../services/users'
import { useAuth } from '../context/AuthContext'
import type { RootStackParamList } from '../navigation/types'

type UserRole = 'User' | 'Admin'

/**
 * Add / edit account, mirroring Collectionapp's app/user/add.jsx and edit.jsx
 * (same fields -- Username, Password, Confirm Password, Role -- and the same
 * Save / Delete header affordances, with an inline error banner because
 * Alert is a no-op on web).
 */
export default function UserEditScreen(){
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, 'UserEdit'>>()
  const { user: session } = useAuth()

  const userId = route.params?.id || 'new'
  const isEditing = userId !== 'new'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('User')
  const [target, setTarget] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    let active = true
    if(!isEditing){
      setLoading(false)
      return ()=>{ active = false }
    }
    setLoading(true)
    getUser(userId).then((found)=>{
      if(!active) return
      if(found){
        setTarget(found)
        setUsername(found.username)
        setRole(found.role)
      } else {
        setError('That user no longer exists.')
      }
      setLoading(false)
    })
    return ()=>{ active = false }
  }, [isEditing, userId])

  const submit = async ()=>{
    setError('')
    if(password && password !== confirmPassword){
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    const result = await saveUser({ id: isEditing ? userId : undefined, username, role, password })
    setSaving(false)
    if(!result.ok){
      setError(result.error)
      return
    }
    navigation.goBack()
  }

  const remove = ()=>{
    confirmAction('Delete', `Are you sure you want to delete "${target?.username || 'this user'}"?`, async ()=>{
      setDeleting(true)
      const result = await deleteUser(userId, session?.username)
      setDeleting(false)
      if(!result.ok){
        setError(result.error)
        return
      }
      navigation.goBack()
    })
  }

  return (
    <Screen>
      <ScreenHeader
        title={isEditing ? 'Edit User' : 'Add User'}
        subtitle={isEditing ? target?.username : 'Create a new account'}
        onSave={submit}
        saving={saving || deleting || loading}
        saveLabel={isEditing ? 'Update' : 'Add'}
        onDelete={remove}
        showDelete={isEditing}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {error ? <Banner tone="error" text={error} /> : null}

          <Card style={styles.card}>
            <Field label="Username" required hint="Letters and numbers, no spaces. Used to sign in.">
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                style={inputStyle}
              />
            </Field>

            <Field
              label={isEditing ? 'New Password' : 'Password'}
              required={!isEditing}
              hint={isEditing ? 'Leave blank to keep the current password.' : 'At least 6 characters.'}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                autoCapitalize="none"
                style={inputStyle}
              />
            </Field>

            <Field label="Confirm Password">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                autoCapitalize="none"
                style={inputStyle}
              />
            </Field>

            <Field label="Role" required>
              <RolePicker value={role} onChange={setRole} />
            </Field>
          </Card>

          <View style={styles.helper}>
            <Text style={styles.helperText}>
              {role === 'Admin'
                ? 'Admins can manage other accounts from User Management.'
                : 'Standard users can record sales, advances and settlements only.'}
            </Text>
          </View>

          <PrimaryButton label={isEditing ? 'Update User' : 'Add User'} onPress={submit} loading={saving} />
          {isEditing ? <PrimaryButton label="Delete User" variant="danger" onPress={remove} loading={deleting} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: SPACING.md, gap: SPACING.md },
  card: { marginTop: SPACING.xs },
  helper: { paddingHorizontal: SPACING.xs },
  helperText: { fontSize: 12, color: COLORS.textSecondary },
})
