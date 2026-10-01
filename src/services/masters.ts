import * as api from './api'
import type { Dealer, Item } from '../types/masters'

export async function getDealers(): Promise<Dealer[]> {
  try {
    const res = await api.getDealers()
    return Array.isArray(res) ? res.map((d: any) => ({
      id: d.id,
      name: d.name,
      phone: d.phone || '',
      address: d.address || '',
      city: d.city || '',
      notes: d.notes || '',
      createdAt: d.created_at || d.createdAt || new Date().toISOString(),
    })) : []
  } catch (error) {
    console.warn('getDealers API failed, fallback empty:', error)
    return []
  }
}

export async function addDealer(dealer: Omit<Dealer, 'id'> & { id?: string }): Promise<Dealer> {
  const res = await api.addDealer({
    id: dealer.id,
    name: dealer.name,
    phone: dealer.phone,
    address: dealer.address,
    city: dealer.city,
    notes: dealer.notes,
  })

  const created = {
    id: res?.id || dealer.id || String(Date.now()),
    name: dealer.name,
    phone: dealer.phone || '',
    address: dealer.address || '',
    city: dealer.city || '',
    notes: dealer.notes || '',
    createdAt: new Date().toISOString(),
  }

  return created
}

export async function getItems(): Promise<Item[]> {
  try {
    const res = await api.getItems()
    return Array.isArray(res) ? res.map((i: any) => ({
      id: i.id,
      name: i.name,
      unit: i.unit || 'kg',
      rate: Number(i.rate || 0),
      category: i.category || 'Vegetable',
      notes: i.notes || '',
      createdAt: i.created_at || i.createdAt || new Date().toISOString(),
    })) : []
  } catch (error) {
    console.warn('getItems API failed, fallback empty:', error)
    return []
  }
}

export async function addItemMaster(item: Omit<Item, 'id'> & { id?: string }): Promise<Item> {
  const res = await api.addItemMaster({
    id: item.id,
    name: item.name,
    unit: item.unit,
    rate: item.rate,
    category: item.category,
    notes: item.notes,
  })

  const created = {
    id: res?.id || item.id || String(Date.now()),
    name: item.name,
    unit: item.unit || 'kg',
    rate: Number(item.rate || 0),
    category: item.category || 'Vegetable',
    notes: item.notes || '',
    createdAt: new Date().toISOString(),
  }

  return created
}

export async function saveDealers(list: Dealer[]) {
  return list
}

export async function saveItems(list: Item[]) {
  return list
}

export async function getDealerById(id?: string): Promise<Dealer | undefined> {
  if (!id) return undefined
  const list = await getDealers()
  return list.find(d => d.id === id)
}

export async function getItemById(id?: string): Promise<Item | undefined> {
  if (!id) return undefined
  const list = await getItems()
  return list.find(i => i.id === id)
}
