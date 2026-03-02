import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import logo from '@/assets/logo/logo.png'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'New',       to: '/category/new' },
  { label: 'Shivling',  to: '/category/shivling' },
  { label: 'Jaladhari', to: '/category/jaladhari' },
  { label: 'Somasutra', to: '/category/somasutra' },
  { label: 'Sale',      to: '/category/sale' },
]

export function Navbar() {
  const { totalItems, dispatch } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4 md:px-6">

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        {/* Logo — left third */}
        <div className="flex flex-1 items-center">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
          >
            <img src={logo} alt="Rudrashila logo" className="h-8 w-auto" />
            <span className="text-lg font-bold tracking-tight">Rudrashila</span>
          </Link>
        </div>

        {/* Desktop nav — true center */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions — right third */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Cart, ${totalItems} items`}
            onClick={() => dispatch({ type: 'OPEN_CART' })}
          >
            <ShoppingBag className="size-5" />
            {totalItems > 0 && (
              <span
                className={cn(
                  'absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center',
                  'rounded-full bg-primary text-[10px] font-bold text-primary-foreground',
                )}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="py-1 text-foreground/70 transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
