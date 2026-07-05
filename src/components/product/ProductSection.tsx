import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from './ProductGrid'
import { Button } from '@/components/ui/button'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

interface ProductSectionProps {
  /** Section heading shown above the grid */
  title: string
  /** Category page the "View all" button points to (e.g. /category/home-shivling) */
  viewAllHref: string
  category?: string
  shivlingType?: 'home' | 'temple'
  sort?: string
  /** How many products to show in this section (default 4 — one row) */
  limit?: number
}

/**
 * A self-contained home-page product row: heading + one row of products +
 * a prominent "View all" button linking to the full category page.
 * Fetches its own products so each section on the Home page is independent.
 * Renders nothing when the section has no products, keeping the page clean.
 */
export function ProductSection({
  title,
  viewAllHref,
  category,
  shivlingType,
  sort,
  limit = 4,
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProducts({ category, shivlingType, sort, limit })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.products)
          setTotal(res.total)
        }
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
      <h2 className="mb-6 text-xl font-semibold md:text-2xl">{title}</h2>

      <ProductGrid products={products} loading={loading} />

      {!loading && total > products.length && (
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="px-10 text-base font-semibold shadow-sm">
            <Link to={viewAllHref}>
              View all {total} products <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
