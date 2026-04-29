import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import QuoteRequest from '../components/QuoteRequest'
import SchemaMarkup from '../components/SchemaMarkup'
import { getProductGallery } from '../config/products'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Get product info
  const productIndex = parseInt(id || '1') - 1
  const product = t.products.items[productIndex]
  const productName = product?.name || 'Product Inquiry'
  const productDescription = product?.description || 'Professional display fixture for retail environments.'

  // Get image gallery using configuration
  const productId = parseInt(id || '1')
  const images = getProductGallery(productId)

  // Product schema data
  const productSchemaData = {
    name: productName,
    description: productDescription,
    image: [`https://fixturerb2b.top${images[0]}`],
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
          {/* Image Gallery - Carousel */}
          <div>
            {images.length === 1 ? (
              // Single image for other products
              <img
                src={images[0]}
                alt="Product"
                className="w-full rounded-lg"
              />
            ) : (
              // Carousel for Shirt Display Rack
              <div className="relative">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${productName} - View ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </div>
                
                {/* Image Counter */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  {currentImageIndex + 1} / {images.length}
                </div>
                
                {/* Thumbnail Strip */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-wood ring-2 ring-wood/30'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product?.name || 'Product'}</h1>
            
            {/* Custom descriptions for specific products */}
            {parseInt(id || '1') === 1 ? (
              <p className="text-muted-foreground mb-6 text-lg">
                {t.productDetail?.shirtRackDescription || 'Customizable'}
              </p>
            ) : parseInt(id || '1') === 2 ? (
              <p className="text-muted-foreground mb-6 text-lg">
                {t.productDetail?.bagRackDescription || 'Customizable with logo options'}
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                {t.productDetail.description}
              </p>
            )}

            {/* Specifications - Only show for products other than 1 and 2 */}
            {parseInt(id || '1') !== 1 && parseInt(id || '1') !== 2 && (
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-semibold mb-2">{t.productDetail.specifications}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t.productDetail.material}: {product?.specs?.split(' / ')[0] || 'Premium steel and wood'}</li>
                    <li>• {t.productDetail.loadCapacity}: {product?.specs?.split('/ ').pop() || 'Up to 200kg'}</li>
                    <li>• {t.productDetail.customizableSizes}</li>
                    <li>• {t.productDetail.easyAssembly}</li>
                  </ul>
                </div>
              </div>
            )}

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
