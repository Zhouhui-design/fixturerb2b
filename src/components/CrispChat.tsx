import { useEffect } from 'react'

interface CrispChatProps {
  websiteId: string
}

/**
 * Crisp Chat Widget Component
 * 
 * Crisp is a lightweight customer messaging platform:
 * - Live chat
 * - Chatbot automation
 * - Email integration
 * - Mobile app
 * 
 * Benefits:
 * - Easy registration (email only)
 * - No domain restrictions
 * - Very lightweight
 * - Free plan available
 * 
 * To use:
 * 1. Sign up at https://crisp.chat
 * 2. Create a website
 * 3. Get your Website ID from Settings → Website Settings
 * 4. Add VITE_CRISP_WEBSITE_ID to your .env file
 */
const CrispChat = ({ websiteId }: CrispChatProps) => {
  useEffect(() => {
    if (!websiteId) {
      console.warn('[Crisp] Website ID not provided. Chat widget will not load.')
      return
    }

    // Check if Crisp is already loaded
    if ((window as any).$crisp) {
      return
    }

    // Initialize Crisp
    ;(window as any).$crisp = []
    ;(window as any).CRISP_WEBSITE_ID = websiteId

    // Create and inject the Crisp script
    const script = document.createElement('script')
    script.id = 'crisp-script'
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://client.crisp.chat/l.js'
    
    script.onload = () => {
      console.log('[Crisp] Widget loaded successfully')
    }

    script.onerror = (error) => {
      console.error('[Crisp] Failed to load widget:', error)
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('crisp-script')
      if (existingScript) {
        existingScript.remove()
      }
      // Remove Crisp from window
      delete (window as any).$crisp
      delete (window as any).CRISP_WEBSITE_ID
    }
  }, [websiteId])

  // This component doesn't render anything visible
  return null
}

export default CrispChat
