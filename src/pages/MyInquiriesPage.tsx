import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Phone, Calendar, Package, MessageSquare, User, Building, Store, ClipboardList } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  store_area: number | null
  requirement_type: string | null
  need_oem: boolean
  message: string
  status: string
  created_at: string
}

const MyInquiriesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setHasSearched(true)

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('name', formData.name.trim())
        .eq('email', formData.email.trim().toLowerCase())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching submissions:', error)
        setError('Failed to fetch your inquiries. Please try again.')
        setSubmissions([])
      } else {
        setSubmissions(data || [])
        if (!data || data.length === 0) {
          setError('No inquiries found with this name and email combination.')
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const maskPhone = (phone: string | null): string => {
    if (!phone) return '-'
    if (phone.length <= 4) return '****'
    return phone.substring(0, 2) + '****' + phone.substring(phone.length - 2)
  }

  const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@')
    if (!domain) return '****'
    if (local.length <= 2) return '****'
    return local.substring(0, 2) + '****' + '@' + domain
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      new: { label: 'New', color: 'bg-blue-100 text-blue-800' },
      read: { label: 'Read', color: 'bg-green-100 text-green-800' },
      replied: { label: 'Replied', color: 'bg-purple-100 text-purple-800' },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800' }
    }
    const { label, color } = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Inquiries
          </h1>
          <p className="text-gray-600">
            View your inquiry history by entering your name and email
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Searching...' : 'Search My Inquiries'}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {submissions.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Inquiry History ({submissions.length})
                </h2>
                <p className="text-sm text-gray-600">
                  Showing all inquiries submitted with this name and email
                </p>
              </div>
            )}

            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Inquiry #{submission.id.substring(0, 8)}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(submission.created_at)}
                      </div>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Name: </span>
                        <span className="ml-1 font-medium">{submission.name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Email: </span>
                        <span className="ml-1 font-medium">{maskEmail(submission.email)}</span>
                      </div>
                      {submission.company && (
                        <div className="flex items-center text-sm">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Company: </span>
                          <span className="ml-1 font-medium">{submission.company}</span>
                        </div>
                      )}
                      {submission.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Phone: </span>
                          <span className="ml-1 font-medium">{maskPhone(submission.phone)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {submission.store_area && (
                        <div className="flex items-center text-sm">
                          <Store className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Store Area: </span>
                          <span className="ml-1 font-medium">{submission.store_area}㎡</span>
                        </div>
                      )}
                      {submission.requirement_type && (
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Requirement: </span>
                          <span className="ml-1 font-medium">{submission.requirement_type}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <ClipboardList className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">OEM Service: </span>
                        <span className="ml-1 font-medium">{submission.need_oem ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {submission.message && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <MessageSquare className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Your Message:</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{submission.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Privacy Notice:</strong> For security, phone numbers and emails are partially masked. 
            Only you can view your complete information by verifying your name and email.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MyInquiriesPage
