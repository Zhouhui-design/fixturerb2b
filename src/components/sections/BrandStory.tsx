import { useLanguage } from '../../contexts/LanguageContext'

const BrandStory = () => {
  const { t } = useLanguage()
  
  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="heading-2">{t.brandStory.title}</h2>
            
            <div className="space-y-4 text-body text-muted-foreground">
              <p>
                {t.brandStory.paragraph1}
              </p>
              <p>
                {t.brandStory.paragraph2}
              </p>
              <p>
                {t.brandStory.paragraph3}
              </p>
            </div>

            <blockquote className="border-l-4 border-wood pl-6 py-2 italic text-charcoal">
              "{t.brandStory.quote}"
            </blockquote>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="/images/hero-boutique.jpg"
                  alt="Brand store display"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src="/images/factory-workshop.jpg"
                  alt="Manufacturing facility"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src="/images/product-showcase.jpg"
                  alt="Product craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="/images/hero-boutique.jpg"
                  alt="Store installation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStory
