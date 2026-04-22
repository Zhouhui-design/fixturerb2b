import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useLanguage } from '../contexts/LanguageContext'
import { submitContactForm } from '../services/contactService'

const ContactPage = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    storeArea: '',
    requirementType: '',
    message: '',
    needOEM: false,
    drawings: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        store_area: formData.storeArea ? parseInt(formData.storeArea) : undefined,
        requirement_type: formData.requirementType || undefined,
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
          requirementType: '',
          message: '',
          needOEM: false,
          drawings: null
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
                  <select
                    value={formData.requirementType}
                    onChange={(e) => setFormData({ ...formData, requirementType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                  >
                    <option value="">{t.contact.requirementTypePlaceholder}</option>
                    <option value="new-store">{t.contact.newStore}</option>
                    <option value="renovation">{t.contact.renovation}</option>
                    <option value="expansion">{t.contact.expansion}</option>
                    <option value="replacement">{t.contact.replacement}</option>
                  </select>
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

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.uploadDrawingsLabel}</label>
                <input
                  type="file"
                  accept=".jpg,.png,.pdf"
                  multiple
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFormData({ ...formData, drawings: file })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t.contact.uploadFormats}
                </p>
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
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-wood mt-1" />
                  <div>
                    <h3 className="font-medium">{t.contact.phone}</h3>
                    <p className="text-muted-foreground">{siteConfig.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-wood mt-1" />
                  <div>
                    <h3 className="font-medium">{t.contact.address}</h3>
                    <p className="text-muted-foreground">{siteConfig.contact.address}</p>
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
                <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg">
                  <span className="text-2xl">📱</span>
                  <div>
                    <span className="text-sm font-medium block">Lark</span>
                    <span className="text-xs text-muted-foreground">{siteConfig.contact.lark}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg">
                  <span className="text-2xl">💬</span>
                  <div>
                    <span className="text-sm font-medium block">DingTalk</span>
                    <span className="text-xs text-muted-foreground">{siteConfig.contact.dingtalk}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg">
                  <span className="text-2xl">🟢</span>
                  <div>
                    <span className="text-sm font-medium block">WeChat</span>
                    <span className="text-xs text-muted-foreground">{siteConfig.contact.wechat}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="font-semibold mb-2">{t.contact.businessHours}</h3>
              <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.contact.businessHoursContent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
