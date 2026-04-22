import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Send, FileText, Shield, CheckCircle } from 'lucide-react'

interface QuoteRequestProps {
  productName?: string
  productId?: string
  onClose: () => void
}

const QuoteRequest = ({ productName, productId, onClose }: QuoteRequestProps) => {
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
      setError('Please agree to the terms and conditions')
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
      setError(err.message || 'Failed to submit quote request. Please try again.')
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your inquiry. Our team will review your request and send you a formal quotation within 24 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong><br />
                1. Check your email for confirmation<br />
                2. We'll send a detailed quotation<br />
                3. Review and sign the contract online<br />
                4. Arrange payment securely
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Close
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
            <h2 className="text-2xl font-bold text-gray-900">Request a Quote</h2>
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
              <p className="text-xs font-medium text-gray-700">Secure Transaction</p>
            </div>
            <div className="text-center">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">Formal Contract</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">Trade Assurance</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
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
                  Email Address *
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
                  Company Name *
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
                  Country *
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
                Phone Number
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
            <h3 className="font-semibold text-gray-900 border-b pb-2">Product Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
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
                  Target Price (USD)
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
                Specifications / Requirements
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
            <h3 className="font-semibold text-gray-900 border-b pb-2">Trade Terms</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Terms
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
                  Payment Terms
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
              Additional Message
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
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . I understand that this is a quote request and not a binding order.
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
                <span>Submit Quote Request</span>
              </>
            )}
          </button>

          {/* Trust Message */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>🔒 Your information is secure and will never be shared</p>
            <p>✓ We respond to all inquiries within 24 hours</p>
            <p>✓ Formal contract provided before payment</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteRequest
