import { apiFetch } from '@/lib/api'

export async function submitEnquiry(data: {
  productId?: string
  productName?: string
  customer: { name: string; phone: string; message?: string }
}): Promise<void> {
  await apiFetch('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
