import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'

const TrustSection = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const stats = [
    { number: '10+', label: t.trust.yearsExperience },
    { number: '500+', label: t.trust.storesServed },
    { number: '100%', label: t.trust.reproductionPromise }
  ]

  const brands = t.trust.brands.map((brand, index) => ({
    name: brand.name,
    link: `/cases/${index + 1}`
  }))

  const testimonials = t.trust.testimonialsList

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Brand Wall */}
          <div>
            <h3 className="text-xl font-semibold mb-6">{t.trust.trustedBy}</h3>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-8 animate-fade-in">
                {brands.map((brand, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(brand.link)}
                    className="flex-shrink-0 w-32 h-16 bg-secondary rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:bg-wood/10"
                  >
                    <span className="text-muted-foreground font-medium">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Testimonials */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">{t.trust.testimonials}</h3>
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-charcoal">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-wood mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
