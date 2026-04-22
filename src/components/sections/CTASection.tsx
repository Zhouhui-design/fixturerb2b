import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useLanguage } from '../../contexts/LanguageContext'

const CTASection = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-secondary">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="heading-2">
            {t.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.cta.subtitle}
          </p>
          
          <Button variant="accent" size="xl" className="group" onClick={() => navigate('/contact')}>
            {t.cta.button}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-muted-foreground">
            {t.cta.promise}
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTASection
