/** Route names + params for the stack declared in App.tsx (kept in one place so
 *  screens can type their params instead of casting navigation to `any`). */
export type RootStackParamList = {
  Login: undefined
  Dashboard: undefined
  Sales: undefined
  AddSale: { id?: string } | undefined
  SaleDetail: { saleId: string }
  Advances: undefined
  Settlement: undefined
  Reports: undefined
  Menu: undefined
  Settings: undefined
  ChangePassword: undefined
  Users: undefined
  /** id === 'new' opens the form in create mode. */
  UserEdit: { id: string }
  Language: undefined
  Customers: undefined
  Inventory: undefined
  Finance: undefined
  Transactions: undefined
  DealerMaster: undefined
  ItemMaster: undefined
}