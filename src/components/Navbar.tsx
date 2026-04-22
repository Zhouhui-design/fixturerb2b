import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import { useLanguage } from '../contexts/LanguageContext'
import { Language } from '../i18n/translations'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'ar', label: 'العربية' },
    { code: 'pt', label: 'Português' },
    { code: 'ru', label: 'Русский' }
  ]

  const currentLang = languages.find(l => l.code === language)?.label || 'English'

  const handleNavClick = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const isHomePage = location.pathname === '/'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-charcoal/95 shadow-lg border-b border-white/10'
          : 'bg-gradient-to-b from-charcoal/80 to-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Simplified hover effect */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 group"
          >
            <div className="text-white font-bold text-2xl tracking-tight transition-colors duration-300 group-hover:text-wood">
              Fixture<span className="text-wood group-hover:text-white transition-colors duration-300">RB2B</span>
            </div>
          </button>

          {/* Desktop Navigation - Simplified */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { label: t.nav.solutions, path: '/services' },
              { label: t.nav.products, path: '/products' },
              { label: t.nav.cases, path: '/cases' },
              { label: t.nav.about, path: '/about' },
              { label: t.nav.contact, path: '/contact' }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                  location.pathname === item.path
                    ? 'text-wood bg-white/10'
                    : 'text-white/90 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-wood transition-all duration-200 ${
                    location.pathname === item.path ? 'w-6' : 'w-0 group-hover:w-6'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right Actions - Simplified */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-wood hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setShowLangDropdown(false)
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                        language === lang.code
                          ? 'bg-wood/15 text-wood font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate('/contact')}
              className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {t.nav.consultation}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-charcoal/95 backdrop-blur-xl border-t border-white/10 animate-fade-in">
          <div className="container-custom py-6 space-y-1">
            {[
              { label: t.nav.solutions, path: '/services' },
              { label: t.nav.products, path: '/products' },
              { label: t.nav.cases, path: '/cases' },
              { label: t.nav.about, path: '/about' },
              { label: t.nav.contact, path: '/contact' }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-wood bg-white/10 font-semibold'
                    : 'text-white/90 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Language Selector */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="text-white/70 text-sm mb-3 px-4 font-medium">Language / 语言</p>
              <div className="grid grid-cols-2 gap-2 px-4">
                {languages.slice(0, 6).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      language === lang.code
                        ? 'bg-wood text-white font-semibold shadow-md'
                        : 'bg-white/10 text-white/90 hover:bg-white/20'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 px-4">
              <Button
                variant="accent"
                className="w-full btn-shine shadow-lg"
                onClick={() => handleNavClick('/contact')}
              >
                {t.nav.consultation}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
