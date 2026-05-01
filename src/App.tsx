import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
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
import AdminLogin from './pages/AdminLogin'
import MyInquiriesPage from './pages/MyInquiriesPage'
import ChatWidget from './components/ChatWidget'
import SalesmartlyChat from './components/SalesmartlyChat'
import TidioChat from './components/TidioChat'
import WhatsAppCallback from './components/WhatsAppCallback'
import TrustBanner from './components/sections/TrustBanner'

function AppContent({ isAuthenticated, handleLogin }: { isAuthenticated: boolean; handleLogin: () => void }) {
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

  // Check authentication on mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated')
    if (authenticated === 'true') {
      // Already handled in App component
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {showBanner && <TrustBanner onClose={handleCloseBanner} />}
      <Navbar />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<CasesPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/my-inquiries" element={<MyInquiriesPage />} />
          {/* Admin routes with authentication */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            } 
          />
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  return (
    <HelmetProvider>
      <Router>
        <LanguageProvider>
          <AppContent isAuthenticated={isAuthenticated} handleLogin={handleLogin} />
        </LanguageProvider>
      </Router>
    </HelmetProvider>
  )
}

export default App
