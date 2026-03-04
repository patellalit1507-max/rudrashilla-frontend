import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { MainLayout } from '@/layouts/MainLayout'
import { Home } from '@/pages/Home'
import { Cart } from '@/pages/Cart'
import { ProductDetail } from '@/pages/ProductDetail'
import { Category } from '@/pages/Category'
import { Checkout } from '@/pages/Checkout'
import { Blog } from '@/pages/Blog'
import { BlogPost } from '@/pages/BlogPost'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH ?? '/'}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
