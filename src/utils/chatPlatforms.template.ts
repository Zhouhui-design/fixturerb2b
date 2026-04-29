/**
 * Chat Platform Helpers Template
 * 
 * Use this file as a template to add new chat platform integrations.
 * Simply copy the pattern below and customize for each platform.
 * 
 * Example platforms to add:
 * - WhatsApp (requires WhatsApp Business API or wa.me links)
 * - Telegram (t.me links)
 * - Line (line.me links)
 * - Viber (viber:// links)
 * - KakaoTalk (kakaotalk:// links)
 * - Zalo (zalo.me links)
 * - And more...
 */

import { siteConfig } from '../config/site'

/**
 * Template for opening a chat platform
 * Replace PLATFORM_NAME with actual platform name
 */
export const openPLATFORM_NAMEChat = (): void => {
  // Option 1: Direct link to web chat
  const webUrl = 'https://platform.com/chat'
  window.open(webUrl, '_blank')
}

/**
 * Template for platforms that use username/ID
 * Example: Telegram, Line
 */
/*
export const openPLATFORM_NAMEById = async (): Promise<void> => {
  try {
    // Get the platform ID from config (add to siteConfig first)
    const platformId = 'YourPlatformUsername' // Replace with actual config reference
    
    // Option 1: Copy ID to clipboard
    await navigator.clipboard.writeText(platformId)
    alert('Platform ID copied to clipboard! Please add us on Platform.')
    
    // Option 2: Open direct link (if available)
    // window.open(`https://platform.com/${platformId}`, '_blank')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
*/

/**
 * Template for platforms with phone number
 * Example: WhatsApp
 */
export const openPLATFORM_NAMEByPhone = (): void => {
  const phoneNumber = '+86XXXXXXXXXXX' // Replace with actual number
  const message = 'Hello! I\'m interested in your products.'
  
  // WhatsApp web link format
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

// ============================================================================
// EXAMPLE IMPLEMENTATIONS (Uncomment and customize as needed)
// ============================================================================

/**
 * WhatsApp Integration
 * Note: Requires WhatsApp Business account
 */
/*
export const openWhatsAppChat = (): void => {
  const phoneNumber = siteConfig.contact.whatsapp || '+86XXXXXXXXXXX'
  const message = 'Hello! I\'m interested in your furniture solutions.'
  
  // Remove + sign for wa.me link
  const cleanNumber = phoneNumber.replace(/\+/g, '').replace(/\s/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}
*/

/**
 * Telegram Integration
 */
/*
export const openTelegramChat = async (): Promise<void> => {
  try {
    const telegramUsername = siteConfig.contact.telegram || 'YourTelegramUsername'
    
    // Option 1: Copy username
    await navigator.clipboard.writeText(telegramUsername)
    alert('Telegram username copied! Search for @' + telegramUsername + ' in Telegram.')
    
    // Option 2: Direct link (opens Telegram app or web)
    // window.open(`https://t.me/${telegramUsername}`, '_blank')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
*/

/**
 * Line Integration
 */
/*
export const openLineChat = async (): Promise<void> => {
  try {
    const lineId = siteConfig.contact.line || 'YourLineID'
    
    // Copy Line ID
    await navigator.clipboard.writeText(lineId)
    alert('Line ID copied! Search for ' + lineId + ' in Line app.')
    
    // Or use Line QR code URL if available
    // window.open(`https://line.me/ti/p/~${lineId}`, '_blank')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
*/

/**
 * Viber Integration
 */
/*
export const openViberChat = (): void => {
  const viberNumber = siteConfig.contact.viber || '+86XXXXXXXXXXX'
  const cleanNumber = viberNumber.replace(/\+/g, '').replace(/\s/g, '')
  
  // Viber link format
  const viberUrl = `viber://chat?number=${cleanNumber}`
  window.location.href = viberUrl
  
  // Fallback for desktop
  setTimeout(() => {
    window.open(`https://invite.viber.com/?number=${cleanNumber}`, '_blank')
  }, 1000)
}
*/

/**
 * KakaoTalk Integration (Popular in Korea)
 */
/*
export const openKakaoTalkChat = async (): Promise<void> => {
  try {
    const kakaoId = siteConfig.contact.kakaoTalk || 'YourKakaoID'
    
    await navigator.clipboard.writeText(kakaoId)
    alert('KakaoTalk ID copied! Search for ' + kakaoId + ' in KakaoTalk.')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
*/

/**
 * Zalo Integration (Popular in Vietnam)
 */
/*
export const openZaloChat = (): void => {
  const zaloNumber = siteConfig.contact.zalo || '0XXXXXXXXXX'
  
  // Zalo web link
  const zaloUrl = `https://zalo.me/${zaloNumber}`
  window.open(zaloUrl, '_blank')
}
*/

/**
 * WeChat Integration (Already implemented in larkHelper.ts)
 * Can be moved here for consistency
 */
/*
export const openWeChatChat = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(siteConfig.contact.wechat)
    alert('WeChat ID copied to clipboard! Please add us in WeChat.')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
*/

// ============================================================================
// HOW TO ADD A NEW CHAT PLATFORM
// ============================================================================

/*
Step 1: Add platform ID/username to siteConfig
----------------------------------------------
Edit /src/config/site.ts and add:

export const siteConfig = {
  contact: {
    // ... existing fields
    whatsapp: '+86XXXXXXXXXXX',
    telegram: 'YourTelegramUsername',
    line: 'YourLineID',
    // ... add more as needed
  }
}

Step 2: Create helper function
-------------------------------
Copy one of the templates above and customize it for your platform.
Add it to this file or create a new file.

Step 3: Add icon component
---------------------------
Edit /src/components/Footer.tsx and add:

const PlatformIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    {/* Add platform's SVG path here *\/}
  </svg>
)

Step 4: Add button to Footer
-----------------------------
In Footer.tsx, add to the chat platforms array:

{
  icon: PlatformIcon,
  href: '#',
  label: 'Platform Name',
  onClick: openPlatformChat
}

Step 5: Add button to Contact Page (optional)
----------------------------------------------
Edit /src/pages/ContactPage.tsx and add similar button structure.

Step 6: Add translations
-------------------------
Edit /src/i18n/translations.ts and add platform name translations.

Step 7: Test!
--------------
- Test on desktop browser
- Test on mobile browser
- Verify links work correctly
- Check clipboard copy functionality
*/
