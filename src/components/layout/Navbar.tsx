import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react'
import logo from '@/assets/logo/logo.png'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavLink = {
  label: string
  to: string
  children?: { label: string; to: string }[]
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home',  to: '/' },
  { label: 'New',   to: '/category/new' },
  {
    label: 'Shivling',
    to: '/category/shivling',
    children: [
      { label: 'Home Shivling (2–6 inch)',   to: '/category/home-shivling' },
      { label: 'Temple Shivling (6 inch+)',  to: '/category/temple-shivling' },
    ],
  },
  { label: 'Jaladhari',      to: '/category/jaladhari' },
  { label: 'Sale',           to: '/category/sale' },
  { label: 'Blog',           to: '/blog' },
]


export function Navbar() {
  const { totalItems, dispatch } = useCart()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  function handleSearchSubmit(e: React.SyntheticEvent) {
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
            {NAV_LINKS.map(({ label, to, children }) =>
              children ? (
                <div key={to} className="group relative">
                  <Link
                    to={to}
                    className="flex items-center gap-1 text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {label}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  {/* Hover/focus dropdown */}
                  <div className="invisible absolute left-0 top-full z-50 min-w-56 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-lg border border-border bg-background p-1.5 shadow-lg">
                      {children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block rounded-md px-3 py-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={to}
                  to={to}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ),
            )}
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

        {/* ── Mobile nav drawer ────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium">
              {NAV_LINKS.map(({ label, to, children }) => (
                <div key={to}>
                  <Link
                    to={to}
                    className="block py-1 text-foreground/70 transition-colors hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                  {children && (
                    <div className="ml-3 mt-2 flex flex-col gap-2 border-l border-border pl-3">
                      {children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="py-0.5 text-foreground/60 transition-colors hover:text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
                placeholder="Search Shivling, Jaladhari…"
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
