import { X } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

interface TrustBannerProps {
  onClose: () => void
}

const TrustBanner = ({ onClose }: TrustBannerProps) => {
  const { t } = useLanguage()
  
  return (
    <div className="bg-charcoal text-white py-2 px-4 relative">
      <div className="container-custom flex items-center justify-center">
        <p className="text-xs md:text-sm text-center pr-8">
          {t.trustBanner.text}
        </p>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TrustBanner
