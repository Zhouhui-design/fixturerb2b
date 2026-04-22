import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import QuoteRequest from '../components/QuoteRequest'
import SchemaMarkup from '../components/SchemaMarkup'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  // Get product info
  const productIndex = parseInt(id || '1') - 1
  const product = t.products.items[productIndex]
  const productName = product?.name || 'Product Inquiry'
  const productDescription = product?.description || 'Professional display fixture for retail environments.'

  // Product schema data
  const productSchemaData = {
    name: productName,
    description: productDescription,
    image: [`https://fixturerb2b.top/products/${id}.jpg`], // Placeholder image URL
    url: `https://fixturerb2b.top/products/${id}`,
    currency: 'USD',
    rating: '4.8',
    reviewCount: '120'
  }

  return (
    <div className="min-h-screen py-20">
      {/* Product Schema Markup */}
      <SchemaMarkup type="product" data={productSchemaData} />
      
      <div className="container-custom">
        <button
          onClick={() => navigate('/products')}
          className="mb-8 text-wood hover:text-wood-light"
        >
          {t.productDetail.backToProducts}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <img
              src="/images/product-showcase.jpg"
              alt="Product"
              className="w-full rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{t.products.items[parseInt(id || '1') - 1]?.name || 'Product'}</h1>
            <p className="text-muted-foreground mb-6">
              {t.productDetail.description}
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold mb-2">{t.productDetail.specifications}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t.productDetail.material}: {t.products.items[parseInt(id || '1') - 1]?.specs?.split(' / ')[0] || 'Premium steel and wood'}</li>
                  <li>• {t.productDetail.loadCapacity}: {t.products.items[parseInt(id || '1') - 1]?.specs?.split('/ ').pop() || 'Up to 200kg'}</li>
                  <li>• {t.productDetail.customizableSizes}</li>
                  <li>• {t.productDetail.easyAssembly}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full px-8 py-3 bg-wood text-white rounded-md font-medium hover:bg-wood-light transition-colors flex items-center justify-center space-x-2"
              >
                <span>{t.productDetail.requestQuote}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full px-8 py-3 border-2 border-charcoal text-charcoal rounded-md font-medium hover:bg-charcoal hover:text-white transition-colors">
                {t.productDetail.downloadSpecs}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <QuoteRequest
          productName={productName}
          productId={id}
          onClose={() => setShowQuoteModal(false)}
        />
      )}
    </div>
  )
}

export default ProductDetailPage
