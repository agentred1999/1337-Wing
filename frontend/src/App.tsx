import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import type { HTMLAttributes } from 'react'
import { CartProvider, useCart } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import BootScreen from './components/BootScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import OrderConfirmModal from './components/OrderConfirmModal'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import BioPage from './pages/BioPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'
import ThinkPad701CPage from './pages/ThinkPad701CPage'
import SecurityPage from './pages/SecurityPage'

// Auth pages stay lazy-loaded: less frequently visited, and keeping them
// split avoids shipping auth logic to every visitor who never logs in.
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

function AppShell() {
  const { cartOpen } = useCart()
  // @ts-expect-error - 'inert' is a valid HTML attribute but missing from @types/react 18.3.31's JSX typings
  const shellProps: HTMLAttributes<HTMLDivElement> = { inert: cartOpen }
  return (
    <>
      <div {...shellProps}>
        <BootScreen />
        <Navbar />
        <main id="main-content">
          <Suspense fallback={<div className="route-loading" role="status">&gt; loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/bio" element={<BioPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/thinkpad-701c" element={<ThinkPad701CPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <CartModal />
      <OrderConfirmModal />
      <Toast />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  )
}
