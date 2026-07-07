import { apiFetch } from '@/lib/api'
import type { Review } from '@/data/reviews'

function initials(name: string): string {
  return name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2)
}

function mapReview(r: Record<string, unknown>): Review {
  return {
    id: r._id as string,
    productId: r.productId as string,
    author: r.author as string,
    initials: initials(r.author as string),
    rating: r.rating as number,
    date: r.createdAt as string,
    title: r.title as string,
    body: r.body as string,
    verified: r.verified as boolean,
  }
}

/** Submit a general site testimonial (not tied to any product). */
export async function submitSiteReview(input: {
  author: string
  rating: number
  body: string
}): Promise<void> {
  await apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

/** Verified general testimonials submitted by customers via the home page. */
export async function fetchSiteReviews(): Promise<Review[]> {
  const data = await apiFetch<{ reviews: Record<string, unknown>[] }>('/reviews/site')
  return data.reviews.map(mapReview)
}

export async function fetchReviews(productId: string): Promise<{
  reviews: Review[]
  averageRating: number
  total: number
}> {
  const data = await apiFetch<{
    reviews: Record<string, unknown>[]
    averageRating: number
    total: number
  }>(`/reviews/${productId}`)
  return { ...data, reviews: data.reviews.map(mapReview) }
}
