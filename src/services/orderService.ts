import { apiFetch } from '@/lib/api'
import type { CartItem } from '@/types'

export interface PlaceOrderResult {
  orderId: string
  totalAmount: number
  status: string
}

export interface OrderForm {
  name: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
}

export async function placeOrder(form: OrderForm, items: CartItem[]): Promise<PlaceOrderResult> {
  return apiFetch<PlaceOrderResult>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer: { name: form.name, phone: form.phone },
      address: {
        line1: form.addressLine1,
        line2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize ?? null,
        selectedColor: item.selectedColor ?? null,
      })),
    }),
  })
}
