import { useEffect } from 'react'

interface TidioChatProps {
  publicKey: string
}

/**
 * Tidio Chat Widget Component
 * 
 * Tidio is a customer service platform that provides:
 * - Live chat widget
 * - Chatbot automation
 * - Email integration
 * - Facebook Messenger integration
 * - Mobile app for iOS and Android
 * 
 * Benefits for Chinese users:
 * - Works well in China (no VPN needed for setup)
 * - Email registration (no foreign phone number required)
 * - Free plan available
 * - Easy to integrate WhatsApp later
 * 
 * To use:
 * 1. Sign up at https://www.tidio.com (email only, no phone needed)
 * 2. Get your Public Key from Dashboard → Settings → Developer
 * 3. Add VITE_TIDIO_PUBLIC_KEY to your .env file
 */
const TidioChat = ({ publicKey }: TidioChatProps) => {
  useEffect(() => {
    if (!publicKey) {
      console.warn('[Tidio] Public key not provided. Chat widget will not load.')
      return
    }

    // Check if script is already loaded
    if (document.getElementById('tidio-script')) {
      return
    }

    // Create and inject the Tidio script
    const script = document.createElement('script')
    script.id = 'tidio-script'
    script.type = 'text/javascript'
    script.async = true
    script.src = `//code.tidio.co/${publicKey}.js`
    
    script.onload = () => {
      console.log('[Tidio] Widget loaded successfully')
    }

    script.onerror = (error) => {
      console.error('[Tidio] Failed to load widget:', error)
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('tidio-script')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [publicKey])

  // This component doesn't render anything visible
  return null
}

export default TidioChat
