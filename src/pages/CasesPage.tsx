import CasesSection from '../components/sections/CasesSection'
import { useLanguage } from '../contexts/LanguageContext'

const CasesPage = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-charcoal text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.cases.title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t.cases.subtitle}
          </p>
        </div>
      </div>

      {/* Cases Section */}
      <CasesSection />
    </div>
  )
}

export default CasesPage
