import AsyncStorage from '@react-native-async-storage/async-storage'

export async function initStorage(){
  // ensure keys exist
  // NOTE: 'user' is deliberately NOT seeded -- writing the string "null" makes the
  // raw stored value truthy, so session restore can no longer trust `if (raw)`.
  const keys = ['sales', 'advances', 'dealers', 'items', 'customers', 'inventory']
  for(const k of keys){
    const v = await AsyncStorage.getItem(k)
    if(v===null) await AsyncStorage.setItem(k, JSON.stringify([]))
  }
}

export async function load<T>(key:string, fallback:T):Promise<T>{
  try{
    const raw = await AsyncStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  }catch(e){
    return fallback
  }
}

export async function save<T>(key:string, value:T):Promise<void>{
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export async function addItem<T extends { id?: string }>(key:string, item: Record<string, any>): Promise<T>{
  const list = await load<T[]>(key, [])
  const next = { ...item, id: item.id ?? String(Date.now()) } as unknown as T
  list.push(next)
  await save(key, list)
  return next
}

export async function listOrFallback<T>(primaryKey: string, legacyKey: string, fallback: T[] = []): Promise<T[]> {
  const primary = await load<T[]>(primaryKey, fallback)
  if (primary && primary.length > 0) return primary
  const legacy = await load<T[]>(legacyKey, fallback)
  if (legacy && legacy.length > 0) {
    await save(primaryKey, legacy)
    return legacy
  }
  return primary
}

