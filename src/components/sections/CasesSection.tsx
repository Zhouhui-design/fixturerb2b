import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'
import { getAllCases, type CaseImageConfig } from '../../config/cases'

const CasesSection = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Get case studies from configuration for images
  const casesConfig = getAllCases()
  
  // Merge config images with translated text
  const cases = casesConfig.map((configItem, index) => {
    const translationItem = t.cases.items[index]
    return {
      id: configItem.id,
      coverImage: configItem.coverImage,
      galleryImages: configItem.galleryImages,
      name: translationItem?.name || configItem.name,
      result: translationItem?.result || configItem.result
    }
  })

  return (
    <section id="cases" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">{t.cases.title}</h2>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} index={index} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Separate component for case card with carousel
interface CaseCardProps {
  caseItem: CaseImageConfig & { name: string; result: string }
  index: number
  navigate: (path: string) => void
}

const CaseCard = ({ caseItem, index, navigate }: CaseCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Check if case has images
  const hasImages = caseItem.galleryImages.length > 0
  
  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!hasImages || caseItem.galleryImages.length <= 1) {
      console.log(`Case ${caseItem.id} has ${caseItem.galleryImages.length} image(s), no carousel needed`)
      return
    }
    
    console.log(`Case ${caseItem.id} carousel started with ${caseItem.galleryImages.length} images`)
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = prev === caseItem.galleryImages.length - 1 ? 0 : prev + 1
        console.log(`Case ${caseItem.id} switching to image ${next + 1}/${caseItem.galleryImages.length}`)
        return next
      })
    }, 3000) // Change image every 3 seconds
    
    return () => {
      clearInterval(interval)
      console.log(`Case ${caseItem.id} carousel stopped`)
    }
  }, [caseItem.galleryImages.length, caseItem.id, hasImages])

  return (
    <Card
      className={`group cursor-pointer overflow-hidden ${
        index === 0 || index === 5 ? 'md:col-span-2 lg:col-span-1' : ''
      }`}
      onClick={() => navigate(`/cases/${caseItem.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Placeholder when no images */}
        {!hasImages && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">待添加案例图片</p>
            </div>
          </div>
        )}
        
        {/* Image Carousel */}
        {hasImages && caseItem.galleryImages.map((img, imgIndex) => (
          <img
            key={`${caseItem.id}-${imgIndex}`}
            src={img}
            alt={`${caseItem.name} - image ${imgIndex + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              imgIndex === currentImageIndex 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0'
            }`}
            loading="lazy"
          />
        ))}
        
        {/* Image counter badge */}
        {caseItem.galleryImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {caseItem.galleryImages.length}
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-lg font-semibold mb-1">{caseItem.name}</h3>
          <p className="text-sm text-white/80">{caseItem.result}</p>
        </div>
      </div>
    </Card>
  )
}

export default CasesSection
