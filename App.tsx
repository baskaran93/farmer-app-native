import React, { Component, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Login from './src/screens/Login'
import Dashboard from './src/screens/Dashboard'
import Sales from './src/screens/Sales'
import AddSale from './src/screens/AddSale'
import SaleDetail from './src/screens/SaleDetail'
import Advances from './src/screens/Advances'
import Settlement from './src/screens/Settlement'
import Reports from './src/screens/Reports'
// Customers/Inventory/Finance/Transactions existed but were never registered, so they
// were unreachable. Settings/Menu/ChangePassword/Users/UserEdit are new (Option C:
// additive screens that reuse this stack rather than migrating to Expo Router).
import Customers from './src/screens/Customers'
import Inventory from './src/screens/Inventory'
import Finance from './src/screens/Finance'
import Transactions from './src/screens/Transactions'
import Menu from './src/screens/Menu'
import Settings from './src/screens/Settings'
import ChangePassword from './src/screens/ChangePassword'
import Users from './src/screens/Users'
import UserEdit from './src/screens/UserEdit'
import LanguageScreen from './src/screens/Language'
import { initStorage } from './src/services/storage'
import { COLORS } from './src/theme'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { LanguageProvider, useI18n } from './src/i18n'

const Stack = createNativeStackNavigator()

function AuthStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

/**
 * Native-stack titles are read from here, so the navigator itself is translated too.
 * MainStack re-renders when the language changes (LanguageProvider sits above
 * NavigationContainer), which is what pushes the new titles into the native header.
 */
function MainStack(){
  const { t } = useI18n()
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Sales" component={Sales} options={{ title: t('nav.sales') }} />
      <Stack.Screen name="AddSale" component={AddSale} options={{ title: t('nav.addSale') }} />
      <Stack.Screen name="SaleDetail" component={SaleDetail} options={{ title: t('nav.saleDetail') }} />
      <Stack.Screen name="Advances" component={Advances} options={{ title: t('nav.advances') }} />
      <Stack.Screen name="Settlement" component={Settlement} options={{ title: t('nav.settlement') }} />
      <Stack.Screen name="Reports" component={Reports} options={{ title: t('nav.reports') }} />
      {/* The screens below draw their own header (ScreenHeader), so the native one is off. */}
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <Stack.Screen name="Users" component={Users} options={{ headerShown: false }} />
      <Stack.Screen name="UserEdit" component={UserEdit} options={{ headerShown: false }} />
      <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Customers" component={Customers} options={{ title: t('nav.customers') }} />
      <Stack.Screen name="Inventory" component={Inventory} options={{ title: t('nav.inventory') }} />
      <Stack.Screen name="Finance" component={Finance} options={{ title: t('nav.finance') }} />
      <Stack.Screen name="Transactions" component={Transactions} options={{ title: t('nav.transactions') }} />
    </Stack.Navigator>
  )
}

/** Shown while the stored session and the first data load resolve. Without this gate
 *  the Login screen mounts first and is swapped for the app a frame later (visible blink). */
function Splash(){
  const { t } = useI18n()
  return (
    <View style={s.splash}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={s.splashText}>{t('app.loading')}</Text>
    </View>
  )
}

/** Before, one throwing screen took the whole app down and left a blank page. */
class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }>{
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error){
    return { error }
  }

  componentDidCatch(error: Error, info: any){
    console.error('SCREEN CRASH:', error, info)
  }

  render(){
    if(this.state.error){
      return (
        <View style={s.errorWrap}>
          <Text style={s.errorTitle}>Something went wrong</Text>
          <Text style={s.errorMessage}>{this.state.error.message || 'Unknown error'}</Text>
          <TouchableOpacity style={s.errorButton} onPress={()=> this.setState({ error: null })}>
            <Text style={s.errorButtonText}>Try again</Text>
          </TouchableOpacity>
          {Platform.OS === 'web' && (
            <TouchableOpacity style={s.errorButton} onPress={()=> (globalThis as any).location?.reload?.()}>
              <Text style={s.errorButtonText}>Reload app</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    }
    return this.props.children
  }
}

function AppRoutes(){
  const { user, isLoading } = useAuth()
  const { ready } = useI18n()
  // Gate on the stored language as well: painting Login in English for one frame and then
  // flipping to Tamil reads as a glitch, so the splash stays until the choice is resolved.
  if(isLoading || !ready) return <Splash />
  return (
    <SafeAreaView style={s.root}>
      {user ? <MainStack /> : <AuthStack />}
    </SafeAreaView>
  )
}

export default function App(){
  useEffect(()=>{ initStorage().catch(()=>{}) }, [])
  return (
    <LanguageProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, minHeight: '100%', backgroundColor: COLORS.background },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  splashText: { marginTop: 12, fontSize: 15, color: COLORS.textSecondary },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: COLORS.background },
  errorTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  errorMessage: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 20 },
  errorButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 22, marginTop: 8 },
  errorButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
})
