import { useState } from 'react'
import { MessageCircle, Mail, Send } from 'lucide-react'

/**
 * Multi-Channel Contact Widget
 * Provides multiple contact options for international customers
 */
const MultiChannelContact = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Configure your contact methods here
  const contactMethods = [
    {
      id: 'tidio',
      name: 'Online Chat',
      description: 'Chat with us now',
      icon: '💬',
      action: () => {
        // Trigger Tidio chat to open
        if ((window as any).tidioChatApi) {
          ;(window as any).tidioChatApi.open()
        }
        setIsOpen(false)
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Send us an email',
      icon: '📧',
      link: 'mailto:your-email@example.com',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Message us on Telegram',
      icon: '✈️',
      link: 'https://t.me/your_username',
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: 'facebook',
      name: 'Facebook Messenger',
      description: 'Chat on Facebook',
      icon: '📘',
      link: 'https://m.me/your_page',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'DM us on Instagram',
      icon: '📷',
      link: 'https://instagram.com/your_account',
      color: 'bg-pink-500 hover:bg-pink-600'
    }
    // Add WhatsApp later when you have it set up
    // {
    //   id: 'whatsapp',
    //   name: 'WhatsApp',
    //   description: 'Chat on WhatsApp',
    //   icon: '💚',
    //   link: 'https://wa.me/86YOUR_NUMBER',
    //   color: 'bg-green-500 hover:bg-green-600'
    // }
  ]

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Contact Options Menu */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
            Contact Us
          </h3>
          <div className="space-y-2">
            {contactMethods.map((method) => (
              <a
                key={method.id}
                href={method.link || '#'}
                onClick={(e) => {
                  if (method.action) {
                    e.preventDefault()
                    method.action()
                  }
                }}
                target={method.link ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`${method.color} text-white rounded-lg p-3 flex items-center space-x-3 transition-all duration-200 transform hover:scale-105`}
              >
                <span className="text-2xl">{method.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{method.name}</div>
                  <div className="text-xs opacity-90">{method.description}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-wood hover:bg-wood-light text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-110"
        aria-label="Contact options"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}

export default MultiChannelContact
