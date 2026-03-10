export interface Product {
  id: string
  slug?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  rating: number
  reviewCount: number
  badge?: 'sale' | 'new' | 'hot'
  description: string
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export type CartAction =
  | { type: 'ADD_ITEM';        payload: CartItem }
  | { type: 'REMOVE_ITEM';     payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
