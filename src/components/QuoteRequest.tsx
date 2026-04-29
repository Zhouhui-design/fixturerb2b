import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Send, FileText, Shield, CheckCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface QuoteRequestProps {
  productName?: string
  productId?: string
  onClose: () => void
}

const QuoteRequest = ({ productName, productId, onClose }: QuoteRequestProps) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    quantity: '',
    specifications: '',
    targetPrice: '',
    deliveryTerms: 'FOB',
    paymentTerms: 'T/T',
    message: '',
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
      setError(t.quoteRequest?.errorAgreeTerms || 'Please agree to the terms and conditions')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { error: submitError } = await supabase
        .from('quote_requests')
        .insert([
          {
            product_name: productName || 'General Inquiry',
            product_id: productId,
            customer_name: formData.name,
            customer_email: formData.email,
            company_name: formData.company,
            country: formData.country,
            phone: formData.phone,
            quantity: formData.quantity,
            specifications: formData.specifications,
            target_price: formData.targetPrice,
            delivery_terms: formData.deliveryTerms,
            payment_terms: formData.paymentTerms,
            message: formData.message,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])

      if (submitError) throw submitError

      setSubmitSuccess(true)
      
      // Send notification email (you can integrate with email service)
      console.log('Quote request submitted:', formData)
      
    } catch (err: any) {
      console.error('Error submitting quote request:', err)
      setError(err.message || t.quoteRequest?.errorSubmit || 'Failed to submit quote request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.quoteRequest?.submittedTitle || 'Quote Request Submitted!'}</h3>
            <p className="text-gray-600 mb-6">
              {t.quoteRequest?.submittedMessage || 'Thank you for your inquiry. Our team will review your request and send you a formal quotation within 24 hours.'}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>{t.quoteRequest?.nextSteps || 'Next Steps:'}</strong><br />
                {t.quoteRequest?.step1 || '1. Check your email for confirmation'}<br />
                {t.quoteRequest?.step2 || '2. We\'ll send a detailed quotation'}<br />
                {t.quoteRequest?.step3 || '3. Review and sign the contract online'}<br />
                {t.quoteRequest?.step4 || '4. Arrange payment securely'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t.common.close || 'Close'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.quoteRequest?.title || 'Request a Quote'}</h2>
            {productName && (
              <p className="text-sm text-gray-600 mt-1">Product: {productName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-center">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">{t.quoteRequest?.secureInfo || '🔒 Your information is secure'}</p>
            </div>
            <div className="text-center">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">{t.quoteRequest?.contractInfo || '✓ Formal contract provided'}</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">{t.quoteRequest?.responseTime || '✓ 24hr response time'}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">{t.quoteRequest?.contactInfo || 'Contact Information'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.fullName || 'Full Name *'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.emailAddress || 'Email Address *'}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.companyName || 'Company Name *'}
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your Company Ltd."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.country || 'Country *'}
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="United States"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.quoteRequest?.phoneNumber || 'Phone Number'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">{t.quoteRequest?.productDetails || 'Product Details'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.quantity || 'Quantity *'}
                </label>
                <input
                  type="text"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 100 pieces"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.targetPrice || 'Target Price (USD)'}
                </label>
                <input
                  type="text"
                  name="targetPrice"
                  value={formData.targetPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., $50/unit"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.quoteRequest?.specifications || 'Specifications / Requirements'}
              </label>
              <textarea
                name="specifications"
                rows={3}
                value={formData.specifications}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Size, color, material, customization requirements, etc."
              />
            </div>
          </div>

          {/* Trade Terms */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">{t.quoteRequest?.tradeTerms || 'Trade Terms'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.deliveryTerms || 'Delivery Terms'}
                </label>
                <select
                  name="deliveryTerms"
                  value={formData.deliveryTerms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="FOB">FOB (Free on Board)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.quoteRequest?.paymentTerms || 'Payment Terms'}
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="T/T">T/T (Bank Transfer)</option>
                  <option value="L/C">L/C (Letter of Credit)</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Western Union">Western Union</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.quoteRequest?.additionalMessage || 'Additional Message'}
            </label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any other questions or requirements..."
            />
          </div>

          {/* Terms Agreement */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                {t.quoteRequest?.termsAgreement || 'I agree to the Terms and Conditions and Privacy Policy. I understand that this is a quote request and not a binding order.'}
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? (t.quoteRequest?.submitting || 'Submitting...') : (t.quoteRequest?.submitButton || 'Submit Quote Request')}</span>
              </>
            )}
          </button>

          {/* Trust Message */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>{t.quoteRequest?.secureInfo || '🔒 Your information is secure and will never be shared'}</p>
            <p>{t.quoteRequest?.responseTime || '✓ We respond to all inquiries within 24 hours'}</p>
            <p>{t.quoteRequest?.contractInfo || '✓ Formal contract provided before payment'}</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteRequest
