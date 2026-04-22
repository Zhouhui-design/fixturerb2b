import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from './ui/button'

declare global {
  interface Window {
    CHAT_SYSTEM_API: string;
  }
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    setIsSending(true)
    
    try {
      // Call chat-system API
      const response = await fetch(window.CHAT_SYSTEM_API || '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          source: 'website_chat_widget'
        })
      })

      if (response.ok) {
        setMessage('')
        alert('Message sent! We will reply within 24 hours.')
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Chat API error:', error)
      alert('Failed to send message. Please try again later.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-wood text-white rounded-full shadow-xl hover:bg-wood-light hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-charcoal text-white px-6 py-4 rounded-t-lg">
            <h3 className="font-semibold">Chat With Us</h3>
            <p className="text-sm text-white/70">We typically reply within 24 hours</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Have questions about our products or services? Send us a message and we'll get back to you soon.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-wood transition-colors"
            />

            <Button
              variant="accent"
              className="w-full"
              onClick={handleSend}
              disabled={isSending || !message.trim()}
            >
              {isSending ? 'Sending...' : (
                <>
                  Send Message
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
