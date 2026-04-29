import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'
import { getAllCases } from '../../config/cases'

const CasesSection = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Get case studies from configuration
  const cases = getAllCases()

  return (
    <section id="cases" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t.cases.title}</h2>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <Card
              key={caseItem.id}
              className={`group cursor-pointer overflow-hidden ${
                index === 0 || index === 5 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              onClick={() => navigate(`/cases/${caseItem.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={caseItem.coverImage}
                  alt={caseItem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-semibold mb-1">{caseItem.name}</h3>
                  <p className="text-sm text-white/80">{caseItem.result}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CasesSection
