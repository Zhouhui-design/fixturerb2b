import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Phone, MapPin, Package, DollarSign, FileText, CheckCircle, XCircle, Clock, MessageSquare, Store, Building } from 'lucide-react'

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

interface QuoteRequest {
  id: string
  product_name: string
  customer_name: string
  customer_email: string
  company_name: string
  country: string
  phone: string
  quantity: string
  specifications: string
  target_price: string
  delivery_terms: string
  payment_terms: string
  message: string
  status: string
  created_at: string
}

const AdminDashboard = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [activeTab, setActiveTab] = useState<'contacts' | 'quotes'>('contacts')

  useEffect(() => {
    loadContactSubmissions()
    loadQuotes()
    
    // Subscribe to real-time updates
    const contactSubscription = supabase
      .channel('contact_submissions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_submissions' },
        () => {
          loadContactSubmissions()
        }
      )
      .subscribe()

    const quoteSubscription = supabase
      .channel('quote_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_requests' },
        () => {
          loadQuotes()
        }
      )
      .subscribe()

    return () => {
      contactSubscription.unsubscribe()
      quoteSubscription.unsubscribe()
    }
  }, [])

  const loadContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setContactSubmissions(data || [])
    } catch (error) {
      console.error('Error loading contact submissions:', error)
    }
  }

  const maskSensitiveInfo = (text: string | null, type: 'email' | 'phone'): string => {
    if (!text) return '-'
    if (type === 'email') {
      const [local, domain] = text.split('@')
      if (!domain) return '****'
      if (local.length <= 2) return '****@' + domain
      return local.substring(0, 2) + '****' + '@' + domain
    } else if (type === 'phone') {
      if (text.length <= 4) return '****'
      return text.substring(0, 2) + '****' + text.substring(text.length - 2)
    }
    return '****'
  }

  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setContactSubmissions(contactSubmissions.map(s => s.id === id ? { ...s, status: newStatus } : s))
      alert(`Status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Error loading quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q))
      
      alert(`Status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const filteredQuotes = filter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === filter)

  const filteredContacts = filter === 'all'
    ? contactSubmissions
    : contactSubmissions.filter(s => s.status === filter)

  const stats = {
    totalContacts: contactSubmissions.length,
    totalQuotes: quotes.length,
    pending: [...contactSubmissions, ...quotes].filter(q => q.status === 'new' || q.status === 'pending').length,
    reviewed: [...contactSubmissions, ...quotes].filter(q => q.status === 'read' || q.status === 'reviewed').length,
    replied: [...contactSubmissions, ...quotes].filter(q => q.status === 'replied' || q.status === 'quoted').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quote Requests Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and track customer inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Contact Submissions</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalContacts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Quote Requests</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalQuotes}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
            <div className="text-sm font-medium text-gray-500">Pending/New</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
            <div className="text-sm font-medium text-gray-500">Replied/Quoted</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.replied}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'contacts'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact Form Submissions ({contactSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'quotes'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Product Quote Requests ({quotes.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'new', 'read', 'replied', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Submissions List */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No contact submissions</h3>
                <p className="text-gray-500 mt-1">New form submissions will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredContacts.map((submission) => (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                        <p className="text-sm text-gray-600">{submission.company || 'No company'}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'read' ? 'bg-blue-100 text-blue-800' :
                        submission.status === 'replied' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {maskSensitiveInfo(submission.email, 'email')}
                          <span className="text-xs text-gray-400 ml-2">(masked)</span>
                        </div>
                        {submission.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {maskSensitiveInfo(submission.phone, 'phone')}
                            <span className="text-xs text-gray-400 ml-2">(masked)</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {submission.store_area && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Store className="w-4 h-4 mr-2" />
                            Store Area: {submission.store_area}㎡
                          </div>
                        )}
                        {submission.requirement_type && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="w-4 h-4 mr-2" />
                            {submission.requirement_type}
                          </div>
                        )}
                      </div>
                    </div>

                    {submission.message && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <MessageSquare className="inline w-4 h-4 mr-1" />
                          <strong>Message:</strong> {submission.message}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500">
                        Received: {new Date(submission.created_at).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        {submission.status === 'new' && (
                          <button
                            onClick={() => updateContactStatus(submission.id, 'read')}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Mark Read
                          </button>
                        )}
                        {submission.status === 'read' && (
                          <button
                            onClick={() => updateContactStatus(submission.id, 'replied')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Mark Replied
                          </button>
                        )}
                        <a
                          href={`mailto:${submission.email}?subject=Re: Your Inquiry`}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Reply Email
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotes List */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No quote requests</h3>
              <p className="text-gray-500 mt-1">New inquiries will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <div key={quote.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{quote.customer_name}</h3>
                      <p className="text-sm text-gray-600">{quote.company_name}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'quoted' ? 'bg-green-100 text-green-800' :
                      quote.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quote.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {quote.customer_email}
                      </div>
                      {quote.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {quote.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {quote.country}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="w-4 h-4 mr-2" />
                        {quote.product_name} - {quote.quantity}
                      </div>
                      {quote.target_price && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Target: {quote.target_price}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {quote.delivery_terms} / {quote.payment_terms}
                      </div>
                    </div>
                  </div>

                  {quote.specifications && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Specifications:</strong> {quote.specifications}
                      </p>
                    </div>
                  )}

                  {quote.message && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Message:</strong> {quote.message}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      Received: {new Date(quote.created_at).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      {quote.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(quote.id, 'reviewed')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {quote.status === 'reviewed' && (
                        <button
                          onClick={() => updateStatus(quote.id, 'quoted')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Mark Quoted
                        </button>
                      )}
                      {(quote.status === 'quoted' || quote.status === 'reviewed') && (
                        <>
                          <button
                            onClick={() => updateStatus(quote.id, 'converted')}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                          >
                            Converted
                          </button>
                          <button
                            onClick={() => updateStatus(quote.id, 'lost')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Lost
                          </button>
                        </>
                      )}
                      <a
                        href={`mailto:${quote.customer_email}?subject=Re: Quote Request for ${quote.product_name}`}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Reply Email
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
