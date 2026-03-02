import React, { createContext, useContext, useReducer } from 'react'
import type { CartState, CartAction, Product } from '@/types'

const initialState: CartState = { items: [], isOpen: false }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex(
        (i) =>
          i.product.id === action.payload.product.id &&
          i.selectedSize === action.payload.selectedSize &&
          i.selectedColor === action.payload.selectedColor,
      )
      if (idx >= 0) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((item, i) =>
            i === idx
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      }
      return { ...state, isOpen: true, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.product.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

interface CartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, qty?: number, size?: string, color?: string) => void
  removeFromCart: (id: string) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addToCart = (
    product: Product,
    qty = 1,
    size?: string,
    color?: string,
  ) =>
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity: qty, selectedSize: size, selectedColor: color },
    })

  const removeFromCart = (id: string) =>
    dispatch({ type: 'REMOVE_ITEM', payload: id })

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = state.items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{ state, dispatch, addToCart, removeFromCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
