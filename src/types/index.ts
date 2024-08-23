// Товар
export interface IProductItem {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

// Каталог товаров
export interface IProductListData {
  products: IProductItem[]
  getProduct: (productId: string) => IProductItem | undefined 
}

export type TPaymentMethod = 'cash' | 'card'

export interface IOrder {
  payment: TPaymentMethod
  email: string
  phone: string
  address: string
  total: number
  items: string[]
}

export type TCustomerData = Pick<IOrder, 'email' | 'phone' | 'address' | 'payment'>

export interface ICustomerData {
  setPaymentAndDelivery(payment: TPaymentMethod, delivery: string): void
  setContactInfo(email: string, phone: string): void
  clearData(): void
  getCustomerData(): object
}

export interface IBasketData {
  items: IProductItem[]
  total: number
  addItem: (item: IProductItem) => void
  removeItem: (itemId: string) => void
  checkMatch: (itemId: string) => boolean
  clearCart: () => void

}

export interface IApi {
  items: IProductItem[]
  total: number
}