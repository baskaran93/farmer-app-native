import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import { load, save } from '../services/storage'
import { en, type Dictionary } from './en'
import { ta } from './ta'

/**
 * Dependency-free i18n.
 *
 * No i18n library is installed in this project (no expo-localization / i18n-js /
 * react-i18next) and the app is deliberately offline-first, so the language is kept in
 * the same AsyncStorage store as the rest of the device data instead of pulling in a new
 * native module. Adding a language = add a file + one entry in LANGUAGES.
 */
export type Language = 'en' | 'ta'

export const LANGUAGES: Array<{ code: Language; label: string; nativeLabel: string }> = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
]

export type TranslateVars = Record<string, string | number>
export type Translate = (key: string, vars?: TranslateVars)=>string

const STORAGE_KEY = 'language'

/* Dictionaries are nested for readability but looked up by dotted path ('sales.title'),
 * so flattening happens once at module load rather than on every render. */
type Flat = Record<string, string>

function flatten(node: unknown, prefix = '', out: Flat = {}): Flat{
  for(const [key, value] of Object.entries(node as Record<string, unknown>)){
    const path = prefix ? `${prefix}.${key}` : key
    if(typeof value === 'string') out[path] = value
    else if(value && typeof value === 'object') flatten(value, path, out)
  }
  return out
}

const TABLES: Record<Language, Flat> = { en: flatten(en), ta: flatten(ta) }

function isTamilLocale(value: unknown): boolean{
  return typeof value === 'string' && value.toLowerCase().startsWith('ta')
}

/** Device / browser locale, used only when the user has never picked a language. */
export function deviceLanguage(): Language{
  const g = globalThis as any
  const candidates: unknown[] = Platform.OS === 'web'
    ? [g?.navigator?.language, ...(Array.isArray(g?.navigator?.languages) ? g.navigator.languages : [])]
    : [Platform.localeIdentifier]
  return candidates.some(isTamilLocale) ? 'ta' : 'en'
}

export function isLanguage(value: unknown): value is Language{
  return value === 'en' || value === 'ta'
}

export function languageOption(code: Language){
  return LANGUAGES.find((l)=> l.code === code) || LANGUAGES[0]
}

type I18nValue = {
  language: Language
  /** Persisted immediately; every subscriber re-renders (no app restart needed). */
  setLanguage: (next: Language)=>Promise<void>
  t: Translate
  /** False until the stored choice has been read, so the UI never flashes English. */
  ready: boolean
}

const I18nContext = createContext<I18nValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }){
  const [language, setLanguageState] = useState<Language>('en')
  const [ready, setReady] = useState(false)

  useEffect(()=>{
    let active = true
    load<Language | null>(STORAGE_KEY, null)
      .then((stored)=>{
        if(!active) return
        setLanguageState(isLanguage(stored) ? stored : deviceLanguage())
      })
      .catch(()=>{ /* first run / storage unavailable: stay English */ })
      .finally(()=>{ if(active) setReady(true) })
    return ()=>{ active = false }
  }, [])

  const setLanguage = useCallback(async (next: Language)=>{
    setLanguageState(next)
    try { await save(STORAGE_KEY, next) } catch { /* the in-memory switch already applied */ }
  }, [])

  const t = useCallback<Translate>((key, vars)=>{
    // Tamil first, then English, then the raw key -- a missing key is visible, never blank.
    const template = TABLES[language]?.[key] ?? TABLES.en[key] ?? key
    if(!vars || template.indexOf('{{') === -1) return template
    return template.replace(/\{\{(\w+)\}\}/g, (_match, name: string)=>
      vars[name] === undefined ? '' : String(vars[name])
    )
  }, [language])

  const value = useMemo<I18nValue>(()=>({ language, setLanguage, t, ready }), [language, setLanguage, t, ready])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue{
  const ctx = useContext(I18nContext)
  if(!ctx) throw new Error('useI18n() must be used inside <LanguageProvider>')
  return ctx
}

const FALLBACK: I18nValue = {
  language: 'en',
  setLanguage: async ()=>{},
  t: (key, vars)=> translateAs('en', key, vars),
  ready: true,
}

/** Non-throwing variant for the legacy UI kit, which can also render outside the provider. */
export function useOptionalI18n(): I18nValue{
  return useContext(I18nContext) ?? FALLBACK
}

/**
 * Translate with an explicit language instead of the active one. The Language screen uses
 * this to show each option in its own script, so a user who cannot read English still sees
 * what "Tamil" contains.
 */
export function translateAs(code: Language, key: string, vars?: TranslateVars): string{
  const template = TABLES[code]?.[key] ?? TABLES.en[key] ?? key
  if(!vars || template.indexOf('{{') === -1) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_match, name: string)=>
    vars[name] === undefined ? '' : String(vars[name])
  )
}

export type { Dictionary }
