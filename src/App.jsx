import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import BootScreen from './components/BootScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartModal from './components/CartModal'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import BioPage from './pages/BioPage'

export default function App() {
  return (
    <CartProvider>
      <BootScreen />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/bio" element={<BioPage />} />
      </Routes>
      <Footer />
      <CartModal />
    </CartProvider>
  )
}
