import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, X, Globe } from 'lucide-react'
import logo from '@/assets/logo/logo.png'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductSection } from '@/components/product/ProductSection'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/data/products'
import type { CategoryType } from '@/data/products'
import { cn } from '@/lib/utils'
import { fetchProducts } from '@/services/productService'
import type { Product } from '@/types'

export function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') ?? ''

  const navigate = useNavigate()
  const [active, setActive]     = useState<CategoryType>('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      fetchProducts({
        category: active === 'All' ? undefined : active,
        limit: 50,
      })
        .then((res) => {
          if (!searchQuery.trim()) {
            setProducts(res.products)
          } else {
            const q = searchQuery.trim().toLowerCase()
            setProducts(
              res.products.filter((p) =>
                p.name.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q),
              ),
            )
          }
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [active, searchQuery])

  const helmetTitle = searchQuery
    ? `Search: ${searchQuery} | Rudrashilla`
    : 'Narmadeshwar Shivling – Buy Original Narmadeshwar Shivling Online at Best Price | Rudrashilla'

  return (
    <div className="flex flex-col gap-6 pb-16">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content="Buy 100% original Narmadeshwar Shivling from Maa Narmada River — price from ₹200. Black & natural Shivling and Jaladhari for home temple & puja. Pan-India shipping." />
        <link rel="canonical" href="https://rudrashilla.com/" />
      </Helmet>

      {/* Worldwide delivery banner + Hero — flush, hidden when searching */}
      {!searchQuery && (
        <div>
          {/* International shipping announcement */}
          <div className="bg-primary text-primary-foreground">
            <div className="container mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2.5 md:px-6">
              <Globe className="size-4 shrink-0" />
              <p className="flex-1 text-center text-xs font-medium sm:text-sm">
                We now ship worldwide — authentic Narmadeshwar Shivling delivered to the USA, UK, Canada,
                Australia &amp; Europe via DHL/FedEx.{' '}
                <Link to="/international-shipping" className="underline underline-offset-2 hover:opacity-90">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

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
        </div>
      )}

      {/* Product grid */}
      <section className="container mx-auto max-w-screen-2xl px-4 md:px-6">
        {searchQuery ? (
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-semibold md:text-2xl">
              Results for &ldquo;{searchQuery}&rdquo;
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({products.length} found)
              </span>
            </h2>
            <button
              onClick={() => navigate('/')}
              aria-label="Clear search"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <h2 className="mb-6 text-xl font-semibold md:text-2xl">Featured Products</h2>
        )}

        {/* Category pills — hidden when searching */}
        {!searchQuery && (
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
        )}

        <ProductGrid products={products} loading={loading} />
      </section>

      {/* Category product segments — hidden when searching */}
      {!searchQuery && (
        <>
          <ProductSection
            title="Home Shivling (2–6 inch)"
            viewAllHref="/category/home-shivling"
            category="Shivling"
            shivlingType="home"
          />
          <ProductSection
            title="Mandir Shivling"
            viewAllHref="/category/temple-shivling"
            category="Shivling"
            shivlingType="temple"
          />
        </>
      )}

      {/* SEO content + internal links — hidden when searching */}
      {!searchQuery && (
        <section className="container mx-auto max-w-screen-2xl px-4 md:px-6">
          <div className="mt-8 border-t pt-10">
            <h2 className="mb-4 text-xl font-semibold md:text-2xl">
              Original Narmadeshwar Shivling for Home — Direct from Maa Narmada
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Rudrashilla brings you{' '}
                <Link to="/category/shivling" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  original Narmadeshwar Shivling
                </Link>{' '}
                sourced directly from certified collectors on the banks of the sacred Narmada River.
                Every stone — from the classic brown-banded Banalinga to the rare black Narmadeshwar
                Shivling — is naturally formed, self-consecrated (swayambhu), and ready for home puja
                without any special ceremony.
              </p>
              <p>
                Narmadeshwar Shivling price starts at ₹200 for small 2–4 inch stones ideal for home
                temples, going up to ₹8,000+ for large Shivlings with rare natural markings. Read our{' '}
                <Link to="/blog/buy-shivling-online-india" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  Narmadeshwar Shivling price &amp; buying guide
                </Link>{' '}
                to choose the right size, and learn{' '}
                <Link to="/blog/how-to-identify-original-narmadeshwar-shivling" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  how to identify an original Narmadeshwar Shivling
                </Link>{' '}
                with seven simple authenticity tests.
              </p>
              <p>
                Complete your puja setup with a matching{' '}
                <Link to="/category/jaladhari" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  Jaladhari
                </Link>
                . New to Shivling worship? Start with our step-by-step guide on{' '}
                <Link to="/blog/how-to-do-shivling-abhishek-at-home" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                  how to do Shivling abhishek at home
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section — SEO rich results + helpful for users */}
      {!searchQuery && (
        <section className="container mx-auto max-w-screen-2xl px-4 md:px-6 pb-4">
          <Helmet>
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a Narmadeshwar Shivling?",
                  "acceptedAnswer": { "@type": "Answer", "text": "A Narmadeshwar Shivling is a naturally formed sacred stone found in the Narmada River in India. Unlike man-made Shivlings, these are shaped over thousands of years by the river's current and are considered self-consecrated (swayambhu) — meaning they can be worshipped at home without any special consecration ceremony." }
                },
                {
                  "@type": "Question",
                  "name": "Can I buy Shivling online?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can buy authentic Narmadeshwar Shivling online from Rudrashilla. We source every Shivling directly from certified collectors on the banks of Maa Narmada River and deliver pan-India. Each Shivling is verified for authenticity before listing." }
                },
                {
                  "@type": "Question",
                  "name": "What is the price of Narmadeshwar Shivling?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Narmadeshwar Shivling price ranges from ₹200 for small sizes (2–4 inches) to ₹8,000+ for extra large Shivlings (9+ inches). Price depends on size, weight, and natural markings. Shivlings with rare markings like Nandi or Trishul impressions are priced higher." }
                },
                {
                  "@type": "Question",
                  "name": "What is a Jaladhari and why do I need it?",
                  "acceptedAnswer": { "@type": "Answer", "text": "A Jaladhari is the base vessel in which the Shivling is placed during puja. It collects the abhishek fluid (water, milk, panchamrit) poured over the Shivling and channels it through a spout. No Shivling puja is considered complete without a Jaladhari. The spout should always face north." }
                },
                {
                  "@type": "Question",
                  "name": "Is Narmadeshwar Shivling good for home?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes, Narmadeshwar Shivling is ideal for home worship. Unlike other Shivlings, it does not require consecration before worship — any family member can perform daily puja. According to Vastu Shastra, placing it in the northeast corner of the puja room brings positive energy and removes Vastu doshas." }
                },
                {
                  "@type": "Question",
                  "name": "How do I identify an original Narmadeshwar Shivling?",
                  "acceptedAnswer": { "@type": "Answer", "text": "An original Narmadeshwar Shivling is naturally smooth (not artificially polished), feels surprisingly heavy for its size, remains cool to the touch, has a natural elliptical shape, and may have organic markings or patterns. It should never have painted markings or machine-cut edges." }
                },
                {
                  "@type": "Question",
                  "name": "What is a black Narmadeshwar Shivling?",
                  "acceptedAnswer": { "@type": "Answer", "text": "A black Narmadeshwar Shivling is a naturally dark-coloured Narmada river stone, formed from fine-grained basalt. The deep black or dark brown colour is completely natural — never painted or dyed. Black Narmadeshwar Shivlings are as sacred as the classic brown-banded ones and are especially popular for home temples." }
                },
              ]
            })}</script>
          </Helmet>
          <div className="mt-8 border-t pt-10">
            <h2 className="mb-6 text-xl font-semibold md:text-2xl">Frequently Asked Questions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { q: 'What is a Narmadeshwar Shivling?', a: 'A Narmadeshwar Shivling is a naturally formed sacred stone from the Narmada River, shaped over thousands of years by the river\'s current. It is self-consecrated — worship can begin immediately without any special ceremony.' },
                { q: 'Can I buy Shivling online?', a: 'Yes. Rudrashilla ships authentic Narmadeshwar Shivling pan-India. Every Shivling is sourced directly from certified collectors on the banks of Maa Narmada River and verified for authenticity.' },
                { q: 'What is the price of Narmadeshwar Shivling?', a: 'Price ranges from ₹200 for small sizes (2–4 inch) to ₹8,000+ for extra large Shivlings. Price depends on size, weight, and natural markings like Nandi or Trishul impressions.' },
                { q: 'What is a Jaladhari and why do I need it?', a: 'A Jaladhari is the base vessel that holds the Shivling during puja and collects the abhishek fluid. The spout should always face north. No Shivling puja is complete without a Jaladhari.' },
                { q: 'Is Narmadeshwar Shivling good for home worship?', a: 'Yes — it is the most recommended Shivling for home temples. No consecration needed, suitable for all family members, and excellent for Vastu when placed in the northeast corner of the puja room.' },
                { q: 'How to identify original Narmadeshwar Shivling?', a: 'Authentic Shivlings are naturally smooth, feel heavy for their size, stay cool to the touch, have a natural elliptical shape, and show organic markings. Avoid stones with painted markings or machine-cut edges.' },
                { q: 'What is a black Narmadeshwar Shivling?', a: 'A naturally dark Narmada stone formed from fine-grained basalt. The black colour is completely natural — never painted. Black Narmadeshwar Shivlings are equally sacred and very popular for home temples.' },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-lg border bg-muted/30 p-4">
                  <h3 className="font-medium text-sm md:text-base">{q}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
