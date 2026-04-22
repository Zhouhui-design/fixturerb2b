import { useNavigate } from 'react-router-dom'
import ProductsSection from '../components/sections/ProductsSection'
import { useLanguage } from '../contexts/LanguageContext'

const ProductsPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-charcoal text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.productsPage.title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t.productsPage.subtitle}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <ProductsSection />

      {/* CTA */}
      <div className="py-20 bg-secondary">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">{t.productsPage.customSolutionTitle}</h2>
          <p className="text-muted-foreground mb-8">
            {t.productsPage.customSolutionSubtitle}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-wood text-white rounded-md font-medium hover:bg-wood-light transition-colors"
          >
            {t.productsPage.getInTouch}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
