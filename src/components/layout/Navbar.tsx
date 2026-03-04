import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Truck, House } from 'lucide-react'
import logo from '@/assets/logo/logo.png'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'New',            to: '/category/new' },
  { label: 'Shivling',       to: '/category/shivling' },
  { label: 'Jaladhari',      to: '/category/jaladhari' },
  { label: 'Trishul',        to: '/category/trishul' },
  { label: 'Abhishek Patra', to: '/category/abhishek-patra' },
  { label: 'Sale',           to: '/category/sale' },
]


export function Navbar() {
  const { totalItems, dispatch } = useCart()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      navigate(`/?search=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

        {/* ── Main nav row ─────────────────────────────────────────────── */}
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

          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <img src={logo} alt="Rudrashila logo" className="h-8 w-auto" />
              <span className="text-lg font-bold tracking-tight">Rudrashila</span>
            </Link>
          </div>

          {/* Desktop nav */}
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

          {/* Right actions */}
          <div className="flex flex-1 items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
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

        {/* ── Trust bar ────────────────────────────────────────────────── */}
        <div className="w-full border-b border-[#E6E2DA] bg-[#F6F4EF]" style={{ minHeight: '48px' }}>
          <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-center gap-6 overflow-x-auto px-4 text-[14px] font-medium text-[#4A4A4A] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            <div className="flex shrink-0 items-center gap-2">
              {/* Trishul / trident icon */}
              <svg className="size-4 shrink-0 text-[#8A6B3D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 22V8" />
                <path d="M8 8c0-2 1.5-4 4-4s4 2 4 4" />
                <path d="M6 6c-.5-1.5 0-3.5 2-4" />
                <path d="M18 6c.5-1.5 0-3.5-2-4" />
                <path d="M6 6l2 2" />
                <path d="M18 6l-2 2" />
              </svg>
              <span>Authentic Narmada River Stones</span>
            </div>

            <div className="h-4 w-px shrink-0 bg-[#D8D2C7]" />

            <div className="flex shrink-0 items-center gap-2">
              <Truck className="size-4 shrink-0 text-[#8A6B3D]" aria-hidden />
              <span>Pan-India Shipping</span>
            </div>

            <div className="h-4 w-px shrink-0 bg-[#D8D2C7]" />

            <div className="flex shrink-0 items-center gap-2">
              <House className="size-4 shrink-0 text-[#8A6B3D]" aria-hidden />
              <span>Ideal for Home Temple &amp; Puja</span>
            </div>

          </div>
        </div>

        {/* ── Mobile nav drawer ────────────────────────────────────────── */}
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

      {/* ── Search overlay ───────────────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mx-auto mt-24 max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Shivling, Trishul, Abhishek Patra…"
                className="w-full rounded-xl border border-border bg-background py-4 pl-12 pr-12 text-base shadow-2xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label="Close search"
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </form>
            <p className="mt-3 text-center text-xs text-white/70">
              Press Enter to search · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  )
}
