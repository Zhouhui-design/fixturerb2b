import { useEffect } from 'react'

interface SalesmartlyChatProps {
  projectId: string
}

/**
 * Salesmartly Chat Widget Component
 * 
 * This component loads the Salesmartly chat widget which integrates:
 * - WhatsApp
 * - Facebook Messenger
 * - Instagram
 * - Telegram
 * - And more messaging platforms
 * 
 * To use:
 * 1. Sign up at https://www.salesmartly.com
 * 2. Get your project ID from the dashboard
 * 3. Add VITE_SALESMARTLY_PROJECT_ID to your .env file
 */
const SalesmartlyChat = ({ projectId }: SalesmartlyChatProps) => {
  useEffect(() => {
    if (!projectId) {
      console.warn('[Salesmartly] Project ID not provided. Chat widget will not load.')
      return
    }

    // Check if script is already loaded
    if (document.getElementById('salesmartly-script')) {
      return
    }

    // Create and inject the Salesmartly script
    const script = document.createElement('script')
    script.id = 'salesmartly-script'
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://assets.salesmartly.com/js/project.js'
    
    script.onload = () => {
      console.log('[Salesmartly] Widget loaded successfully')
      
      // Initialize the widget
      if ((window as any)._smcc) {
        (window as any)._smcc({
          id: projectId,
          container: 'body',
          lang: 'auto' // Auto-detect user language
        })
      }
    }

    script.onerror = (error) => {
      console.error('[Salesmartly] Failed to load widget:', error)
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('salesmartly-script')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [projectId])

  // This component doesn't render anything visible
  return null
}

export default SalesmartlyChat
