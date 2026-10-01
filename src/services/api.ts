const BASE = 'http://localhost:3500/api' // Update with your server IP
// For localhost testing: '10.0.2.2:3500/api' (Android) or 'http://localhost:3500/api' (Web)

async function request(path: string, opts: RequestInit = {}){
  const url = `${BASE}${path}`
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if(res.status === 204) return null
  if(!res.ok) throw new Error(`API ${res.status} ${res.statusText}`)
  return res.json()
}

// Auth
export async function login(username: string, password: string){
  return request('/auth/login', { 
    method: 'POST', 
    body: JSON.stringify({ username, password }) 
  })
}

export async function register(username: string, password: string, email?: string, fullName?: string){
  return request('/auth/register', { 
    method: 'POST', 
    body: JSON.stringify({ username, password, email, fullName }) 
  })
}

// Dealers
export async function getDealers(){
  return request('/dealers')
}

export async function addDealer(dealer: any){
  return request('/dealers', { method: 'POST', body: JSON.stringify(dealer) })
}

export async function updateDealer(id: string, dealer: any){
  return request(`/dealers/${id}`, { method: 'PUT', body: JSON.stringify(dealer) })
}

export async function deleteDealer(id: string){
  return request(`/dealers/${id}`, { method: 'DELETE' })
}

// Items
export async function getItems(){
  return request('/items')
}

export async function addItemMaster(item: any){
  return request('/items', { method: 'POST', body: JSON.stringify(item) })
}

export async function updateItem(id: string, item: any){
  return request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(item) })
}

export async function deleteItem(id: string){
  return request(`/items/${id}`, { method: 'DELETE' })
}

// Sales
export async function getSales(){
  return request('/sales')
}

export async function getSaleById(id: string){
  return request(`/sales/${id}`)
}

export async function addSale(sale: any){
  return request('/sales', { method: 'POST', body: JSON.stringify(sale) })
}

export async function updateSale(id: string, sale: any){
  return request(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(sale) })
}

export async function deleteSale(id: string){
  return request(`/sales/${id}`, { method: 'DELETE' })
}

// Advances
export async function getAdvances(){
  return request('/advances')
}

export async function addAdvance(advance: any){
  return request('/advances', { method: 'POST', body: JSON.stringify(advance) })
}

export async function updateAdvance(id: string, advance: any){
  return request(`/advances/${id}`, { method: 'PUT', body: JSON.stringify(advance) })
}

export async function deleteAdvance(id: string){
  return request(`/advances/${id}`, { method: 'DELETE' })
}

// Legacy
export async function getTransactions(){
  return request('/sales')
}

export async function createTransaction(tx:any){
  return request('/sales', { method: 'POST', body: JSON.stringify(tx) })
}

export async function getInventory(){
  return Promise.resolve([])
}

export async function addInventory(item:any){
  return Promise.resolve(item)
}

export async function getCustomers(){
  return Promise.resolve([])
}

export async function addCustomer(c:any){
  return Promise.resolve(c)
}
