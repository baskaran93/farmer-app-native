import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Device-local user accounts.
 *
 * The Express backend (backend/server.js) only exposes /api/auth, /api/sales and
 * /api/advances -- there is no /api/users route, so a user-management screen could not
 * be server-backed today. Like the rest of this app (see services/api.ts + AuthContext)
 * the store is therefore offline-first and writes to AsyncStorage. When a users endpoint
 * is added server-side, swap the bodies of listUsers()/persist() for api calls: the
 * screens only ever talk to this module.
 */
export type UserRole = 'User' | 'Admin'

export interface AppUser {
  id: string
  username: string
  role: UserRole
  /** Hashed (see hashSecret). The plain password is never stored or returned. */
  secret?: string
  createdAt: string
}

const KEY = 'users'

/* ----------------------------- secrets ---------------------------- *
 * AsyncStorage is plain-text on the device, so at least the password never
 * sits there verbatim. This is obfuscation, not real security: the backend
 * must be the authority on credentials once /api/users exists.
 * ------------------------------------------------------------------ */
export function hashSecret(value: string): string{
  let h = 5381
  for(let i = 0; i < value.length; i++) h = ((h << 5) + h + value.charCodeAt(i)) >>> 0
  return `v1.${h.toString(16)}.${value.length}`
}

export function verifySecret(user: Pick<AppUser, 'secret'>, value: string): boolean{
  if(!user.secret) return true                       // accounts created before passwords existed
  return user.secret === hashSecret(value)
}

/* ------------------------------ reads ----------------------------- */
export async function listUsers(): Promise<AppUser[]>{
  try {
    const raw = await AsyncStorage.getItem(KEY)
    if(!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AppUser[]) : []
  } catch {
    return []
  }
}

export async function getUser(id: string): Promise<AppUser | null>{
  const users = await listUsers()
  return users.find((u)=> u.id === id) || null
}

export async function findByUsername(username: string): Promise<AppUser | null>{
  const users = await listUsers()
  const needle = username.trim().toLowerCase()
  return users.find((u)=> u.username.toLowerCase() === needle) || null
}

async function persist(users: AppUser[]): Promise<void>{
  await AsyncStorage.setItem(KEY, JSON.stringify(users))
}

/* ------------------------------ writes ---------------------------- */
export type SaveUserInput = {
  id?: string
  username: string
  role: UserRole
  password?: string
}

export type SaveUserResult = { ok: true; user: AppUser } | { ok: false; error: string }

export async function saveUser(input: SaveUserInput): Promise<SaveUserResult>{
  const username = input.username.trim()
  const password = input.password || ''
  const isNew = !input.id

  if(username.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' }
  if(/\s/.test(username)) return { ok: false, error: 'Username cannot contain spaces.' }
  if(isNew && password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }
  if(!isNew && password && password.length < 6) return { ok: false, error: 'New password must be at least 6 characters.' }

  const users = await listUsers()
  const clash = users.find((u)=> u.username.toLowerCase() === username.toLowerCase() && u.id !== input.id)
  if(clash) return { ok: false, error: `The username "${username}" is already taken.` }

  if(isNew){
    const user: AppUser = {
      id: String(Date.now()),
      username,
      role: input.role,
      secret: hashSecret(password),
      createdAt: new Date().toISOString(),
    }
    await persist([...users, user])
    return { ok: true, user }
  }

  const existing = users.find((u)=> u.id === input.id)
  if(!existing) return { ok: false, error: 'That user no longer exists.' }

  const updated: AppUser = {
    ...existing,
    username,
    role: input.role,
    // Blank password field means "keep the current one".
    secret: password ? hashSecret(password) : existing.secret,
  }
  await persist(users.map((u)=> (u.id === updated.id ? updated : u)))
  return { ok: true, user: updated }
}

export type DeleteUserResult = { ok: true } | { ok: false; error: string }

export async function deleteUser(id: string, currentUsername?: string): Promise<DeleteUserResult>{
  const users = await listUsers()
  const target = users.find((u)=> u.id === id)
  if(!target) return { ok: false, error: 'That user no longer exists.' }
  // Match on username: offline sign-ins have no numeric id to compare against.
  if(currentUsername && target.username.toLowerCase() === currentUsername.trim().toLowerCase()){
    return { ok: false, error: 'You cannot delete the account you are signed in with.' }
  }
  const adminsLeft = users.filter((u)=> u.role === 'Admin' && u.id !== id).length
  if(target.role === 'Admin' && adminsLeft === 0) return { ok: false, error: 'At least one Admin must remain.' }
  await persist(users.filter((u)=> u.id !== id))
  return { ok: true }
}

/**
 * First run has no accounts at all, which would make "User Management" look broken.
 * Seed it with the account that is currently signed in (as Admin -- there is no
 * server-side role yet, so the signed-in owner is the administrator).
 */
export async function ensureSeed(current: { username?: string; role?: UserRole } | null): Promise<AppUser[]>{
  const users = await listUsers()
  if(users.length) return users
  const username = (current?.username || 'farmer').trim() || 'farmer'
  const seeded: AppUser = {
    id: 'seed',
    username,
    role: current?.role || 'Admin',
    createdAt: new Date().toISOString(),
  }
  await persist([seeded])
  return [seeded]
}