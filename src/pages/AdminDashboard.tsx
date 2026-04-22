import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Phone, MapPin, Package, DollarSign, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

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
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)

  useEffect(() => {
    loadQuotes()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('quote_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_requests' },
        () => {
          loadQuotes()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    reviewed: quotes.filter(q => q.status === 'reviewed').length,
    quoted: quotes.filter(q => q.status === 'quoted').length,
    converted: quotes.filter(q => q.status === 'converted').length
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
            <div className="text-sm font-medium text-gray-500">Reviewed</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.reviewed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
            <div className="text-sm font-medium text-gray-500">Quoted</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.quoted}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-400">
            <div className="text-sm font-medium text-gray-500">Converted</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">{stats.converted}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'reviewed', 'quoted', 'converted', 'lost'].map((status) => (
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

        {/* Quotes List */}
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
      </div>
    </div>
  )
}

export default AdminDashboard
