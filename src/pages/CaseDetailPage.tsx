import { useNavigate, useParams } from 'react-router-dom'
import { getCaseStudy } from '../config/cases'
import { useLanguage } from '../contexts/LanguageContext'

const CaseDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useLanguage()

  // Get case study from configuration
  const caseId = parseInt(id || '1')
  const caseStudy = getCaseStudy(caseId)
  
  // Fallback to first case if not found
  const images = caseStudy?.galleryImages || []
  const caseName = caseStudy?.name || 'Case Study'

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <button
          onClick={() => navigate('/cases')}
          className="mb-8 text-wood hover:text-wood-light"
        >
          ← {t.caseDetail?.backToCases || 'Back to Cases'}
        </button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{caseName}</h1>
          
          {/* Image Gallery - Only show for case 1 */}
          {caseId === 1 && images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={img}
                    alt={`${caseName} - image ${index + 1}`}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaseDetailPage
