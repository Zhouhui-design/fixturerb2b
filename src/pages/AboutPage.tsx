import { useState, useEffect, useRef } from 'react'
import { RotateCw, ZoomIn, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const AboutPage = () => {
  const { t } = useLanguage()

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-20 border-b">
        <div className="container-custom text-center">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-1 rounded-full text-sm font-medium mb-6">
            {t.aboutPage?.heroBadge || '⚡ Registered OPC (One Person Company)'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent" dangerouslySetInnerHTML={{ __html: t.aboutPage?.heroTitle || 'From blueprint to store<br />– I make it happen.' }} />
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 font-medium">
            {t.aboutPage?.heroSubtitle || 'Your commercial furniture. One person, full control.'}
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            {t.aboutPage?.heroDescription || 'Direct coordination for custom store interiors. 10+ vetted factories, one responsible founder. No layers, no excuses.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary inline-block">{t.aboutPage?.startProject || 'Start a project →'}</a>
            <a href="#process" className="btn-outline inline-block">{t.aboutPage?.viewProcess || 'View process'}</a>
          </div>
        </div>
      </div>

      {/* Brand Story Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-blue-600 pl-6">{t.aboutPage?.brandStoryTitle || 'Brand Story'}</h2>
          <div className="max-w-4xl space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.brandStoryP1 || '<strong>I spent years inside the commercial furniture industry – not just selling, but designing, costing, sourcing, and quality-controlling real projects for retail stores, showrooms, and brand shops.</strong>' }} />
            <p>{t.aboutPage?.brandStoryP2 || 'I saw the same problem again and again: a store needs 50 to 100+ different custom items – counters, display racks, mid-island stands, light boxes, fitting room mirrors, wall shelves… each with its own design, quantity (sometimes just one piece), and material requirement. Most suppliers either refuse such complex orders or hand them to junior coordinators who miss details and delay timelines.'}</p>
            <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.brandStoryP3 || 'So I started <strong>Hangzhou Gouhui International Trade Co., Ltd.</strong> – a <strong>legally registered One-Person Company (OPC)</strong>. No board of directors. No sales team pushing quotas. Just me, a notebook full of supplier contacts, and a simple belief: <em>a complex store project deserves a single, responsible person who understands every detail.</em>' }} />
            <p>{t.aboutPage?.brandStoryP4 || 'I personally review your store design and create a cost breakdown; match each item to the best-fit factory from my network of 10+ reliable commercial furniture suppliers; control quality, dimensions, finishes – because I used to do process deepening myself; coordinate shipping and delivery so you don\'t talk to five different people.'}</p>
            <p className="text-xl font-semibold text-blue-900 dark:text-blue-300">
              {t.aboutPage?.brandStoryP5 || 'I don\'t have a huge factory. But I have something better: direct access to 10 specialized factories, and the personal drive to make your project right.'}
            </p>
            <p>
              {t.aboutPage?.brandStoryP6 || 'If you\'re a store owner or brand manager tired of being passed around, try me. One email, one person, one solution.'}
            </p>
          </div>
        </div>
      </section>

      {/* Company Information Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 border-l-4 border-blue-600 pl-6">{t.aboutPage?.companyTitle || 'Company & Transparency'}</h2>
          
          {/* Founder Photo & Business License Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Founder Photo Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-6 text-center">Founder Photo</h3>
              <div 
                className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer"
                onDoubleClick={() => handleDoubleClick('/images/founder-photo-1.jpg')}
              >
                <img 
                  src="/images/founder-photo-1.jpg" 
                  alt="Gou Hui - Founder" 
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: `rotate(${imageRotation['/images/founder-photo-1.jpg'] || 0}deg)` }}
                  loading="lazy"
                />
                
                {/* Hover overlay with controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRotate('/images/founder-photo-1.jpg')
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDoubleClick('/images/founder-photo-1.jpg')
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
              <p className="text-center text-slate-600 dark:text-slate-300 font-medium">Gou Hui - Founder</p>
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2">Hangzhou Gouhui International Trade Co., Ltd.</p>
            </div>

            {/* Business License Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-6 text-center">Business License</h3>
              <div 
                className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer"
                onDoubleClick={() => handleDoubleClick('/images/business-license.jpg')}
              >
                <img 
                  src="/images/business-license.jpg" 
                  alt="Business License - Hangzhou Gouhui International Trade Co., Ltd." 
                  className="w-full h-full object-contain p-4 transition-transform duration-300"
                  style={{ transform: `rotate(${imageRotation['/images/business-license.jpg'] || 0}deg)` }}
                  loading="lazy"
                />
                
                {/* Hover overlay with controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRotate('/images/business-license.jpg')
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDoubleClick('/images/business-license.jpg')
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
              <p className="text-center text-slate-600 dark:text-slate-300 font-medium">Official Business License</p>
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2">Registration No.: 91330102MA7YAL1L8G</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-4">{t.aboutPage?.companyName || 'Hangzhou Gouhui International Trade Co., Ltd.'}</h3>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.registeredOPC || '<strong>Registered OPC</strong> (One Person Company) – fully compliant with Chinese law.' }} />
                <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.founder || '<strong>Founder:</strong> Gou Hui' }} />
                <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.paidUpCapital || '<strong>Paid-up capital:</strong> RMB 100,000' }} />
                <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.specialization || '<strong>Specialization:</strong> Custom commercial furniture project coordination for retail stores, brand shops, and display spaces.' }} />
              </div>
            </div>

            {/* Business License Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-xl font-bold mb-4">{t.aboutPage?.businessLicenseTitle || 'Public Business License'}</h3>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <p dangerouslySetInnerHTML={{ __html: t.aboutPage?.registrationNo || '<strong>Registration No.:</strong>' }} />
                <code className="block bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded text-sm font-mono">91330102MA7YAL1L8G</code>
                <p className="text-sm mt-4" dangerouslySetInnerHTML={{ __html: t.aboutPage?.verification || '<strong>Verification:</strong> You can check our status on China\'s National Credit Information System (<a href="http://www.gsxt.gov.cn" target="_blank" rel="noopener noreferrer">www.gsxt.gov.cn</a>) using our registration number.' }} />
                <p className="text-green-600 dark:text-green-400 font-medium text-sm mt-4">{t.aboutPage?.transparent || '✅ Fully transparent – what you see is what we are.'}</p>
              </div>
            </div>

            {/* What We Do Differently */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-4">{t.aboutPage?.whatWeDoTitle || 'What We Do Differently'}</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{t.aboutPage?.whatWeDo1 || 'One point of contact – the founder'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{t.aboutPage?.whatWeDo2 || '10+ vetted furniture factories'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{t.aboutPage?.whatWeDo3 || 'End-to-end: design review → costing → sourcing → QC → shipping'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{t.aboutPage?.whatWeDo4 || 'No hidden team photos, no fake "we" statements'}</span>
                </li>
              </ul>
              <p className="mt-4 font-semibold text-blue-900 dark:text-blue-300">{t.aboutPage?.ourPromise || 'Our promise: 50 or 500 custom pieces, I personally ensure every single one matches your specs.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section id="process" className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-blue-600 pl-6">{t.aboutPage?.howWeWorkTitle || 'How We Work'}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">{t.aboutPage?.howWeWorkSubtitle || 'From your store plan to finished installation'}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">{t.aboutPage?.step1Title || '📐 Share your store design & needs'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t.aboutPage?.step1Desc || 'Send floor plans, reference photos, or a simple list of required items (counters, racks, light boxes, mirrors, etc.). I\'ll help clarify.'}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">{t.aboutPage?.step2Title || '💰 Detailed cost breakdown'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t.aboutPage?.step2Desc || 'Based on my industry experience (design, costing, sourcing), I break down every item: material options, estimated unit price, total cost, and lead time.'}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">{t.aboutPage?.step3Title || '🏭 Match each item to the best factory'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t.aboutPage?.step3Desc || 'I work with 10+ specialized suppliers. I assign each product to the factory that gives you the best balance of quality, price, and delivery time.'}</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">4</div>
              <h3 className="text-xl font-bold mb-3">{t.aboutPage?.step4Title || '🔍 Sampling & production follow-up'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t.aboutPage?.step4Desc || 'Samples arranged for key items. During mass production, I personally check dimensions, finishes, and assembly details.'}</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">5</div>
              <h3 className="text-xl font-bold mb-3">{t.aboutPage?.step5Title || '✅ Quality control before shipping'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t.aboutPage?.step5Desc || 'Before anything leaves the factory, I inspect a representative batch. If something doesn\'t match specs, I stop it and get it corrected.'}</p>
            </div>

            {/* Step 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">6</div>
              <h3 className="text-xl font-bold mb-3">{t.aboutPage?.step6Title || '🚢 Shipping coordination & after-sales'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t.aboutPage?.step6Desc || 'I arrange sea/air/express shipping. You get one tracking summary, not ten different waybills. After delivery, if any hidden defect appears, email me – solution within 48 hours.'}</p>
            </div>
          </div>

          <p className="text-center text-lg font-semibold mt-12 text-blue-900 dark:text-blue-300">
            {t.aboutPage?.responsibility || 'One person, full responsibility. No hand-offs, no excuses.'}
          </p>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-blue-600 pl-6">{t.aboutPage?.founderNoteTitle || 'A Word from Gou Hui (Founder)'}</h2>
          <div className="max-w-4xl bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border-l-8 border-blue-600">
            <blockquote className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 space-y-4">
              <p>
                {t.aboutPage?.founderNoteP1 || '"When you email me, you\'re not talking to a chatbot or a support ticket system. You\'re talking to the person who designs, costs, and coordinates your entire project. I reply within 24 hours on business days – not because I have to, but because that\'s how I\'d want to be treated.'}
              </p>
              <p>
                {t.aboutPage?.founderNoteP2 || 'I don\'t hide behind a \'team\' that doesn\'t exist. My company is small by design, so I can move fast, keep prices fair, and take full responsibility for every order. If something goes wrong, I fix it – personally."'}
              </p>
            </blockquote>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="font-bold text-lg text-slate-900 dark:text-white">{t.aboutPage?.founderName || '— Gou Hui'}</p>
              <p className="text-slate-600 dark:text-slate-400">{t.aboutPage?.founderTitle || 'Founder, Hangzhou Gouhui International Trade Co., Ltd.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{t.aboutPage?.ctaTitle || 'Ready to equip your store?'}</h3>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-slate-300">
              {t.aboutPage?.ctaDescription || 'Send me your design or requirement list – I\'ll reply within 24 hours with a clear action plan.'}
            </p>
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-lg">
              {t.aboutPage?.getInTouch || 'Get in Touch →'}
            </a>
            <p className="mt-6 text-sm text-slate-400">
              {t.aboutPage?.contactNote || '📧 Contact us through the form | WeChat / WhatsApp available upon request'}
            </p>
          </div>
        </div>
      </section>

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

export default AboutPage
