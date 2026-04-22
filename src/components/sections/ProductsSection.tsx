import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'

const ProductsSection = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const products = t.products.items.map((item, index) => ({
    id: index + 1,
    name: item.name,
    description: item.description,
    whiteImage: '/images/product-showcase.jpg',
    sceneImage: '/images/hero-boutique.jpg',
    specs: item.specs
  }))

  return (
    <section id="products" className="section-padding bg-gradient-to-b from-secondary to-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 fade-in-up">
          <div>
            <h2 className="heading-2 mb-2 gradient-text">{t.products.title}</h2>
            <p className="text-muted-foreground text-lg">{t.products.subtitle}</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 md:mt-0 inline-flex items-center text-wood hover:text-wood-light font-medium group hover-lift px-4 py-2 rounded-lg hover:bg-wood/5 transition-all duration-300"
          >
            {t.products.viewAll}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className={`group cursor-pointer overflow-hidden card-elevated hover-lift border-0 bg-white/80 backdrop-blur-sm fade-in-up stagger-${index + 1}`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Area */}
              <div className="relative h-[280px] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                <img
                  src={hoveredProduct === product.id ? product.sceneImage : product.whiteImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick Action Overlay - Only show on non-touch devices */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="accent"
                    size="sm"
                    className="shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/products/${product.id}`)
                    }}
                  >
                    {t.products.viewDetails}
                  </Button>
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full">
                  <span className="text-xs font-semibold text-charcoal">{t.footer.premiumQuality}</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-bold group-hover:text-wood transition-colors duration-300 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 text-xs text-charcoal/60 bg-secondary/50 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-wood" />
                  <span>{product.specs}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="text-sm font-semibold text-wood hover:text-wood-light transition-colors flex items-center group/btn"
                  >
                    {t.products.learnMore}
                    <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/contact')
                    }}
                    className="hover:bg-wood hover:text-white hover:border-wood transition-all duration-300 btn-shine"
                  >
                    {t.products.getQuote}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
