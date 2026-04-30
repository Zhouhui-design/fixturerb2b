import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getCaseStudy } from '../config/cases'
import { useLanguage } from '../contexts/LanguageContext'
import { RotateCw, ZoomIn, X } from 'lucide-react'

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

  // Image viewer state
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageRotation, setImageRotation] = useState<{[key: string]: number}>({})
  const [imageScale, setImageScale] = useState<{[key: string]: number}>({})
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
        setImageScale({})
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Handle image rotation
  const handleRotate = (imgSrc: string) => {
    setImageRotation(prev => ({
      ...prev,
      [imgSrc]: ((prev[imgSrc] || 0) + 90) % 360
    }))
  }

  // Handle image zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent, imgSrc: string) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setImageScale(prev => {
      const currentScale = prev[imgSrc] || 1
      const newScale = Math.max(0.5, Math.min(5, currentScale + delta))
      return {
        ...prev,
        [imgSrc]: newScale
      }
    })
  }

  // Handle double click to open modal
  const handleDoubleClick = (imgSrc: string) => {
    setSelectedImage(imgSrc)
    setImageScale(prev => ({
      ...prev,
      [imgSrc]: prev[imgSrc] || 1
    }))
  }

  // Close modal
  const closeModal = () => {
    setSelectedImage(null)
  }

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
          
          {/* Image Gallery - Show for all cases with images */}
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
                  onDoubleClick={() => handleDoubleClick(img)}
                >
                  <img
                    src={img}
                    alt={`${caseName} - image ${index + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-300"
                    style={{ transform: `rotate(${imageRotation[img] || 0}deg)` }}
                    loading="lazy"
                  />
                  
                  {/* Hover overlay with controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRotate(img)
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDoubleClick(img)
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No images available for this case study yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Rotate button */}
            <button
              onClick={() => handleRotate(selectedImage)}
              className="absolute top-4 left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-6 h-6 text-white" />
            </button>

            {/* Image with zoom and rotation */}
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain transition-transform duration-200"
              style={{ 
                transform: `rotate(${imageRotation[selectedImage] || 0}deg) scale(${imageScale[selectedImage] || 1})`,
                cursor: 'zoom-in'
              }}
              onWheel={(e) => handleWheel(e, selectedImage)}
              onDoubleClick={closeModal}
            />

            {/* Zoom level indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {Math.round((imageScale[selectedImage] || 1) * 100)}%
              {' • '}Scroll to zoom, ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaseDetailPage
