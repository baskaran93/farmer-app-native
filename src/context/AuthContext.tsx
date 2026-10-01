import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as api from '../services/api'
import { syncAll } from '../services/sync'

export type User = {
  id?: number
  username: string
  /**
   * Drives the Admin-only entries (User Management). The Express backend's /api/auth/login
   * does not return a role yet, so an account without one is treated as the owner (Admin)
   * -- otherwise the single-user offline login could never reach User Management.
   */
  role?: 'User' | 'Admin'
} | null

export interface Sale {
  id: string
  date: string
  rate: number
  firstKg: number
  secondKg: number
  firstAmount: number
  secondRate: number
  secondAmount: number
  totalAmount: number
}

export interface Advance {
  id: string
  date: string
  amount: number
  description: string
}

export interface SalesData {
  sales: Sale[]
  advances: Advance[]
}

type AuthContextType = {
  user: User
  /** true until the stored session has been read and the first data load finished */
  isLoading: boolean
  login: (username: string, password?: string) => Promise<void>
  logout: () => Promise<void>
  salesData: SalesData
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>
  addAdvance: (advance: Omit<Advance, 'id'>) => Promise<void>
  updateSale: (id: string, sale: Omit<Sale, 'id'>) => Promise<void>
  deleteSale: (id: string) => Promise<void>
  deleteAdvance: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [salesData, setSalesData] = useState<SalesData>({ sales: [], advances: [] })

  // The refs mirror the latest lists so the helpers below can keep a STABLE identity.
  // This matters a lot: screens do useFocusEffect(React.useCallback(() => { refreshData() }, [refreshData]))
  // and useFocusEffect re-runs (immediately, while the screen is focused) whenever the
  // callback identity changes. Unstable helpers therefore meant refreshData -> setState ->
  // re-render -> new refreshData -> refreshData ... = infinite loop, infinite re-renders
  // (visible flicker/blinking) and finally a blank screen.
  const salesRef = useRef<Sale[]>([])
  const advancesRef = useRef<Advance[]>([])
  const refreshingRef = useRef(false)

  // Single writer for the sales list: state + ref + offline cache stay in sync.
  const applySales = useCallback((sales: Sale[])=>{
    salesRef.current = sales
    setSalesData(prev => ({ ...prev, sales }))
    AsyncStorage.setItem('sales', JSON.stringify(sales)).catch(()=>{})
  }, [])

  const applyAdvances = useCallback((advances: Advance[])=>{
    advancesRef.current = advances
    setSalesData(prev => ({ ...prev, advances }))
    AsyncStorage.setItem('advances', JSON.stringify(advances)).catch(()=>{})
  }, [])

  const refreshData = useCallback(async ()=>{
    if(refreshingRef.current) return          // never run overlapping refreshes
    refreshingRef.current = true
    try {
      // Try to fetch from API (SQL Server)
      const sales = ((await api.getSales()) as Sale[]) ?? []
      const advances = ((await api.getAdvances()) as Advance[]) ?? []
      applySales(sales)
      applyAdvances(advances)
    } catch (error) {
      console.warn('API call failed, using local storage:', error)
      // Fallback to local storage
      try {
        const [rawSales, rawAdvances] = await Promise.all([
          AsyncStorage.getItem('sales'),
          AsyncStorage.getItem('advances'),
        ])
        const sales: Sale[] = rawSales ? JSON.parse(rawSales) : []
        const advances: Advance[] = rawAdvances ? JSON.parse(rawAdvances) : []
        salesRef.current = sales
        advancesRef.current = advances
        setSalesData({ sales, advances })
      } catch (e) {
        console.warn('Local cache unreadable:', e)
      }
    } finally {
      refreshingRef.current = false
    }
  }, [applySales, applyAdvances])

  // Restore the stored session, load data once, then hand control to the navigator.
  // Screens are not mounted until this finishes, so the login screen can not flash
  // on screen and get replaced a moment later.
  useEffect(()=>{
    let cancelled = false
    ;(async ()=>{
      try {
        const raw = await AsyncStorage.getItem('user')
        if(raw){
          try {
            const parsed = JSON.parse(raw) as User
            // "null" or malformed values must never count as a logged-in session
            if(parsed && typeof parsed.username === 'string' && !cancelled) setUser(parsed)
          } catch {
            await AsyncStorage.removeItem('user').catch(()=>{})
          }
        }
      } catch (e) {
        console.warn('Could not restore session:', e)
      }
      await refreshData()
      if(!cancelled) setIsLoading(false)
    })()
    return ()=>{ cancelled = true }
  }, [refreshData])

  useEffect(()=>{
    if(!user) return
    syncAll().catch(()=>{ /* offline: sync will be retried later */ })
  }, [user])

  const login = useCallback(async (username: string, password?: string)=>{
    let u: User = { username, role: 'Admin' }
    try {
      const res = await api.login(username, password || '')
      if(res?.user && typeof res.user.username === 'string'){
        const apiUser = res.user as Exclude<User, null>
        u = { ...apiUser, username: apiUser.username || username, role: apiUser.role || 'Admin' }
      }
    } catch (error) {
      // Backend unreachable: keep the app usable with a local (offline) session
      console.warn('Login API failed, continuing offline:', error)
    }
    await AsyncStorage.setItem('user', JSON.stringify(u)).catch(()=>{})
    setUser(u)
    syncAll().catch(()=>{})
  }, [])

  const logout = useCallback(async ()=>{
    await AsyncStorage.removeItem('user').catch(()=>{})
    setUser(null)
  }, [])

  const addSale = useCallback(async (sale: Omit<Sale, 'id'>)=>{
    const newSale: Sale = { ...sale, id: String(Date.now()) }
    try { await api.addSale(newSale) }
    catch (error) { console.warn('API call failed, saving to local storage:', error) }
    applySales([...salesRef.current, newSale])
  }, [applySales])

  const addAdvance = useCallback(async (advance: Omit<Advance, 'id'>)=>{
    const newAdvance: Advance = { ...advance, id: String(Date.now()) }
    try { await api.addAdvance(newAdvance) }
    catch (error) { console.warn('API call failed, saving to local storage:', error) }
    applyAdvances([...advancesRef.current, newAdvance])
  }, [applyAdvances])

  const updateSale = useCallback(async (id: string, sale: Omit<Sale, 'id'>)=>{
    try { await api.updateSale(id, sale) }
    catch (error) { console.warn('API call failed:', error) }
    applySales(salesRef.current.map(s => (s.id === id ? { ...sale, id } : s)))
  }, [applySales])

  const deleteSale = useCallback(async (id: string)=>{
    try { await api.deleteSale(id) }
    catch (error) { console.warn('API call failed:', error) }
    applySales(salesRef.current.filter(s => s.id !== id))
  }, [applySales])

  const deleteAdvance = useCallback(async (id: string)=>{
    try { await api.deleteAdvance(id) }
    catch (error) { console.warn('API call failed:', error) }
    applyAdvances(advancesRef.current.filter(a => a.id !== id))
  }, [applyAdvances])

  const value = useMemo<AuthContextType>(
    ()=>({ user, isLoading, login, logout, salesData, addSale, addAdvance, updateSale, deleteSale, deleteAdvance, refreshData }),
    [user, isLoading, salesData, login, logout, addSale, addAdvance, updateSale, deleteSale, deleteAdvance, refreshData]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
