import { apiFetch } from '@/lib/api'
import type { Product } from '@/types'

// Map backend _id → frontend id
function mapProduct(p: Record<string, unknown>): Product {
  return { ...(p as unknown as Product), id: p._id as string }
}

export interface ProductsResult {
  products: Product[]
  total: number
  page: number
  pages: number
}

export async function fetchProducts(params?: {
  category?: string
  sort?: string
  page?: number
  limit?: number
}): Promise<ProductsResult> {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.sort)     qs.set('sort', params.sort)
  if (params?.page)     qs.set('page', String(params.page))
  if (params?.limit)    qs.set('limit', String(params.limit))

  const data = await apiFetch<{ products: Record<string, unknown>[]; total: number; page: number; pages: number }>(
    `/products?${qs}`
  )
  return { ...data, products: data.products.map(mapProduct) }
}

export async function fetchProduct(id: string): Promise<Product> {
  const data = await apiFetch<Record<string, unknown>>(`/products/${id}`)
  return mapProduct(data)
}
