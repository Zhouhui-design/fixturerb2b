import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useLanguage } from '../contexts/LanguageContext'
import { openLarkChat } from '../utils/larkHelper'
import { submitContactForm } from '../services/contactService'

const ContactPage = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    storeArea: '',
    requirementTypes: [] as string[], // Changed to array for multi-select
    message: '',
    needOEM: false,
    appointmentTime: '', // New field for appointment time
    drawings: [] as File[] // Changed to array for multiple files
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement file upload to Supabase Storage
      // For now, just log the files
      if (formData.drawings.length > 0) {
        console.log('Files to upload:', formData.drawings.map(f => f.name))
        // File upload will be implemented in next phase
      }

      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        store_area: formData.storeArea ? parseInt(formData.storeArea) : undefined,
        requirement_type: formData.requirementTypes.join(', ') || undefined, // Join array into string
        need_oem: formData.needOEM,
        message: formData.message
      })

      if (result.success) {
        alert(t.contact.successMessage)
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          storeArea: '',
          requirementTypes: [],
          message: '',
          needOEM: false,
          appointmentTime: '',
          drawings: []
        })
      } else {
        alert(result.error || t.contact.failMessage)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert(t.contact.failMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.contact.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">{t.contact.sendMessageTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.companyLabel}</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.phoneLabel}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.storeAreaLabel}</label>
                  <input
                    type="text"
                    value={formData.storeArea}
                    onChange={(e) => setFormData({ ...formData, storeArea: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.requirementTypeLabel}</label>
                  <p className="text-xs text-muted-foreground mb-2">{t.contact.requirementTypePlaceholder}</p>
                  <div className="space-y-2">
                    {[
                      { key: 'materialSampling', value: 'material-sampling' },
                      { key: 'productSampling', value: 'product-sampling' },
                      { key: 'formalOrder', value: 'formal-order' },
                      { key: 'quoteRequest', value: 'quote-request' },
                      { key: 'customizationDiscussion', value: 'customization-discussion' },
                      { key: 'reorder', value: 'reorder' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.requirementTypes.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ 
                                ...formData, 
                                requirementTypes: [...formData.requirementTypes, option.value]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                requirementTypes: formData.requirementTypes.filter(t => t !== option.value)
                              })
                            }
                          }}
                          className="w-4 h-4 text-wood border-gray-300 rounded focus:ring-wood"
                        />
                        <span className="text-sm">
                          {t.contact.requirementTypes?.[option.key as keyof typeof t.contact.requirementTypes] || option.key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.needOEM}
                    onChange={(e) => setFormData({ ...formData, needOEM: e.target.checked })}
                    className="w-4 h-4 text-wood border-gray-300 rounded focus:ring-wood"
                  />
                  <span className="text-sm">{t.contact.needOEMLabel}</span>
                </label>
              </div>

              {formData.needOEM && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.appointmentTimeLabel || 'Preferred Appointment Time'}</label>
                  <input
                    type="text"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    placeholder={t.contact.appointmentTimePlaceholder || 'XXX Timezone, YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: GMT+8, 2026-04-25 14:00 ~ 2026-04-25 16:00
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.uploadDrawingsLabel}</label>
                <input
                  type="file"
                  accept=".zip,.pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.dwg,.avi,.mp4,.mov"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files
                    if (files) {
                      const fileArray = Array.from(files)
                      // Limit to 10 files
                      if (fileArray.length > 10) {
                        alert('Maximum 10 files allowed')
                        return
                      }
                      setFormData({ ...formData, drawings: fileArray })
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                />
                {formData.drawings.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.drawings.length} file(s) selected
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {t.contact.uploadFormats}
                </p>
                {t.contact.uploadTip && (
                  <p className="text-xs text-amber-600 mt-1">
                    {t.contact.uploadTip}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.messageLabel}</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood resize-none"
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 bg-wood text-white rounded-md font-medium hover:bg-wood-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.common.sending : t.contact.sendInquiry}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                {t.contact.responseTime}
              </p>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">{t.contact.contactInfoTitle}</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-wood mt-1" />
                  <div>
                    <h3 className="font-medium">{t.contact.email}</h3>
                    <p className="text-muted-foreground">{siteConfig.contact.email}</p>
                  </div>
                </div>
                
                {/* Phone section with notice - only show if phone is configured */}
                {siteConfig.contact.phone && (
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-wood mt-1" />
                    <div>
                      <h3 className="font-medium">{t.contact.phone}</h3>
                      <p className="text-muted-foreground">{siteConfig.contact.phone}</p>
                    </div>
                  </div>
                )}
                
                {/* Friendly notice about international calls */}
                {!siteConfig.contact.phone && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-md">
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                          {t.contact.phoneNotice || 'Phone Service Notice'}
                        </h3>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          {t.contact.phoneNoticeText || 'International phone service is not available yet. Please use email, Lark, or our chat system to contact us. We apologize for any inconvenience.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-wood mt-1" />
                  <div>
                    <h3 className="font-medium">{t.contact.address}</h3>
                    <p className="text-muted-foreground">{t.contact.companyAddress || 'Registered Business Address, China'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">{t.contact.connectTitle}</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={siteConfig.contact.chatSystem}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-wood transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-wood" />
                  <span className="text-sm font-medium">{t.contact.chatSystem}</span>
                </a>
                <button
                  onClick={openLarkChat}
                  className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-wood transition-colors w-full text-left"
                >
                  <span className="text-2xl">📱</span>
                  <div>
                    <span className="text-sm font-medium block">{t.contact.lark || 'Lark'}</span>
                    <span className="text-xs text-muted-foreground">{t.contact.clickToChat || 'Click to open chat'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Business Hours & AI Support */}
            <div className="space-y-4">
              {/* Human Support Hours */}
              <div className="bg-secondary p-6 rounded-lg border-l-4 border-primary">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👥</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-lg">{t.contact.businessHours}</h3>
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.contact.businessHoursContent }} />
                  </div>
                </div>
              </div>

              {/* AI Support 24/7 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🤖</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-lg text-blue-900 dark:text-blue-100">{t.contact.aiSupport}</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200" dangerouslySetInnerHTML={{ __html: t.contact.aiSupportContent }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
