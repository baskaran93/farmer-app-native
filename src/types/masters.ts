export type Dealer = {
  id: string
  name: string
  phone?: string
  address?: string
  city?: string
  notes?: string
  createdAt?: string
}

export type Item = {
  id: string
  name: string
  unit?: string
  rate?: number
  category?: string
  notes?: string
  createdAt?: string
}

export type SaleItem = {
  id: string
  saleId: string
  itemId: string
  itemName: string
  qty: number
  rate: number
  amount: number
  createdAt?: string
}

export type SaleRecord = {
  id: string
  dealerId?: string
  dealerName?: string
  date: string
  totalAmount: number
  notes?: string
  createdAt?: string
}
