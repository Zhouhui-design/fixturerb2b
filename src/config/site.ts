// Site configuration - easily replaceable from backend
export const siteConfig = {
  contact: {
    email: 'info@fixturerb2b.top',
    phone: '+86 XXX XXXX XXXX',
    address: 'China Manufacturing Base',
    whatsapp: '+86XXXXXXXXXXX',
    wechat: 'YourWeChatID',
    lark: 'YourLarkID',
    dingtalk: 'YourDingTalkID',
    chatSystem: '/chat' // Link to your chat-system
  },
  social: {
    facebook: '#',
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
