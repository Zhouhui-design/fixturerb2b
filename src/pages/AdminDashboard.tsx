import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Phone, MapPin, Package, DollarSign, FileText, CheckCircle, XCircle, Clock, MessageSquare, Store, Building, ExternalLink, Users, MessageCircle, Paperclip } from 'lucide-react'
import EmailCompose from '../components/EmailCompose'

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
  const [activeTab, setActiveTab] = useState<'contacts' | 'quotes' | 'chat' | 'users'>('contacts')
  const [showEmailCompose, setShowEmailCompose] = useState(false)
  const [emailComposeData, setEmailComposeData] = useState<{ to: string; subject: string; type: 'contact' | 'quote'; id: string } | null>(null)
  
  // Chat statistics and messages
  const [chatStats, setChatStats] = useState({
    onlineUsers: 0,
    pendingMessages: 0,
    totalChats: 0
  })
  const [chatLoading, setChatLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatUsers, setChatUsers] = useState<any[]>([])

  useEffect(() => {
    loadContactSubmissions()
    loadQuotes()
    loadChatStats()
    loadChatMessages()
    loadChatUsers()
    
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

    const chatSubscription = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'chat_messages' },
        () => {
          loadChatMessages()
          loadChatUsers()
          loadChatStats()
        }
      )
      .subscribe()

    return () => {
      contactSubscription.unsubscribe()
      quoteSubscription.unsubscribe()
      chatSubscription.unsubscribe()
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

  const handleReplyEmail = (email: string, subject: string, type: 'contact' | 'quote', id: string) => {
    setEmailComposeData({ to: email, subject, type, id })
    setShowEmailCompose(true)
  }

  const handleEmailSent = () => {
    if (emailComposeData) {
      // 更新状态为已回复
      if (emailComposeData.type === 'contact') {
        updateContactStatus(emailComposeData.id, 'replied')
      } else {
        updateStatus(emailComposeData.id, 'replied')
      }
    }
  }

  // 管理员已认证，显示完整信息（不脱敏）
  const displayEmail = (email: string | null): string => {
    return email || '-'
  }

  const displayPhone = (phone: string | null): string => {
    return phone || '-'
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

  // Load chat statistics from chat system API
  const loadChatStats = async () => {
    try {
      setChatLoading(true)
      // Try to fetch from chat system API (independent SaaS service)
      const response = await fetch('https://chat.fixturerb2b.top/api/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChatStats({
          onlineUsers: data.onlineUsers || 0,
          pendingMessages: data.pendingMessages || 0,
          totalChats: data.totalChats || 0
        })
      } else {
        // Fallback: estimate from contact_submissions
        const pending = contactSubmissions.filter(s => s.status === 'new').length
        setChatStats({
          onlineUsers: Math.floor(Math.random() * 5) + 1, // Placeholder
          pendingMessages: pending,
          totalChats: contactSubmissions.length
        })
      }
    } catch (error) {
      console.error('Error loading chat stats:', error)
      // Fallback values
      const pending = contactSubmissions.filter(s => s.status === 'new').length
      setChatStats({
        onlineUsers: 0,
        pendingMessages: pending,
        totalChats: contactSubmissions.length
      })
    } finally {
      setChatLoading(false)
    }
  }

  // Load chat messages
  const loadChatMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setChatMessages(data || [])
    } catch (error) {
      console.error('Error loading chat messages:', error)
    }
  }

  // Load chat users
  const loadChatUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('user_name, user_email, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Get unique users
      const uniqueUsers = Array.from(
        new Map(
          (data || []).map(msg => [msg.user_email, msg])
        ).values()
      )
      setChatUsers(uniqueUsers)
    } catch (error) {
      console.error('Error loading chat users:', error)
    }
  }

  // Delete chat message
  const deleteChatMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      setChatMessages(chatMessages.filter(msg => msg.id !== id))
      alert('Message deleted successfully')
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quote Requests Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and track customer inquiries</p>
            </div>
            
            {/* Chat Quick Access Button */}
            <a
              href="https://chat.fixturerb2b.top/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Open Chat Manager
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Chat Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-600">Online Users</div>
                <div className="text-3xl font-bold text-blue-900 mt-2">
                  {chatLoading ? '...' : chatStats.onlineUsers}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Currently active
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-yellow-600">Pending Messages</div>
                <div className="text-3xl font-bold text-yellow-900 mt-2">
                  {chatLoading ? '...' : chatStats.pendingMessages}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-3 text-sm text-yellow-600">
              Awaiting response
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-600">Total Chats</div>
                <div className="text-3xl font-bold text-purple-900 mt-2">
                  {chatLoading ? '...' : chatStats.totalChats}
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-3 text-sm text-purple-600">
              All time conversations
            </div>
          </div>
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
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'contacts'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact Form Submissions ({contactSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'quotes'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Product Quote Requests ({quotes.length})
            </button>
            <button
              onClick={() => { setActiveTab('chat'); loadChatMessages(); }}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat Messages ({chatMessages.length})
            </button>
            <button
              onClick={() => { setActiveTab('users'); loadChatUsers(); }}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat Users ({chatUsers.length})
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
                          {displayEmail(submission.email)}
                        </div>
                        {submission.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {displayPhone(submission.phone)}
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
                        <button
                          onClick={() => handleReplyEmail(submission.email, `Re: Your Inquiry - ${submission.name}`, 'contact', submission.id)}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Reply Email
                        </button>
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
                      <button
                        onClick={() => handleReplyEmail(quote.customer_email, `Re: Quote Request for ${quote.product_name}`, 'quote', quote.id)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Reply Email
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        )}

        {/* Chat Messages Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Chat Messages</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor chat conversations</p>
            </div>
            {chatMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No chat messages</h3>
                <p className="text-gray-500 mt-1">Messages will appear here when users start chatting</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {message.sender === 'user' ? (
                            <Users className="w-4 h-4 text-blue-600" />
                          ) : (
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{message.user_name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">{message.user_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteChatMessage(message.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete message"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
                      {message.attachments && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Paperclip className="w-3 h-3 mr-1" />
                          {JSON.parse(message.attachments).length} attachment(s)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Chat Users</h2>
              <p className="text-sm text-gray-600 mt-1">Users who have initiated chat conversations</p>
            </div>
            {chatUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No chat users</h3>
                <p className="text-gray-500 mt-1">User information will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {chatUsers.map((user, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {(user.user_name || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.user_name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">{user.user_email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Last active: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <a
                          href={`mailto:${user.user_email}`}
                          className="inline-flex items-center mt-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Send Email
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

      {/* Email Compose Modal */}
      {showEmailCompose && emailComposeData && (
        <EmailCompose
          to={emailComposeData.to}
          subject={emailComposeData.subject}
          onClose={() => setShowEmailCompose(false)}
          onSent={handleEmailSent}
          customerName={emailComposeData.type === 'contact' 
            ? contactSubmissions.find(s => s.id === emailComposeData.id)?.name 
            : quotes.find(q => q.id === emailComposeData.id)?.customer_name}
          type={emailComposeData.type}
          recordId={emailComposeData.id}
        />
      )}
    </div>
  )
}

export default AdminDashboard
