import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CartProvider, useCart } from './context/CartContext'
import BootScreen from './components/BootScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'

const ProductPage = lazy(() => import('./pages/ProductPage'))
const BioPage = lazy(() => import('./pages/BioPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function AppShell() {
  const { cartOpen } = useCart()

  return (
    <>
      <div inert={cartOpen ? '' : undefined}>
        <BootScreen />
        <Navbar />
        <main id="main-content">
          <Suspense fallback={<div className="route-loading" role="status">&gt; loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/bio" element={<BioPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <CartModal />
      <Toast />
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  )
}
