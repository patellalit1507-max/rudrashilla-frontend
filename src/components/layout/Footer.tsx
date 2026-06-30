import { Link } from 'react-router-dom'

const LINKS = {
  Shop:    ['New Arrivals', 'Home Shivling', 'Temple Shivling', 'Jaladhari', 'Sale'],
  Help:    ['International Shipping', 'Shipping & Returns', 'Size Guide', 'FAQ', 'Contact Us', 'Track Order'],
  Company: ['About Us', 'Careers', 'Press', 'Sustainability', 'Privacy Policy'],
}

// Map known labels to real routes; everything else falls back to '#'.
const HREFS: Record<string, string> = {
  'International Shipping': '/international-shipping',
  Shivling: '/category/shivling',
  'Home Shivling': '/category/home-shivling',
  'Temple Shivling': '/category/temple-shivling',
  Jaladhari: '/category/jaladhari',
  FAQ: '/#faq',
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto max-w-screen-2xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="mb-3 text-sm font-semibold">{heading}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      to={HREFS[item] ?? '#'}
                      className="transition-colors hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Stay Connected</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get the latest drops and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Join
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rudra. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
