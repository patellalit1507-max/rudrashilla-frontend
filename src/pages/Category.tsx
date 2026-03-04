import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

// Map URL slug → display name & API category value
const SLUG_MAP: Record<string, { label: string; category?: string; sort?: string }> = {
  'new':           { label: 'New Arrivals',   sort: 'newest' },
  'shivling':      { label: 'Shivling',        category: 'Shivling' },
  'jaladhari':     { label: 'Jaladhari',       category: 'Jaladhari' },
  'trishul':       { label: 'Trishul',         category: 'Trishul' },
  'abhishek-patra':{ label: 'Abhishek Patra',  category: 'Abhishek Patra' },
  'sale':          { label: 'Sale',            sort: 'sale' },
}

export function Category() {
  const { slug = '' } = useParams<{ slug: string }>()
  const meta = SLUG_MAP[slug] ?? { label: slug.replace(/-/g, ' ') }

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProducts({ category: meta.category, sort: meta.sort, limit: 50 })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 md:px-6">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium capitalize text-foreground">{meta.label}</span>
      </nav>

      {/* Heading */}
      <h1 className="mb-8 text-2xl font-bold capitalize md:text-3xl">{meta.label}</h1>

      {/* Products */}
      <ProductGrid products={products} loading={loading} />

      {/* Empty state (after load) */}
      {!loading && products.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No products found in this category yet.</p>
          <Link to="/" className="mt-4 inline-block text-sm underline hover:text-foreground">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  )
}
