import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ChevronRight,
  Globe,
  PackageCheck,
  ShieldCheck,
  Truck,
  Plane,
  ScrollText,
  BadgeCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const TRUST_BADGES = [
  { icon: ShieldCheck, label: '100% Authentic', sub: 'Sourced from Maa Narmada' },
  { icon: PackageCheck, label: 'Secure Packaging', sub: 'Cushioned for fragile stones' },
  { icon: Plane, label: 'DHL / FedEx', sub: 'Full door-to-door tracking' },
  { icon: BadgeCheck, label: 'Safe-Arrival Promise', sub: 'Free reshipment if damaged' },
]

const DESTINATIONS = [
  { region: 'United States', time: '5–10 business days', carrier: 'DHL Express / FedEx' },
  { region: 'Canada', time: '6–11 business days', carrier: 'DHL Express / FedEx' },
  { region: 'United Kingdom', time: '5–9 business days', carrier: 'DHL Express' },
  { region: 'Europe (EU)', time: '6–11 business days', carrier: 'DHL Express' },
  { region: 'Australia & New Zealand', time: '7–12 business days', carrier: 'DHL Express / FedEx' },
  { region: 'UAE & Middle East', time: '4–8 business days', carrier: 'DHL Express' },
  { region: 'Singapore & SE Asia', time: '5–9 business days', carrier: 'DHL Express' },
  { region: 'Rest of World', time: '8–15 business days', carrier: 'DHL Express / FedEx' },
]

const STEPS = [
  {
    icon: Sparkles,
    title: 'Carefully Sourced',
    text: 'Every Shivling is hand-selected from certified collectors on the banks of the sacred Narmada River and verified for authenticity before it is reserved for you.',
  },
  {
    icon: PackageCheck,
    title: 'Sacred Packaging',
    text: 'Each stone is wrapped in soft protective cushioning, double-boxed, and sealed for the journey — premium packaging built for fragile, divine items.',
  },
  {
    icon: Plane,
    title: 'Shipped Worldwide',
    text: 'We dispatch via DHL Express or FedEx with full door-to-door tracking, so your sacred Shivling reaches you swiftly and safely, wherever you are.',
  },
  {
    icon: ShieldCheck,
    title: 'Delivered with Care',
    text: 'You receive live tracking updates at every step. If anything arrives damaged, we reship it free — your devotion should never be interrupted.',
  },
]

const FAQS = [
  {
    q: 'Do you ship Narmadeshwar Shivling internationally?',
    a: 'Yes. Rudrashilla ships authentic Narmadeshwar Shivling worldwide — including the USA, UK, Canada, Australia, Europe, the Middle East, and Asia — via DHL Express and FedEx with full tracking.',
  },
  {
    q: 'How long does international delivery take?',
    a: 'Most international orders are delivered within 5–12 business days after dispatch. Orders to the USA, UK, and UAE typically arrive in 5–10 business days. You will receive a tracking number as soon as your order ships.',
  },
  {
    q: 'How is a fragile sacred Shivling packaged for shipping?',
    a: 'Each Shivling is individually cushioned, wrapped in protective material, and double-boxed in premium packaging designed for fragile stone items. Our packaging is built to protect your sacred item across thousands of miles.',
  },
  {
    q: 'Will I have to pay customs duties or import taxes?',
    a: 'Depending on your country, local customs duties or import taxes may apply on arrival and are set by your government, not by Rudrashilla. These are not included in the product price or shipping fee. We declare every parcel accurately so customs clearance is smooth.',
  },
  {
    q: 'Can I track my international order?',
    a: 'Absolutely. Every international shipment includes full door-to-door DHL or FedEx tracking. We email your tracking number the moment your Shivling is dispatched so you can follow its sacred journey to your door.',
  },
  {
    q: 'What if my Shivling arrives damaged?',
    a: 'In the rare event your item is damaged in transit, simply send us photos within 48 hours of delivery and we will reship a replacement free of charge under our Safe-Arrival Promise.',
  },
]

export function InternationalShipping() {
  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8 md:px-6 md:py-12">
      <Helmet>
        <title>International Shipping — Worldwide Delivery of Authentic Narmadeshwar Shivling | Rudrashilla</title>
        <meta
          name="description"
          content="Rudrashilla ships authentic Narmadeshwar Shivling worldwide — USA, UK, Canada, Australia & Europe — via DHL & FedEx with full tracking, secure premium packaging, and a Safe-Arrival Promise."
        />
        <link rel="canonical" href="https://rudrashilla.com/international-shipping" />
        <meta property="og:title" content="International Shipping — Worldwide Delivery | Rudrashilla" />
        <meta
          property="og:description"
          content="Authentic Narmadeshwar Shivling from Maa Narmada, shipped worldwide via DHL & FedEx with full tracking and secure packaging."
        />
        <meta property="og:url" content="https://rudrashilla.com/international-shipping" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">International Shipping</span>
      </nav>

      {/* Hero */}
      <section className="rounded-2xl border border-border bg-muted/40 p-6 md:p-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Globe className="size-3.5" /> Worldwide Delivery
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Authentic Narmadeshwar Shivling, Delivered to Your Doorstep — Anywhere in the World
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Wherever you offer your prayers, the sacred presence of Maa Narmada can be with you. We ship
          our carefully sourced, 100% authentic Narmadeshwar Shivling worldwide — to the USA, UK, Canada,
          Australia, Europe and beyond — through DHL and FedEx, with full tracking and secure premium
          packaging for these fragile, divine items.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to="/category/shivling">Shop Shivling Collection</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/blog">
              Read Buying Guide <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Trust badges */}
      <section className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-5">
            <Icon className="size-6 text-primary" />
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="mb-2 text-2xl font-bold md:text-3xl">From the Banks of Maa Narmada to Your Home Temple</h2>
        <p className="mb-8 max-w-2xl text-muted-foreground">
          Every order follows a sacred, carefully handled journey — sourced with reverence, packed with
          care, and shipped with the world&rsquo;s most trusted couriers.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery times */}
      <section className="mt-14">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <Truck className="size-6 text-primary" /> Delivery Times & Carriers
        </h2>
        <p className="mb-6 max-w-2xl text-muted-foreground">
          Estimated transit times after dispatch. Every shipment travels with DHL Express or FedEx and
          includes full door-to-door tracking.
        </p>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Destination</th>
                <th className="px-4 py-3 font-semibold">Estimated Delivery</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Carrier</th>
              </tr>
            </thead>
            <tbody>
              {DESTINATIONS.map(({ region, time, carrier }) => (
                <tr key={region} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{region}</td>
                  <td className="px-4 py-3 text-muted-foreground">{time}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{carrier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Estimated times are after dispatch and may vary slightly during festivals, peak seasons, or
          customs inspection.
        </p>
      </section>

      {/* Duties & taxes */}
      <section className="mt-14">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <ScrollText className="size-6 text-primary" /> Duties, Taxes & Transparency
        </h2>
        <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            We believe in complete honesty about cross-border costs. The price you pay at checkout covers
            your sacred Shivling and its secure international shipping. Depending on your country, your
            local customs authority may charge import duties or taxes when the parcel arrives — these are
            set by your government, not by Rudrashilla, and are the responsibility of the recipient.
          </p>
          <p>
            We declare every parcel accurately and completely so it clears customs smoothly. If you have
            questions about duties for your country before ordering, simply reach out and our team will be
            glad to help you plan ahead.
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="mt-14">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center md:p-8">
          <ShieldCheck className="size-10 shrink-0 text-primary" />
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Our Safe-Arrival Promise</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              We stand behind every sacred item we send. If your Shivling arrives damaged, send us photos
              within 48 hours and we will reship a replacement free of charge. Authentic, carefully sourced
              from Maa Narmada, and guaranteed to reach you with its divine integrity intact.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">International Shipping FAQ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="rounded-lg border border-border bg-muted/30 p-5">
              <h3 className="text-sm font-medium md:text-base">{q}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 rounded-2xl border border-border bg-muted/40 p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">Bring the Sacred Narmada Into Your Home</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
          Authentic Narmadeshwar Shivling, carefully sourced from Maa Narmada and shipped worldwide with
          love, care, and full tracking. Your divine journey begins today.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/category/shivling">
              Shop Now <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
