import { Ruler, Settings, Factory } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'

const CapabilitiesSection = () => {
  const { t } = useLanguage()
  
  const capabilities = [
    {
      icon: Ruler,
      title: t.capabilities.reqToDrawings,
      description: t.capabilities.reqToDrawingsDesc
    },
    {
      icon: Settings,
      title: t.capabilities.drawingsToReality,
      description: t.capabilities.drawingsToRealityDesc
    },
    {
      icon: Factory,
      title: t.capabilities.oemOdm,
      description: t.capabilities.oemOdmDesc
    }
  ]

  return (
    <section id="capabilities" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t.capabilities.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-2 hover:border-wood transition-all duration-300"
            >
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-secondary group-hover:bg-wood/10 transition-colors duration-300">
                  <capability.icon className="w-8 h-8 text-charcoal group-hover:text-wood transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {capability.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CapabilitiesSection
