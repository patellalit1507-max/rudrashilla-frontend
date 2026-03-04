import { Outlet } from 'react-router-dom'
import { Truck, House } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { FloatingActions } from '@/components/common/FloatingActions'

function TrustBar() {
  return (
    <div className="w-full border-b border-[#E6E2DA] bg-[#F6F4EF]">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-center gap-6 overflow-x-auto px-4 text-[14px] font-medium text-[#4A4A4A] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        <div className="flex shrink-0 items-center gap-2">
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
  )
}

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <TrustBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MiniCart />
      <FloatingActions />
    </div>
  )
}
