import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const CaseDetailPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <button
          onClick={() => navigate('/cases')}
          className="mb-8 text-wood hover:text-wood-light"
        >
          {t.caseDetail.backToCases}
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{t.cases.title}</h1>
          <img
            src="/images/hero-boutique.jpg"
            alt="Case study"
            className="w-full rounded-lg mb-8"
          />

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">{t.caseDetail.projectOverview}</h2>
            <p className="text-muted-foreground mb-6">
              {t.caseDetail.projectOverviewDesc}
            </p>

            <h2 className="text-2xl font-semibold mb-4">{t.caseDetail.challenge}</h2>
            <p className="text-muted-foreground mb-6">
              {t.caseDetail.challengeDesc}
            </p>

            <h2 className="text-2xl font-semibold mb-4">{t.caseDetail.solution}</h2>
            <p className="text-muted-foreground mb-6">
              {t.caseDetail.solutionDesc}
            </p>

            <h2 className="text-2xl font-semibold mb-4">{t.caseDetail.results}</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>{t.caseDetail.result1}</li>
              <li>{t.caseDetail.result2}</li>
              <li>{t.caseDetail.result3}</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-wood text-white rounded-md font-medium hover:bg-wood-light transition-colors"
            >
              {t.caseDetail.startProject}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetailPage
