import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from './ProductGrid'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

interface ProductSectionProps {
  /** Section heading shown above the grid */
  title: string
  /** Category page the "View all" link points to (e.g. /category/home-shivling) */
  viewAllHref: string
  category?: string
  shivlingType?: 'home' | 'temple'
  sort?: string
  /** How many products to show in this section (default 8) */
  limit?: number
}

/**
 * A self-contained home-page product row: heading + "View all" link + grid.
 * Fetches its own products so each section on the Home page is independent.
 * Renders nothing when the section has no products, keeping the page clean.
 */
export function ProductSection({
  title,
  viewAllHref,
  category,
  shivlingType,
  sort,
  limit = 8,
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProducts({ category, shivlingType, sort, limit })
      .then((res) => {
        if (!cancelled) setProducts(res.products)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category, shivlingType, sort, limit])

  // Hide the entire section (heading included) when there are no products —
  // avoids empty "No products found" blocks for categories not yet stocked.
  if (!loading && products.length === 0) return null

  return (
    <section className="container mx-auto max-w-screen-2xl px-4 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
        <Link
          to={viewAllHref}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      </div>
      <ProductGrid products={products} loading={loading} />
    </section>
  )
}
