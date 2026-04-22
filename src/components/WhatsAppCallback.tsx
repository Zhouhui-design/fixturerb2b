import { useState } from 'react'
import { Phone, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

/**
 * WhatsApp Callback Request Form
 * Allows customers to request a WhatsApp call back
 * Stores the request in Supabase for you to follow up
 */
const WhatsAppCallback = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Store the callback request in Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            message: `WhatsApp callback request: ${formData.message}`,
            requirement_type: 'whatsapp_callback',
            status: 'new'
          }
        ])

      if (error) throw error

      setSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setFormData({ name: '', phone: '', message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error submitting callback request:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-40 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110"
        title="Request WhatsApp callback"
      >
        <Phone className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Request WhatsApp Callback</h2>
                <p className="text-gray-600 mb-6">
                  Leave your details and we'll contact you on WhatsApp
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood"
                      placeholder="+1 234 567 8900"
                    />
                    <p className="text-xs text-gray-500 mt-1">Include country code</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-wood resize-none"
                      rows={3}
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Callback'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Request Received!</h3>
                <p className="text-gray-600">
                  We'll contact you on WhatsApp within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default WhatsAppCallback
