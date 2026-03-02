import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import logo from '@/assets/logo/logo.png'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/data/products'
import type { CategoryType } from '@/data/products'
import { cn } from '@/lib/utils'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

export function Home() {
  const [active, setActive] = useState<CategoryType>('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Debounce: wait 300ms after the last pill click before hitting the API.
    // Prevents rapid clicks from firing multiple concurrent requests.
    const timer = setTimeout(() => {
      fetchProducts({ category: active === 'All' ? undefined : active, limit: 50 })
        .then((res) => setProducts(res.products))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [active])

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Hero Banner */}
      <section id="hero-banner" className="bg-muted/40">
        <div className="container mx-auto max-w-screen-2xl px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-center gap-8 px-6 lg:px-8">
            {/* Text — 60% on desktop, full width on mobile */}
            <div className="flex-[6.5] min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                NARMADESHWAR SHIVLING COLLECTION
              </span>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Narmadeshwar Shivling from Maa Narmada
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Authentic Narmadeshwar Shivling from the sacred Narmada River — perfect for home temple, puja, and Vastu.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/category/new">Shop Shivling Collection</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/category/sale">
                    View Sale <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Logo image — 40% on desktop, hidden on mobile */}
            <div className="hidden md:flex flex-[2.5] items-center">
              <img
                src={logo}
                alt="Rudrashila"
                className="h-auto w-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="container mx-auto max-w-screen-2xl px-4 md:px-6">
        <h2 className="mb-6 text-xl font-semibold md:text-2xl">
          Featured Products
        </h2>

        {/* Category pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                active === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <ProductGrid products={products} loading={loading} />
      </section>
    </div>
  )
}
