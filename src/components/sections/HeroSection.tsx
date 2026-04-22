import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useLanguage } from '../../contexts/LanguageContext'

const HeroSection = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: '/images/hero-boutique.jpg',
      alt: 'Upscale women\'s clothing boutique interior'
    },
    {
      image: '/images/factory-workshop.jpg',
      alt: 'Professional manufacturing workshop'
    },
    {
      image: '/images/product-showcase.jpg',
      alt: 'Modular retail display system'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow - Simplified transitions */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
                  loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/80" />
          </div>
        ))}
      </div>

      {/* Static Background Overlay - Removed animation for performance */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(210,180,140,0.15),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Main Title - Simplified animation */}
          <h1 className="heading-1 font-bold tracking-tight fade-in-up animate-delay-200">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-4xl mx-auto fade-in-up animate-delay-400">
            {t.hero.subtitle}
          </p>

          {/* Trust Statement - Removed hover-lift for better UX */}
          <div className="glass-dark rounded-2xl p-6 max-w-3xl mx-auto border border-white/20 fade-in-up animate-delay-600">
            <p className="text-sm md:text-base leading-relaxed text-white/90">
              {t.hero.trustStatement}
            </p>
          </div>

          {/* CTA Buttons - Simplified effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 fade-in-up animate-delay-800">
            <Button
              variant="accent"
              size="lg"
              className="group shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate('/services')}
            >
              {t.hero.exploreSolutions}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/50 text-white hover:bg-white hover:text-charcoal hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate('/contact')}
            >
              {t.hero.contactExpert}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Gentler animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <ChevronDown className="w-8 h-8 text-white/70 hover:text-white transition-colors cursor-pointer" />
      </div>

      {/* Slide Indicators - Simplified */}
      <div className="absolute bottom-8 right-8 flex space-x-2 glass px-4 py-2 rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-wood w-8' : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSection
