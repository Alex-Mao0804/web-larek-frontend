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
  preview: string | null 
  addProduct: (product: IProductItem) => void //setter
  getProduct: (productId: string) => IProductItem | undefined 
  getCatalog: () => IProductItem[] //getter
}

export type TPaymentMethod = 'Онлайн' | 'При получении'

export interface IOrder {
  payment: TPaymentMethod
  email: string
  phone: string
  address: string
  total: number
  items: string[]
}

export type TOrderForm1 = Pick<IOrder, 'payment' | 'address'>
export type TOrderForm2 = Pick<IOrder, 'email' | 'phone'>

export interface ICustomerData {
  payment: string
  address: string
  email: string
  phone: string
  setPaymentAndDelivery(payment: TPaymentMethod, delivery: string): void
  setContactInfo(email: string, phone: string): void
  clearData(): void
  getCustomerData(): object
}

export type TBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'>

export interface IBasketData {
  items: IProductItem[]
  total: number
  addItem: (item: IProductItem) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getItems: () => IProductItem[]
  getTotal:() => number
}


