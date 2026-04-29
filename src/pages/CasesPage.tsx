import CasesSection from '../components/sections/CasesSection'
import { useLanguage } from '../contexts/LanguageContext'

const CasesPage = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-charcoal text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">我们按客户设计师 还原的效果</h1>
        </div>
      </div>

      {/* Cases Section */}
      <CasesSection />
    </div>
  )
}

export default CasesPage
