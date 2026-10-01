import * as api from './api'
import { load, save } from './storage'

async function pushItems(key:string, createFn: (item:any)=>Promise<any>){
  const items = await load<any[]>(key, [])
  for(const it of items){
    try{
      await createFn(it)
    }catch(e){
      // leave item in local storage for future attempts
    }
  }
}

export async function syncAll(){
  // try to push local items (outbox) to backend, then refresh local from server
  try{
    await pushItems('transactions', api.createTransaction)
    await pushItems('inventory', api.addInventory)
    await pushItems('customers', api.addCustomer)

    // fetch authoritative lists and save locally (best-effort)
    try{ const tx = await api.getTransactions(); await save('transactions', tx) }catch{}
    try{ const inv = await api.getInventory(); await save('inventory', inv) }catch{}
    try{ const cus = await api.getCustomers(); await save('customers', cus) }catch{}
  }catch(e){
    // sync failed, will retry later
  }
}

export default { syncAll }
