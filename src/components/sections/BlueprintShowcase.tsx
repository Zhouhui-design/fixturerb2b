import { useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

const BlueprintShowcase = () => {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)

  const comparisons = [
    {
      id: 1,
      blueprint: '/images/factory-workshop.jpg',
      reality: '/images/product-showcase.jpg'
    },
    {
      id: 2,
      blueprint: '/images/hero-boutique.jpg',
      reality: '/images/factory-workshop.jpg'
    },
    {
      id: 3,
      blueprint: '/images/product-showcase.jpg',
      reality: '/images/hero-boutique.jpg'
    }
  ]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? comparisons.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === comparisons.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">
            {t.blueprint.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.blueprint.subtitle}
          </p>
        </div>

        {/* Comparison Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Blueprint */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-charcoal/30">
                <img
                  src={comparisons[currentIndex].blueprint}
                  alt="Customer blueprint"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-charcoal text-white text-sm font-medium rounded">
                  {t.blueprint.customerProvided}
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">{t.blueprint.originalDrawing}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <ArrowRight className="w-12 h-12 text-wood animate-pulse-slow" />
                <span className="text-sm font-semibold text-wood">{t.blueprint.reproduction}</span>
              </div>
            </div>

            {/* Right: Reality */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-wood">
                <img
                  src={comparisons[currentIndex].reality}
                  alt="Finished product"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-wood text-white text-sm font-medium rounded">
                  {t.blueprint.finishedProduct}
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">{t.blueprint.actualProduct}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border-2 border-charcoal/20 hover:border-wood hover:text-wood transition-colors"
              aria-label="Previous comparison"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex space-x-2">
              {comparisons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-wood w-8' : 'bg-charcoal/20'
                  }`}
                  aria-label={`Go to comparison ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border-2 border-charcoal/20 hover:border-wood hover:text-wood transition-colors"
              aria-label="Next comparison"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Description */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            {t.blueprint.comparisons[currentIndex].description}
          </p>
        </div>
      </div>
    </section>
  )
}

export default BlueprintShowcase
