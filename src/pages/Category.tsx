import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

// Map URL slug → display name, API category, SEO title & description
const SLUG_MAP: Record<string, { label: string; category?: string; sort?: string; seoTitle: string; seoDesc: string }> = {
  'new': {
    label: 'New Arrivals', sort: 'newest',
    seoTitle: 'New Arrivals – Latest Narmadeshwar Shivling & Puja Items | Rudrashilla',
    seoDesc: 'Explore the latest Narmadeshwar Shivling, Jaladhari, Abhishek Patra and Trishul arrivals at Rudrashilla. Freshly sourced from Maa Narmada River.',
  },
  'shivling': {
    label: 'Shivling', category: 'Shivling',
    seoTitle: 'Buy Authentic Narmadeshwar Shivling Online | Original Narmada Shivling – Rudrashilla',
    seoDesc: 'Shop 100% authentic Narmadeshwar Shivling directly from Maa Narmada River. Best price on original Narmada Shivling for home temple, puja and Vastu. Pan-India shipping.',
  },
  'jaladhari': {
    label: 'Jaladhari', category: 'Jaladhari',
    seoTitle: 'Buy Shivling Jaladhari Online | Original Jaladhari for Puja – Rudrashilla',
    seoDesc: 'Shop premium quality Jaladhari for Shivling puja. Brass, copper and panchadhatu Jaladhari available. Perfect for home temple setup. Buy online with Pan-India shipping.',
  },
  'trishul': {
    label: 'Trishul', category: 'Trishul',
    seoTitle: 'Buy Sacred Trishul Online | Original Trishul for Home Temple – Rudrashilla',
    seoDesc: 'Shop original Trishul for home temple and worship. Authentic brass and panchadhatu Trishul. Buy Trishul online with Pan-India delivery from Rudrashilla.',
  },
  'abhishek-patra': {
    label: 'Abhishek Patra', category: 'Abhishek Patra',
    seoTitle: 'Buy Abhishek Patra Online | Original Puja Abhishek Patra – Rudrashilla',
    seoDesc: 'Shop authentic Abhishek Patra for daily Shivling puja and rituals. Copper and brass Abhishek Patra available. Buy online with Pan-India shipping.',
  },
  'sale': {
    label: 'Sale', sort: 'sale',
    seoTitle: 'Sale – Discounted Narmadeshwar Shivling & Puja Items | Rudrashilla',
    seoDesc: 'Special offers on Narmadeshwar Shivling, Jaladhari, Abhishek Patra and Trishul. Shop authentic puja items at discounted prices. Limited time offers.',
  },
}

export function Category() {
  const { slug = '' } = useParams<{ slug: string }>()
  const meta = SLUG_MAP[slug] ?? {
    label: slug.replace(/-/g, ' '),
    seoTitle: `${slug.replace(/-/g, ' ')} | Rudrashilla`,
    seoDesc: `Shop authentic ${slug.replace(/-/g, ' ')} from Rudrashilla. Original puja items sourced from Maa Narmada River.`,
  }

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProducts({ category: meta.category, sort: meta.sort, limit: 50 })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug])

  const canonicalSlug = slug === 'abhishek-patra' ? 'abhishek-patra' : slug

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 md:px-6">
      <Helmet>
        <title>{meta.seoTitle}</title>
        <meta name="description" content={meta.seoDesc} />
        <link rel="canonical" href={`https://rudrashilla.com/category/${canonicalSlug}`} />
        <meta property="og:title" content={meta.seoTitle} />
        <meta property="og:description" content={meta.seoDesc} />
        <meta property="og:url" content={`https://rudrashilla.com/category/${canonicalSlug}`} />
      </Helmet>

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

      {/* Empty state */}
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
