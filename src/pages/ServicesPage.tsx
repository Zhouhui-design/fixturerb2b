import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ServicesPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const services = [
    {
      title: t.services.customDesign,
      description: t.services.customDesignDesc,
      icon: '🎨'
    },
    {
      title: t.services.oemOdm,
      description: t.services.oemOdmDesc,
      icon: '🏭'
    },
    {
      title: t.services.spacePlanning,
      description: t.services.spacePlanningDesc,
      icon: '📐'
    },
    {
      title: t.services.installationSupport,
      description: t.services.installationSupportDesc,
      icon: '🔧'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-charcoal text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.services.title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-wood transition-colors"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Timeline */}
      <div className="py-20 bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">{t.services.processTitle}</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {t.services.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-wood text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
                  <h4 className="font-semibold">{step}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">{t.services.ctaTitle}</h2>
          <p className="text-muted-foreground mb-8">
            {t.services.ctaSubtitle}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-wood text-white rounded-md font-medium hover:bg-wood-light transition-colors"
          >
            {t.services.contactUs}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
