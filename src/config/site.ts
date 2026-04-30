// Site configuration - easily replaceable from backend
export const siteConfig = {
  contact: {
    email: 'aardenx@outlook.com',
    phone: '', // International calls not available yet
    address: 'addressPlaceholder', // Will be replaced by translation
    whatsapp: '+86XXXXXXXXXXX',
    wechat: 'YourWeChatID', // TODO: Replace with your actual WeChat ID
    lark: 'YourLarkID', // TODO: Replace with your actual Lark user_id or open_id
    dingtalk: 'YourDingTalkID', // TODO: Replace with your actual DingTalk ID
    chatSystem: '/chat', // Link to your chat-system
    // Lark AppLink for direct chat opening (Scheme 1 - Recommended)
    // Format: larksuite://open?user_id=[YOUR_USER_ID]&action=chat
    // Get your user_id from: Lark > Settings > Account & Security > API Access
    larkAppLink: 'larksuite://open?user_id=YourLarkUserID&action=chat' // TODO: Replace YourLarkUserID with actual ID
  },
  social: {
    tiktok: 'https://www.tiktok.com/@huizhou56',
    instagram: '#',
    linkedin: '#',
    twitter: '#'
  },
  images: {
    hero: [
      '/images/hero-boutique.jpg',
      '/images/factory-workshop.jpg',
      '/images/product-showcase.jpg'
    ],
    // These can be replaced from backend
    products: {
      default: '/images/product-showcase.jpg',
      scene: '/images/hero-boutique.jpg'
    },
    cases: [
      '/images/hero-boutique.jpg',
      '/images/factory-workshop.jpg',
      '/images/product-showcase.jpg'
    ]
  }
}
