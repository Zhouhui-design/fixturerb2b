import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CasesPage from './pages/CasesPage'
import CaseDetailPage from './pages/CaseDetailPage'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminDashboard from './pages/AdminDashboard'
import ChatWidget from './components/ChatWidget'
import SalesmartlyChat from './components/SalesmartlyChat'
import TidioChat from './components/TidioChat'
import WhatsAppCallback from './components/WhatsAppCallback'
import TrustBanner from './components/sections/TrustBanner'

function AppContent() {
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const bannerClosed = localStorage.getItem('bannerClosed')
    if (bannerClosed === 'true') {
      setShowBanner(false)
    }
  }, [])

  const handleCloseBanner = () => {
    setShowBanner(false)
    localStorage.setItem('bannerClosed', 'true')
  }

  return (
    <div className="min-h-screen bg-background">
      {showBanner && <TrustBanner onClose={handleCloseBanner} />}
      <Navbar />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
      {/* SaleSmartly Chat - Already registered */}
      <SalesmartlyChat projectId={import.meta.env.VITE_SALESMARTLY_PROJECT_ID || ''} />
      {/* Tidio -备用选项，暂时注释 */}
      {/* <TidioChat publicKey={import.meta.env.VITE_TIDIO_PUBLIC_KEY || ''} /> */}
      {/* WhatsApp Callback Request - 备用选项 */}
      {/* <WhatsAppCallback /> */}
    </div>
  )
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  )
}

export default App
