// Multi-language translations
export type Language = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'ar' | 'pt' | 'ru'

export interface Translations {
  nav: {
    solutions: string
    products: string
    cases: string
    resources: string
    about: string
    contact: string
    consultation: string
  }
  hero: {
    title: string
    subtitle: string
    trustStatement: string
    exploreSolutions: string
    contactExpert: string
  }
  capabilities: {
    title: string
    reqToDrawings: string
    reqToDrawingsDesc: string
    drawingsToReality: string
    drawingsToRealityDesc: string
    oemOdm: string
    oemOdmDesc: string
  }
  solutions: {
    title: string
    womenswear: string
    boutique: string
    sports: string
    kids: string
    tags: {
      elegant: string
      textured: string
      lightingAtmosphere: string
      trendy: string
      unique: string
      curatedDisplay: string
      dynamic: string
      functional: string
      activeLifestyle: string
      playful: string
      flexible: string
      quickTurnover: string
    }
  }
  blueprint: {
    title: string
    subtitle: string
    customerProvided: string
    finishedProduct: string
    reproduction: string
    originalDrawing: string
    actualProduct: string
    comparisons: Array<{description: string}>
  }
  products: {
    title: string
    subtitle: string
    viewAll: string
    viewDetails: string
    getQuote: string
    learnMore: string
    items: Array<{
      name: string
      description: string
      specs: string
    }>
  }
  productsPage: {
    title: string
    subtitle: string
    customSolutionTitle: string
    customSolutionSubtitle: string
    getInTouch: string
  }
  productDetail: {
    backToProducts: string
    specifications: string
    material: string
    loadCapacity: string
    customizableSizes: string
    easyAssembly: string
    requestQuote: string
    downloadSpecs: string
    description: string
    shirtRackDescription: string
    bagRackDescription: string
  }
  aboutPage?: {
    heroBadge: string
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
    startProject: string
    viewProcess: string
    brandStoryTitle: string
    brandStoryP1: string
    brandStoryP2: string
    brandStoryP3: string
    brandStoryP4: string
    brandStoryP5: string
    brandStoryP6: string
    companyTitle: string
    companyName: string
    registeredOPC: string
    founder: string
    paidUpCapital: string
    specialization: string
    businessLicenseTitle: string
    registrationNo: string
    verification: string
    verificationLink: string
    transparent: string
    whatWeDoTitle: string
    whatWeDo1: string
    whatWeDo2: string
    whatWeDo3: string
    whatWeDo4: string
    ourPromise: string
    howWeWorkTitle: string
    howWeWorkSubtitle: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
    step4Title: string
    step4Desc: string
    step5Title: string
    step5Desc: string
    step6Title: string
    step6Desc: string
    responsibility: string
    founderNoteTitle: string
    founderNoteP1: string
    founderNoteP2: string
    founderName: string
    founderTitle: string
    ctaTitle: string
    ctaDescription: string
    getInTouch: string
    contactNote: string
  }
  contact: {
    title: string
    subtitle: string
    sendMessageTitle: string
    nameLabel: string
    companyLabel: string
    emailLabel: string
    phoneLabel: string
    storeAreaLabel: string
    requirementTypeLabel: string
    requirementTypePlaceholder: string
    requirementTypes?: {
      materialSampling: string
      productSampling: string
      formalOrder: string
      quoteRequest: string
      customizationDiscussion: string
      reorder: string
    }
    needOEMLabel: string
    appointmentTimeLabel?: string
    appointmentTimePlaceholder?: string
    uploadDrawingsLabel: string
    uploadFormats: string
    uploadTip?: string
    messageLabel: string
    messagePlaceholder: string
    sendInquiry: string
    responseTime: string
    successMessage: string
    failMessage: string
    contactInfoTitle: string
    email: string
    phone: string
    address: string
    companyAddress?: string // Optional - will fallback to English if not provided
    connectTitle: string
    chatSystem: string
    lark?: string // Optional
    dingtalk?: string // Optional
    wechat?: string // Optional
    clickToChat?: string // Optional
    businessHours: string
    businessHoursContent: string
    aiSupport: string
    aiSupportContent: string
    phoneNotice?: string
    phoneNoticeText?: string
  }
  cases: {
    title: string
    subtitle: string
    viewAll: string
    items: Array<{
      name: string
      result: string
    }>
  }
  services: {
    title: string
    subtitle: string
    customDesign: string
    customDesignDesc: string
    oemOdm: string
    oemOdmDesc: string
    spacePlanning: string
    spacePlanningDesc: string
    installationSupport: string
    installationSupportDesc: string
    processTitle: string
    steps: Array<string>
    ctaTitle: string
    ctaSubtitle: string
    contactUs: string
  }
  caseDetail: {
    backToCases: string
    projectOverview: string
    projectOverviewDesc: string
    challenge: string
    challengeDesc: string
    solution: string
    solutionDesc: string
    results: string
    result1: string
    result2: string
    result3: string
    startProject: string
  }
  brandStory: {
    title: string
    paragraph1: string
    paragraph2: string
    paragraph3: string
    quote: string
  }
  trust: {
    trustedBy: string
    testimonials: string
    yearsExperience: string
    storesServed: string
    reproductionPromise: string
    brands: Array<{ name: string }>
    testimonialsList: Array<{
      quote: string
      author: string
      role: string
    }>
  }
  cta: {
    title: string
    subtitle: string
    button: string
    promise: string
  }
  footer: {
    description: string
    quickLinks: string
    contactUs: string
    newsletter: string
    newsletterDesc: string
    subscribe: string
    privacyPolicy: string
    termsOfService: string
    yourEmail: string
    premiumQuality: string
  }
  common: {
    loading: string
    error: string
    send: string
    sending: string
    success: string
    close: string
  }
  trustBanner: {
    text: string
  }
  quoteRequest?: {
    title: string
    submittedTitle: string
    submittedMessage: string
    nextSteps: string
    step1: string
    step2: string
    step3: string
    step4: string
    contactInfo: string
    fullName: string
    emailAddress: string
    companyName: string
    country: string
    phoneNumber: string
    productDetails: string
    quantity: string
    targetPrice: string
    specifications: string
    tradeTerms: string
    deliveryTerms: string
    paymentTerms: string
    additionalMessage: string
    termsAgreement: string
    submitButton: string
    submitting: string
    secureInfo: string
    responseTime: string
    contractInfo: string
    errorAgreeTerms: string
    errorSubmit: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      solutions: 'Solutions',
      products: 'Products',
      cases: 'Cases',
      resources: 'Resources',
      about: 'About',
      contact: 'Contact',
      consultation: 'Free Store Consultation'
    },
    hero: {
      title: 'Commercial Furniture Manufacturing.',
      subtitle: 'You provide the requirements, we jointly verify drawing details, I refine the craftsmanship, and produce according to drawing standards.',
      trustStatement: 'Accepting requirements ——> verifying drawings ——> quick response with estimated completion date & quick quotation ——> every process follows SOP/SIP for production and inspection ——> packaging strictly follows BOM list & packing list marked according to entire BOM',
      exploreSolutions: 'Explore Solutions',
      contactExpert: 'Contact Expert'
    },
    capabilities: {
      title: 'What Can We Do?',
      reqToDrawings: 'Requirements → Drawings',
      reqToDrawingsDesc: 'Whether hand-drawn sketches, photos, or ideas, we can help you translate them into precise production drawings.',
      drawingsToReality: 'Drawings → Reality',
      drawingsToRealityDesc: 'Build according to drawings, 1:1 reproduction. Every detail, every material, completely consistent with the drawings.',
      oemOdm: 'OEM/ODM Services',
      oemOdmDesc: 'Accepting OEM/ODM. Your brand, we manufacture. No minimum order quantity threshold.'
    },
    solutions: {
      title: 'Professional Display Solutions for Different Apparel Categories',
      womenswear: 'High-End Women\'s Brand Stores',
      boutique: 'Fashion Collection Stores / Boutiques',
      sports: 'Sports / Casual Brand Stores',
      kids: 'Children\'s / Fast Fashion Stores',
      tags: {
        elegant: 'Elegant',
        textured: 'Textured',
        lightingAtmosphere: 'Lighting Atmosphere',
        trendy: 'Trendy',
        unique: 'Unique',
        curatedDisplay: 'Curated Display',
        dynamic: 'Dynamic',
        functional: 'Functional',
        activeLifestyle: 'Active Lifestyle',
        playful: 'Playful',
        flexible: 'Flexible',
        quickTurnover: 'Quick Turnover'
      }
    },
    blueprint: {
      title: 'Any Drawings, We Strive for 1:1 Implementation',
      subtitle: 'You handle the design, we\'ll find every way to turn it into reality.',
      customerProvided: 'Customer Provided',
      finishedProduct: 'Our Finished Product',
      reproduction: '1:1 Reproduction',
      originalDrawing: 'Original Drawing / Sketch',
      actualProduct: 'Actual Finished Product',
      comparisons: [
        { description: 'Custom retail shelving system - from concept to finished product' },
        { description: 'Boutique display fixtures - precise reproduction' },
        { description: 'Modular clothing racks - exact specifications met' }
      ]
    },
    products: {
      title: 'Our Display Systems',
      subtitle: 'We showcase only a few standard samples here. In reality, we provide highly creative and aesthetically stunning customized display solutions for different brand stores - each one a visual feast.',
      viewAll: 'View All Products',
      viewDetails: 'View Details',
      getQuote: 'Get Quote',
      learnMore: 'Learn More',
      items: [
        {
          name: 'Shirt Display Rack',
          description: 'Customizable with logo application',
          specs: 'Steel / Customizable / Logo printing'
        },
        {
          name: 'Bag Display Rack',
          description: 'Customizable with logo options',
          specs: 'Customizable / Logo printing'
        },
        {
          name: 'Shoe Display Rack',
          description: 'Customizable with logo application',
          specs: 'Customizable / Logo printing'
        },
        {
          name: 'Women\'s Clothing Display Rack - Gold Floor Standing Side Hanging Island Rack',
          description: 'Customizable with logo application',
          specs: 'Customizable / Logo printing'
        },
        {
          name: 'Display Cabinet with Drawers',
          description: 'Customizable with logo application',
          specs: 'Customizable / Logo printing'
        },
        {
          name: 'Men\'s and Women\'s Clothing Store Display Rack - Modern Minimalist Floor Standing Island Rack',
          description: 'Customizable with logo application',
          specs: 'Customizable / Logo printing'
        }
      ]
    },
    productsPage: {
      title: 'Our Products',
      subtitle: 'Professional store fixtures and display solutions for apparel retail',
      customSolutionTitle: 'Need a Custom Solution?',
      customSolutionSubtitle: 'Contact us to discuss your specific requirements',
      getInTouch: 'Get in Touch'
    },
    aboutPage: {
      heroBadge: '⚡ Registered OPC (One Person Company)',
      heroTitle: 'From blueprint to store<br />– I make it happen.',
      heroSubtitle: 'Your commercial furniture. One person, full control.',
      heroDescription: 'Direct coordination for custom store interiors. 10+ vetted factories, one responsible founder. No layers, no excuses.',
      startProject: 'Start a project →',
      viewProcess: 'View process',
      brandStoryTitle: 'Brand Story',
      brandStoryP1: '<strong>I spent years inside the commercial furniture industry – not just selling, but designing, costing, sourcing, and quality-controlling real projects for retail stores, showrooms, and brand shops.</strong>',
      brandStoryP2: 'I saw the same problem again and again: a store needs 50 to 100+ different custom items – counters, display racks, mid-island stands, light boxes, fitting room mirrors, wall shelves… each with its own design, quantity (sometimes just one piece), and material requirement. Most suppliers either refuse such complex orders or hand them to junior coordinators who miss details and delay timelines.',
      brandStoryP3: 'So I started <strong>Hangzhou Gouhui International Trade Co., Ltd.</strong> – a <strong>legally registered One-Person Company (OPC)</strong>. No board of directors. No sales team pushing quotas. Just me, a notebook full of supplier contacts, and a simple belief: <em>a complex store project deserves a single, responsible person who understands every detail.</em>',
      brandStoryP4: 'I personally review your store design and create a cost breakdown; match each item to the best-fit factory from my network of 10+ reliable commercial furniture suppliers; control quality, dimensions, finishes – because I used to do process deepening myself; coordinate shipping and delivery so you don\'t talk to five different people.',
      brandStoryP5: 'I don\'t have a huge factory. But I have something better: direct access to 10 specialized factories, and the personal drive to make your project right.',
      brandStoryP6: 'If you\'re a store owner or brand manager tired of being passed around, try me. One email, one person, one solution.',
      companyTitle: 'Company & Transparency',
      companyName: 'Hangzhou Gouhui International Trade Co., Ltd.',
      registeredOPC: '<strong>Registered OPC</strong> (One Person Company) – fully compliant with Chinese law.',
      founder: '<strong>Founder:</strong> Gou Hui',
      paidUpCapital: '<strong>Paid-up capital:</strong> RMB 100,000',
      specialization: '<strong>Specialization:</strong> Custom commercial furniture project coordination for retail stores, brand shops, and display spaces.',
      businessLicenseTitle: 'Public Business License',
      registrationNo: '<strong>Registration No.:</strong>',
      verification: '<strong>Verification:</strong> You can check our status on China\'s National Credit Information System',
      verificationLink: 'www.gsxt.gov.cn',
      transparent: '✅ Fully transparent – what you see is what we are.',
      whatWeDoTitle: 'What We Do Differently',
      whatWeDo1: 'One point of contact – the founder',
      whatWeDo2: '10+ vetted furniture factories',
      whatWeDo3: 'End-to-end: design review → costing → sourcing → QC → shipping',
      whatWeDo4: 'No hidden team photos, no fake "we" statements',
      ourPromise: 'Our promise: 50 or 500 custom pieces, I personally ensure every single one matches your specs.',
      howWeWorkTitle: 'How We Work',
      howWeWorkSubtitle: 'From your store plan to finished installation',
      step1Title: '📐 Share your store design & needs',
      step1Desc: 'Send floor plans, reference photos, or a simple list of required items (counters, racks, light boxes, mirrors, etc.). I\'ll help clarify.',
      step2Title: '💰 Detailed cost breakdown',
      step2Desc: 'Based on my industry experience (design, costing, sourcing), I break down every item: material options, estimated unit price, total cost, and lead time.',
      step3Title: '🏭 Match each item to the best factory',
      step3Desc: 'I work with 10+ specialized suppliers. I assign each product to the factory that gives you the best balance of quality, price, and delivery time.',
      step4Title: '🔍 Sampling & production follow-up',
      step4Desc: 'Samples arranged for key items. During mass production, I personally check dimensions, finishes, and assembly details.',
      step5Title: '✅ Quality control before shipping',
      step5Desc: 'Before anything leaves the factory, I inspect a representative batch. If something doesn\'t match specs, I stop it and get it corrected.',
      step6Title: '🚢 Shipping coordination & after-sales',
      step6Desc: 'I arrange sea/air/express shipping. You get one tracking summary, not ten different waybills. After delivery, if any hidden defect appears, email me – solution within 48 hours.',
      responsibility: 'One person, full responsibility. No hand-offs, no excuses.',
      founderNoteTitle: 'A Word from Gou Hui (Founder)',
      founderNoteP1: '"When you email me, you\'re not talking to a chatbot or a support ticket system. You\'re talking to the person who designs, costs, and coordinates your entire project. I reply within 24 hours on business days – not because I have to, but because that\'s how I\'d want to be treated.',
      founderNoteP2: 'I don\'t hide behind a \'team\' that doesn\'t exist. My company is small by design, so I can move fast, keep prices fair, and take full responsibility for every order. If something goes wrong, I fix it – personally."',
      founderName: '— Gou Hui',
      founderTitle: 'Founder, Hangzhou Gouhui International Trade Co., Ltd.',
      ctaTitle: 'Ready to equip your store?',
      ctaDescription: 'Send me your design or requirement list – I\'ll reply within 24 hours with a clear action plan.',
      getInTouch: 'Get in Touch →',
      contactNote: '📧 Contact us through the form | WeChat / WhatsApp available upon request'
    },
    productDetail: {
      backToProducts: '← Back to Products',
      description: 'Professional commercial-grade fixture for retail environments.',
      specifications: 'Specifications:',
      material: 'Material',
      loadCapacity: 'Load Capacity',
      customizableSizes: 'Customizable sizes available',
      easyAssembly: 'Easy assembly with included instructions',
      requestQuote: 'Request Quote',
      downloadSpecs: 'Download Specifications (PDF)',
      shirtRackDescription: 'Customizable',
      bagRackDescription: 'Customizable with logo options, customizable styles, colors, materials, structures, and dimensions'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to start your project? Get in touch with our team',
      sendMessageTitle: 'Send Us a Message',
      nameLabel: 'Name *',
      companyLabel: 'Company / Store Name',
      emailLabel: 'Email *',
      phoneLabel: 'Phone',
      storeAreaLabel: 'Store Area (sqm)',
      requirementTypeLabel: 'Requirement Type',
      requirementTypePlaceholder: 'Select (multiple choices allowed)...',
      requirementTypes: {
        materialSampling: 'Material Sampling',
        productSampling: 'Individual Product Sampling',
        formalOrder: 'Formal Order',
        quoteRequest: 'Quote Request',
        customizationDiscussion: 'Customization Discussion',
        reorder: 'Reorder'
      },
      needOEMLabel: 'I need OEM/ODM services (private labeling)',
      appointmentTimeLabel: 'Preferred Appointment Time',
      appointmentTimePlaceholder: 'XXX Timezone, YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM',
      uploadDrawingsLabel: 'Upload Drawings or Reference Images',
      uploadFormats: 'Accepted formats: ZIP, PDF, Excel, Word, JPG, PNG and other image formats (Max 10 files, 10MB each)',
      uploadTip: '💡 Tip: For .dwg files or videos, please compress them into a ZIP file before uploading.',
      messageLabel: 'Message *',
      messagePlaceholder: 'Tell us about your project requirements...',
      sendInquiry: 'Send Inquiry',
      responseTime: 'We typically respond within 24 hours',
      successMessage: 'Thank you! We will reply to your email within 2 hours. Please check your inbox.',
      failMessage: 'Failed to send. Please try again.',
      contactInfoTitle: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      companyAddress: 'Hangzhou, Zhejiang Province, China',
      connectTitle: 'Connect With Us',
      chatSystem: 'Chat System',
      lark: 'Lark',
      dingtalk: 'DingTalk',
      wechat: 'WeChat',
      clickToChat: 'Click to open chat',
      businessHours: 'Live Support Hours (Human Team)',
      businessHoursContent: 'Monday–Friday: 9:00 AM – 6:00 PM (GMT+8)<br />Saturday: 9:00 AM – 12:00 PM (GMT+8)<br />Sunday & public holidays: Closed',
      aiSupport: 'Outside These Hours?',
      aiSupportContent: 'Our AI assistant is available <strong>24/7</strong> to answer common questions, check orders, and help with quick issues. For complex requests, we\'ll get back to you within the next business day.',
      phoneNotice: 'Phone Service Notice',
      phoneNoticeText: 'International phone service is not available yet. Please use email, Lark, or our chat system to contact us. We apologize for any inconvenience.'
    },
    cases: {
      title: 'Real Stores · Real Transformations',
      subtitle: 'Real stores, real transformations - see how we\'ve helped businesses succeed',
      viewAll: 'View All Cases',
      items: [
        { name: 'Elegant Boutique Shanghai', result: 'Display SKU count +40%' },
        { name: 'Trend Collection Store Beijing', result: 'Customer dwell time +35%' },
        { name: 'Sports Brand Flagship Guangzhou', result: 'Sales conversion +25%' },
        { name: 'Kids Fashion Store Shenzhen', result: 'Space utilization +50%' },
        { name: 'Luxury Womenswear Hangzhou', result: 'Brand perception elevated' },
        { name: 'Fast Fashion Chain Chengdu', result: 'Restocking efficiency +60%' }
      ]
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive solutions for your retail display needs',
      customDesign: 'Craftsmanship Deepening',
      customDesignDesc: 'You can provide drawings, photos, or verbal descriptions. We will create craftsmanship drawings and verify every detail with you - from materials, colors, structures, quality standards, product usage scenarios, to installation methods. After confirming everything is correct, we proceed with craftsmanship deepening, mark SOP for craftsmanship and SIP for inspection, all the way through production completion, packing, and provide remote installation guidance services.',
      oemOdm: 'OEM/ODM Services',
      oemOdmDesc: 'Your brand, our manufacturing expertise. No minimum order quantities.',
      spacePlanning: 'Provide Sampling',
      spacePlanningDesc: 'We accept product sampling requests and material sampling requests (material sampling mainly focuses on color and material comparison).',
      installationSupport: 'Installation Support',
      installationSupportDesc: 'Detailed installation guides and remote support for seamless setup.',
      processTitle: 'Our Process',
      steps: [
        'Accept Requirements',
        'Match Requirements to Drawings - Confirm material, color, structure, usage scenario, installation method, packaging, labeling, manual, and transportation for each product based on drawings',
        'Calculate Estimated Completion Date & Quote',
        'Drawing Deepening - Establish processing route, manufacturing BOM, production SOP, and inspection SIP for each product',
        'PMC Planning - Establish procurement plan and production plan, procure and produce according to plan',
        'Trial Assembly Inspection & Video Recording',
        'Packaging, Labeling, Warehousing, Schedule Shipment with Customer, Send Trial Assembly Videos for Each Product and Packing List Showing Which Components are in Which Wooden Crate'
      ],
      ctaTitle: 'Ready to Get Started?',
      ctaSubtitle: 'Contact us to discuss your project requirements',
      contactUs: 'Contact Us'
    },
    caseDetail: {
      backToCases: '← Back to Cases',
      projectOverview: 'Project Overview',
      projectOverviewDesc: 'This case study demonstrates our ability to transform retail spaces with custom fixtures that perfectly match the client\'s brand identity and functional requirements.',
      challenge: 'The Challenge',
      challengeDesc: 'The client needed a complete store overhaul to better showcase their products and improve customer flow.',
      solution: 'Our Solution',
      solutionDesc: 'We designed and manufactured a comprehensive display system that maximized floor space while maintaining an elegant, modern aesthetic.',
      results: 'Results',
      result1: 'Increased product visibility by 40%',
      result2: 'Improved customer dwell time',
      result3: 'Enhanced brand perception',
      startProject: 'Start Your Project'
    },
    brandStory: {
      title: 'We Are From Mainland China.',
      paragraph1: 'Perhaps far from you, but close to your needs.',
      paragraph2: 'No matter the store size, budget, or design complexity—as long as you speak up, we\'ll sit down and have a serious discussion.',
      paragraph3: 'For every one of your requirements, we will do our utmost to realize them with professionalism and sincerity.',
      quote: 'We don\'t exaggerate, we don\'t hide. If we can do it, we\'ll say so. If we can\'t, we\'ll tell you why.'
    },
    trust: {
      trustedBy: 'Trusted By Leading Brands',
      testimonials: 'What Our Clients Say',
      yearsExperience: 'Years Experience',
      storesServed: 'Stores Served',
      reproductionPromise: 'Drawing Reproduction Promise',
      brands: [
        { name: 'Brand A' },
        { name: 'Brand B' },
        { name: 'Brand C' },
        { name: 'Brand D' },
        { name: 'Brand E' },
        { name: 'Brand F' }
      ],
      testimonialsList: [
        {
          quote: 'The quality exceeded our expectations. The fixtures perfectly matched our design drawings.',
          author: 'Sarah Chen',
          role: 'Boutique Owner, Shanghai'
        },
        {
          quote: 'Professional team, clear communication, and on-time delivery. Highly recommended!',
          author: 'Michael Zhang',
          role: 'Retail Chain Manager, Beijing'
        }
      ]
    },
    cta: {
      title: 'Ready to Open a Clothing Store? Or Upgrade Your Existing Store?',
      subtitle: 'Need fixture updates and modernization?',
      button: 'Get Free Store Consultation Plan',
      promise: 'No commitment required, reply within 24 hours. We\'re not afraid of trouble, only afraid of not having the chance to prove ourselves.'
    },
    footer: {
      description: 'Professional store fixtures and display solutions for apparel retail. From blueprint to reality - your trusted Chinese manufacturing partner.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      newsletter: 'Newsletter',
      newsletterDesc: 'Subscribe for latest products and industry insights',
      subscribe: 'Subscribe',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      yourEmail: 'Your email',
      premiumQuality: 'Premium Quality'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      send: 'Send',
      sending: 'Sending...',
      success: 'Success',
      close: 'Close'
    },
    trustBanner: {
      text: 'From China\'s Store Display Industry · All requirements confirmed through drawings, striving for 1:1 implementation | Accepting OEM/ODM, product sampling and material sampling'
    },
    quoteRequest: {
      title: 'Request a Quote',
      submittedTitle: 'Quote Request Submitted!',
      submittedMessage: 'Thank you for your inquiry. Our team will review your request and send you a formal quotation within 24 hours.',
      nextSteps: 'Next Steps:',
      step1: '1. Check your email for confirmation',
      step2: '2. We\'ll send a detailed quotation',
      step3: '3. Review and sign the contract online',
      step4: '4. Arrange payment securely',
      contactInfo: 'Contact Information',
      fullName: 'Full Name *',
      emailAddress: 'Email Address *',
      companyName: 'Company Name *',
      country: 'Country *',
      phoneNumber: 'Phone Number',
      productDetails: 'Product Details',
      quantity: 'Quantity *',
      targetPrice: 'Target Price (USD)',
      specifications: 'Specifications / Requirements',
      tradeTerms: 'Trade Terms',
      deliveryTerms: 'Delivery Terms',
      paymentTerms: 'Payment Terms',
      additionalMessage: 'Additional Message',
      termsAgreement: 'I agree to the Terms and Conditions and Privacy Policy. I understand that this is a quote request and not a binding order.',
      submitButton: 'Submit Quote Request',
      submitting: 'Submitting...',
      secureInfo: '🔒 Your information is secure and will never be shared',
      responseTime: '✓ We respond to all inquiries within 24 hours',
      contractInfo: '✓ Formal contract provided before payment',
      errorAgreeTerms: 'Please agree to the terms and conditions',
      errorSubmit: 'Failed to submit quote request. Please try again.'
    }
  },
  zh: {
    nav: {
      solutions: '解决方案',
      products: '产品',
      cases: '案例',
      resources: '资源',
      about: '关于',
      contact: '联系',
      consultation: '免费店铺咨询'
    },
    hero: {
      title: '商业家具代工。',
      subtitle: '你出需求，我们共同核对图纸细节，我来深化制作工艺，并按图纸标准生产完成。',
      trustStatement: '接受需求——>核对图纸——>快速回复客户预计完成日期&快速做出报价——>每一道工序都按SOP/SIP 制作和检验——>打包严格按照BOM 清单&装箱单按照整个BOM清单标注',
      exploreSolutions: '探索方案',
      contactExpert: '联系专家'
    },
    capabilities: {
      title: '我们能做什么？',
      reqToDrawings: '需求 → 图纸',
      reqToDrawingsDesc: '无论手绘草图、照片还是想法，我们都能帮你落实为精确的生产图纸。',
      drawingsToReality: '图纸 → 实物',
      drawingsToRealityDesc: '按图施工，1:1还原。每一处细节、每一种材质，都与图纸完全一致。',
      oemOdm: '贴牌代工',
      oemOdmDesc: '接受OEM/ODM。你的品牌，我们制造。不设最小起订量门槛。'
    },
    solutions: {
      title: '为不同服装品类，提供专业陈列方案',
      womenswear: '高端女装品牌店铺家具',
      boutique: '潮流集合店/买手店家具',
      sports: '运动/休闲品牌店铺家具',
      kids: '童装/快时尚店铺家具',
      tags: {
        elegant: '优雅',
        textured: '质感',
        lightingAtmosphere: '灯光氛围',
        trendy: '潮流',
        unique: '独特',
        curatedDisplay: '精选陈列',
        dynamic: '动感',
        functional: '实用',
        activeLifestyle: '活力生活',
        playful: '趣味',
        flexible: '灵活',
        quickTurnover: '快速周转'
      }
    },
    blueprint: {
      title: '任何图纸，我们都努力追求1:1落地',
      subtitle: '您只管设计，我们会想尽一切办法还原成实物。',
      customerProvided: '客户提供',
      finishedProduct: '我们的成品',
      reproduction: '1:1还原',
      originalDrawing: '原始图纸/草图',
      actualProduct: '实际成品',
      comparisons: [
        { description: '定制零售货架系统 - 从概念到成品' },
        { description: '精品店展示设备 - 精准还原' },
        { description: '模块化服装架 - 完全符合规格' }
      ]
    },
    products: {
      title: '我们的陈列系统',
      subtitle: '商业级陈列设备，适用于专业零售环境',
      viewAll: '查看全部产品',
      viewDetails: '查看详情',
      getQuote: '获取报价',
      learnMore: '了解更多',
      items: [
        {
          name: '衬衣展示架',
          description: '可定制，贴logo',
          specs: '钢材 / 可定制 / Logo印刷'
        },
        {
          name: '包包展示架',
          description: '可定制，贴LOGO',
          specs: '可定制 / Logo印刷'
        },
        {
          name: '鞋子展示架',
          description: '可定制，可贴LOGO',
          specs: '可定制 / Logo印刷'
        },
        {
          name: '女装店陈列道具架落地式金色侧挂 中岛架女装展示架',
          description: '可定制，可贴LOGO',
          specs: '可定制 / Logo印刷'
        },
        {
          name: '带抽展柜',
          description: '可定制，可贴LOGO',
          specs: '可定制 / Logo印刷'
        },
        {
          name: '男装女装服装店展示架 现代简约服装陈列架落地中岛架',
          description: '可定制，可贴LOGO',
          specs: '可定制 / Logo印刷'
        }
      ]
    },
    productsPage: {
      title: '我们的产品',
      subtitle: '这里仅展示少量标准样品。实际上，我们为不同品牌店铺提供极具创意与美感的定制化陈列解决方案，每一款都是视觉盛宴。',
      customSolutionTitle: '需要定制方案？',
      customSolutionSubtitle: '联系我们讨论您的具体需求',
      getInTouch: '联系我们'
    },
    productDetail: {
      backToProducts: '← 返回产品',
      description: '适用于零售环境的专业商业级陈列设备。',
      specifications: '规格参数：',
      material: '材质',
      loadCapacity: '承重能力',
      customizableSizes: '可定制尺寸',
      easyAssembly: '附带说明书，易于组装',
      requestQuote: '索取报价',
      downloadSpecs: '下载规格书 (PDF)',
      shirtRackDescription: '可定制',
      bagRackDescription: '可定制，可选择logo 方式，可任意设计款式，颜色，材质，结构，尺寸规格'
    },
    contact: {
      title: '联系我们',
      subtitle: '准备开始您的项目？与我们的团队联系',
      sendMessageTitle: '给我们留言',
      nameLabel: '姓名 *',
      companyLabel: '公司/店铺名称',
      emailLabel: '邮箱 *',
      phoneLabel: '电话',
      storeAreaLabel: '店铺面积（平方米）',
      requirementTypeLabel: '需求类型',
      requirementTypePlaceholder: '请选择（可多选）...',
      requirementTypes: {
        materialSampling: '材料打样',
        productSampling: '单独产品打样',
        formalOrder: '正式下单',
        quoteRequest: '预约报价',
        customizationDiscussion: '定制沟通',
        reorder: '返单'
      },
      needOEMLabel: '我需要OEM/ODM服务（贴牌代工）',
      appointmentTimeLabel: '我期望的预约时间',
      appointmentTimePlaceholder: 'XXX时区，YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM',
      uploadDrawingsLabel: '上传图纸或参考图片',
      uploadFormats: '接受格式：JPG, PNG, PDF（每个文件最大10MB）',
      messageLabel: '留言 *',
      messagePlaceholder: '告诉我们您的项目需求...',
      sendInquiry: '发送询盘',
      responseTime: '我们通常在24小时内回复',
      successMessage: '谢谢！我们将在2小时内回复您的邮箱，请您注意接收。',
      failMessage: '发送失败，请重试。',
      contactInfoTitle: '联系信息',
      email: '邮箱',
      phone: '电话',
      address: '地址',
      companyAddress: '中国浙江省杭州市',
      connectTitle: '与我们联系',
      chatSystem: '在线聊天系统',
      lark: 'Lark',
      dingtalk: '钉钉',
      wechat: '微信',
      clickToChat: '点击打开聊天',
      businessHours: '人工客服时间',
      businessHoursContent: '周一至周五：上午9:00 - 下午6:00（GMT+8）<br />周六：上午9:00 - 中午12:00（GMT+8）<br />周日及节假日：休息',
      aiSupport: '非工作时间？',
      aiSupportContent: '我们的AI助手<strong>全天候24/7</strong>在线，可回答常见问题、查询订单状态、处理简单事务。复杂需求将在下一个工作日内由人工回复。',
      phoneNotice: '电话服务提示',
      phoneNoticeText: '国际电话服务暂未开通，请您谅解。请使用邮箱、Lark或我们的聊天系统联系我们。给您带来不便，深表歉意。'
    },
    cases: {
      title: '真实店铺 · 真实改变',
      subtitle: '真实店铺，真实转型 - 看看我们如何帮助企业成功',
      viewAll: '查看全部案例',
      items: [
        { name: '上海优雅精品店', result: '陈列SKU数量 +40%' },
        { name: '北京潮流集合店', result: '顾客停留时间 +35%' },
        { name: '广州运动品牌旗舰店', result: '销售转化率 +25%' },
        { name: '深圳童装时尚店', result: '空间利用率 +50%' },
        { name: '杭州高端女装店', result: '品牌形象提升' },
        { name: '成都快时尚连锁店', result: '补货效率 +60%' }
      ]
    },
    services: {
      title: '我们的服务',
      subtitle: '为您的零售陈列需求提供全面解决方案',
      customDesign: '工艺深化',
      customDesignDesc: '您可以提供图纸，或照片，或口头描述，我们会形成工艺图纸，并与您核对每一个细节，从材质、颜色、结构、质量标准、产品使用场景、安装方式逐一核对无误之后，再进行工艺深化，标注工艺SOP和检验SIP，一直到生产完成，一直到装箱，并提供远程安装指导服务。',
      oemOdm: '贴牌代工服务',
      oemOdmDesc: '您的品牌，我们的制造专长。无最小起订量限制。',
      spacePlanning: '提供打样',
      spacePlanningDesc: '我们接受产品打样需求和材料打样需求（材料打样主要是颜色，材质对比）。',
      installationSupport: '安装支持',
      installationSupportDesc: '详细的安装指南和远程支持，确保无缝安装。',
      processTitle: '我们的流程',
      steps: [
        '接受需求',
        '对接需求，并落实到图纸上，最终以图纸为标准，确认每件产品的材质、颜色、结构、使用场景、安装方式、包装方式、贴标方式、说明书、运输方式',
        '计算订单预计完成日期 & 订单报价',
        '图纸深化，确立每件产品的加工路线和制造BOM，生产SOP和检验SIP',
        '加入PMC计划，建立采购计划和生产计划，并按计划采购和按计划生产',
        '试装检验，并拍摄试装视频',
        '打包、贴标、入库，预约客户发货，并发送每个产品的试装视频和整批订单的装箱单（此装箱单是每个组件、产品装在哪个木箱中）'
      ],
      ctaTitle: '准备开始？',
      ctaSubtitle: '联系我们讨论您的项目需求',
      contactUs: '联系我们'
    },
    caseDetail: {
      backToCases: '← 返回案例',
      projectOverview: '项目概述',
      projectOverviewDesc: '本案例研究展示了我们通过定制陈列设备改造零售空间的能力，完美匹配客户的品牌形象和功能需求。',
      challenge: '挑战',
      challengeDesc: '客户需要全面改造店铺，以更好地展示产品并改善顾客流动。',
      solution: '我们的解决方案',
      solutionDesc: '我们设计和制造了一个全面的展示系统，在保持优雅现代美学的同时最大化利用地面空间。',
      results: '成果',
      result1: '产品可见度提高40%',
      result2: '顾客停留时间延长',
      result3: '品牌形象提升',
      startProject: '开始您的项目'
    },
    brandStory: {
      title: '我们来自中国大陆。',
      paragraph1: '离你或许很远，但离你的需求很近。',
      paragraph2: '无论店铺大小、预算多少、设计是否复杂——只要你开口，我们就坐下来认真谈。',
      paragraph3: '你的每一个需求，我们会尽最大努力，用专业和诚意去实现。',
      quote: '我们不夸大，不隐瞒。做得到就说做得到，做不到会告诉你为什么。'
    },
    trust: {
      trustedBy: '合作品牌',
      testimonials: '客户评价',
      yearsExperience: '年经验',
      storesServed: '服务店铺',
      reproductionPromise: '图纸还原承诺',
      brands: [
        { name: '品牌 A' },
        { name: '品牌 B' },
        { name: '品牌 C' },
        { name: '品牌 D' },
        { name: '品牌 E' },
        { name: '品牌 F' }
      ],
      testimonialsList: [
        {
          quote: '质量超出了我们的预期。陈列设备完美匹配我们的设计图纸。',
          author: '陈莎拉',
          role: '精品店店主，上海'
        },
        {
          quote: '专业的团队，沟通清晰，按时交付。强烈推荐！',
          author: '张迈克尔',
          role: '零售连锁店经理，北京'
        }
      ]
    },
    cta: {
      title: '准备开一家服装店？或升级现有店铺？',
      subtitle: '道具需要更新换代？',
      button: '免费获取店铺咨询方案',
      promise: '无需承诺，24小时内回复。我们不怕麻烦，只怕没机会证明。'
    },
    footer: {
      description: '专业的服装零售店铺陈列解决方案。从图纸到实物 - 您值得信赖的中国制造合作伙伴。',
      quickLinks: '快速链接',
      contactUs: '联系我们',
      newsletter: '订阅通讯',
      newsletterDesc: '订阅最新产品和行业洞察',
      subscribe: '订阅',
      privacyPolicy: '隐私政策',
      termsOfService: '服务条款',
      yourEmail: '您的邮箱',
      premiumQuality: '优质品质'
    },
    common: {
      loading: '加载中...',
      error: '错误',
      send: '发送',
      sending: '发送中...',
      success: '成功',
      close: '关闭'
    },
    trustBanner: {
      text: '来自中国服装陈列行业 · 所有需求通过图纸确认，力求1:1还原 | 接受OEM/ODM、产品打样和材料打样'
    },
    quoteRequest: {
      title: '请求报价',
      submittedTitle: '报价请求已提交！',
      submittedMessage: '感谢您的咨询。我们的团队将审核您的请求，并在24小时内发送正式报价。',
      nextSteps: '下一步：',
      step1: '1. 检查您的邮箱确认',
      step2: '2. 我们将发送详细报价',
      step3: '3. 在线审查并签署合同',
      step4: '4. 安全安排付款',
      contactInfo: '联系信息',
      fullName: '全名 *',
      emailAddress: '邮箱地址 *',
      companyName: '公司名称 *',
      country: '国家 *',
      phoneNumber: '电话号码',
      productDetails: '产品详情',
      quantity: '数量 *',
      targetPrice: '目标价格（美元）',
      specifications: '规格/要求',
      tradeTerms: '贸易条款',
      deliveryTerms: '交货条款',
      paymentTerms: '付款条款',
      additionalMessage: '附加消息',
      termsAgreement: '我同意条款和条件及隐私政策。我理解这是一个报价请求，不是具有约束力的订单。',
      submitButton: '提交报价请求',
      submitting: '提交中...',
      secureInfo: '🔒 您的信息安全，永远不会被分享',
      responseTime: '✓ 我们在24小时内回复所有咨询',
      contractInfo: '✓ 付款前提供正式合同',
      errorAgreeTerms: '请同意条款和条件',
      errorSubmit: '提交报价请求失败。请重试。'
    }
  },
  // Japanese translations
  ja: {
    nav: {
      solutions: 'ソリューション',
      products: '製品',
      cases: '事例',
      resources: 'リソース',
      about: '会社概要',
      contact: 'お問い合わせ',
      consultation: '無料店舗相談'
    },
    hero: {
      title: '商業家具のOEM製造。',
      subtitle: 'お客様のご要望をお聞きし、一緒に図面の詳細を確認し、工芸を深化させ、図面基準で生産を完了します。',
      trustStatement: 'ご要望受付 → 図面確認 → 納期予定＆お見積もり迅速回答 → 各工程はSOP/SIPに従って製作・検査 → 梱包はBOMリスト厳守＆装箱単はBOM全体に基づいて記載',
      exploreSolutions: 'ソリューションを見る',
      contactExpert: '専門家に相談'
    },
    capabilities: {
      title: '私たちができること',
      reqToDrawings: 'ご要望 → 図面化',
      reqToDrawingsDesc: '手書きスケッチ、写真、アイデアだけでも、正確な生産図面に落とし込みます。',
      drawingsToReality: '図面 → 実物化',
      drawingsToRealityDesc: '図面通り1:1で再現。細部も素材も図面と完全に一致します。',
      oemOdm: 'OEM/ODMサービス',
      oemOdmDesc: 'OEM/ODM対応。お客様のブランドで製造。最低発注数量なし。'
    },
    solutions: {
      title: '異なるアパレルカテゴリのための専門ディスプレイソリューション',
      womenswear: '高級婦人服ブランド店',
      boutique: 'ファッションセレクトショップ/ブティック',
      sports: 'スポーツ/カジュアルブランド店',
      kids: 'キッズ/ファストファッション店',
      tags: {
        elegant: 'エレガント',
        textured: '質感',
        lightingAtmosphere: '照明雰囲気',
        trendy: 'トレンディ',
        unique: 'ユニーク',
        curatedDisplay: '厳選ディスプレイ',
        dynamic: 'ダイナミック',
        functional: '機能的',
        activeLifestyle: 'アクティブライフスタイル',
        playful: '遊び心',
        flexible: '柔軟',
        quickTurnover: '迅速な回転'
      }
    },
    blueprint: {
      title: 'どんな図面でも1:1の実現を目指します',
      subtitle: 'デザインはお任せください。実物化の方法は私たちが考え抜きます。',
      customerProvided: 'お客様提供',
      finishedProduct: '完成品',
      reproduction: '1:1再現',
      originalDrawing: '元図面/スケッチ',
      actualProduct: '実際の商品',
      comparisons: [
        { description: 'カスタム零售棚システム - コンセプトから完成品まで' },
        { description: 'ブティックディスプレイ設備 - 精密再現' },
        { description: 'モジュラー衣類ラック - 仕様完全準拠' }
      ]
    },
    products: {
      title: 'ディスプレイシステム',
      subtitle: 'プロの小売環境向け商業級設備',
      viewAll: '全製品を見る',
      viewDetails: '詳細を見る',
      getQuote: 'お見積もり',
      learnMore: 'もっと見る',
      items: [
        { name: 'モジュラー衣類ラックシステム', description: '重型スチールフレーム、調整可能棚板', specs: 'スチール / カスタマイズ可 / 200kg耐荷重' },
        { name: 'ブティックディスプレイ棚', description: '優雅な木材と金属の組み合わせ棚', specs: '木材と金属 / 複数サイズ / 150kg耐荷重' },
        { name: '零售壁掛けディスプレイユニット', description: 'スペース効率の良い壁掛け式ディスプレイ', specs: 'アルミ合金 / モジュール式 / 棚あたり100kg' },
        { name: '中央アイランドディスプレイテーブル', description: '多機能商品展示センターテーブル', specs: '複合素材 / カスタムサイズ / 300kg耐荷重' },
        { name: '衣類レールシステム', description: '統合照明付き高級ハンギングレール', specs: '真鍮仕上げ / LED対応 / 重型' },
        { name: '靴類ディスプレイウォール', description: '靴類零售に最適化された段違い棚', specs: 'アクリルと木材 / 傾斜棚 / 簡単組立' }
      ]
    },
    productsPage: {
      title: '製品一覧',
      subtitle: 'アパレル零售向けの専門店舗什器・ディスプレイソリューション',
      customSolutionTitle: 'カスタムソリューションが必要ですか？',
      customSolutionSubtitle: '具体的なご要望をお聞かせください',
      getInTouch: 'お問い合わせ'
    },
    productDetail: {
      backToProducts: '← 製品一覧に戻る',
      description: '小売環境向けのプロフェッショナル商業級設備。',
      specifications: '仕様：',
      material: '素材',
      loadCapacity: '耐荷重',
      customizableSizes: 'サイズカスタマイズ可能',
      easyAssembly: '説明書付きで簡単組立',
      requestQuote: 'お見積もり依頼',
      downloadSpecs: '仕様書ダウンロード (PDF)',
      shirtRackDescription: 'カスタマイズ可能',
      bagRackDescription: 'ロゴオプション付きカスタマイズ可能、スタイル、カラー、素材、構造、寸法を自由に設計'
    },
    contact: {
      title: 'お問い合わせ',
      subtitle: 'プロジェクトを開始する準備はできましたか？チームにご連絡ください',
      sendMessageTitle: 'メッセージを送信',
      nameLabel: 'お名前 *',
      companyLabel: '会社名/店舗名',
      emailLabel: 'メールアドレス *',
      phoneLabel: '電話番号',
      storeAreaLabel: '店舗面積（平方メートル）',
      requirementTypeLabel: '要件タイプ',
      requirementTypePlaceholder: '選択してください（複数選択可）...',
      requirementTypes: {
        materialSampling: '材料サンプリング',
        productSampling: '個別製品サンプリング',
        formalOrder: '正式注文',
        quoteRequest: '見積もり依頼',
        customizationDiscussion: 'カスタマイズ相談',
        reorder: '再注文'
      },
      needOEMLabel: 'OEM/ODMサービスが必要です（プライベートラベリング）',
      appointmentTimeLabel: '希望する予約時間',
      appointmentTimePlaceholder: 'XXXタイムゾーン、YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM',
      uploadDrawingsLabel: '図面または参考画像をアップロード',
      uploadFormats: '対応形式：JPG, PNG, PDF（ファイルあたり最大10MB）',
      messageLabel: 'メッセージ *',
      messagePlaceholder: 'プロジェクトの要件について教えてください...',
      sendInquiry: 'お問い合わせ送信',
      responseTime: '通常24時間以内に返信いたします',
      successMessage: 'ありがとうございます！2時間以内にメールで返信いたします。受信トレイをご確認ください。',
      failMessage: '送信に失敗しました。もう一度お試しください。',
      contactInfoTitle: '連絡先情報',
      email: 'メール',
      phone: '電話',
      address: '住所',
      companyAddress: '中国浙江省杭州市',
      connectTitle: 'つながる',
      chatSystem: 'チャットシステム',
      lark: 'Lark',
      dingtalk: 'DingTalk',
      wechat: 'WeChat',
      clickToChat: 'クリックしてチャットを開く',
      businessHours: '人力サポート時間',
      businessHoursContent: '月曜日 - 金曜日：午前9時 - 午後6時（GMT+8）<br />土曜日：午前9時 - 正午12時（GMT+8）<br />日曜日・祝日：休業',
      aiSupport: '時間外は？',
      aiSupportContent: 'AIアシスタントが<strong>24時間365日</strong>対応。よくある質問、注文確認、簡単な問題解決が可能です。複雑なご要望には、翌営業日以内に人力で返信いたします。',
      phoneNotice: '電話サービスのお知らせ',
      phoneNoticeText: '国際電話サービスはまだ利用できません。メール、Lark、またはチャットシステムをご利用ください。ご不便をおかけして申し訳ありません。'
    },
    cases: {
      title: '実店舗・実案例',
      subtitle: '実際の店舗、実際の変革 - 私たちが企業の成功にどう貢献したかをご覧ください',
      viewAll: 'すべての事例を見る',
      items: [
        { name: '上海エレガントブティック', result: '陳列SKU数 +40%' },
        { name: '北京トレンドセレクトショップ', result: '顧客滞在時間 +35%' },
        { name: '広州スポーツブランド旗艦店', result: '販売転換率 +25%' },
        { name: '深センキッズファッション店', result: '空間利用率 +50%' },
        { name: '杭州高級婦人服店', result: 'ブランドイメージ向上' },
        { name: '成都ファストファッションチェーン', result: '補充効率 +60%' }
      ]
    },
    caseDetail: {
      backToCases: '← 事例一覧に戻る',
      projectOverview: 'プロジェクト概要',
      projectOverviewDesc: 'この事例研究では、クライアントのブランドアイデンティティと機能要件に完璧にマッチするカスタム什器で小売空間を変革する私たちの能力を実証しています。',
      challenge: '課題',
      challengeDesc: 'クライアントは商品をより良く展示し、顧客の流れを改善するために店舗の全面的なリニューアルを必要としていました。',
      solution: '私たちの解決策',
      solutionDesc: 'エレガントでモダンな美学を維持しながら床面積を最大化する包括的なディスプレイシステムを設計・製造しました。',
      results: '成果',
      result1: '商品の可視性が40%向上',
      result2: '顧客の滞在時間が延長',
      result3: 'ブランドイメージが向上',
      startProject: 'プロジェクトを始める'
    },
    services: {
      title: 'サービス',
      subtitle: '小売ディスプレイニーズへの包括的ソリューション',
      customDesign: '工芸深化',
      customDesignDesc: '図面、写真、または口頭での説明を提供していただけます。私たちが工芸図面を作成し、素材、色、構造、品質基準、製品使用シーン、設置方法など、すべての詳細をお客様と確認します。すべて問題ないことを確認した後、工芸深化を行い、工芸SOPと検査SIPを明記し、生産完了から梱包まで、遠隔設置指導サービスを提供します。',
      oemOdm: 'OEM/ODMサービス',
      oemOdmDesc: 'お客様のブランド、私たちの製造ノウハウ。最小注文数量なし。',
      spacePlanning: 'サンプル提供',
      spacePlanningDesc: '製品のサンプルリクエストと材料のサンプルリクエストを受け付けています（材料サンプルは主に色と素材の比較）。',
      installationSupport: '設置サポート',
      installationSupportDesc: '詳細な設置ガイドとリモートサポートでシームレスな設置を実現。',
      processTitle: 'プロセス',
      steps: ['ご要望受付', 'ご要望を図面に落とし込み、図面を基準として各製品の素材・色・構造・使用シーン・設置方法・梱包方法・ラベル表示方法・取扱説明書・輸送方法を確認', '納期予定とお見積もり計算', '図面深化 - 各製品の加工ルート、製造BOM、生産SOP、検査SIPを確立', 'PMC計画追加 - 調達計画と生産計画を樹立し、計画通りに調達と生産を実施', '試組検査と動画撮影', '梱包・ラベル貼付・入庫、顧客と発送日程調整、各製品の試組動画と全注文の装箱単（各コンポーネント・製品がどの木箱に入っているか）を送信'],
      ctaTitle: '始める準備はできましたか？',
      ctaSubtitle: 'プロジェクトのご要望についてご相談ください',
      contactUs: 'お問い合わせ'
    },
    brandStory: {
      title: '私たちは中国大陸から来ました。',
      paragraph1: '地理的には遠いかもしれませんが、お客様のニーズにはとても近い存在です。',
      paragraph2: '店舗の大小、予算の多少、デザインの複雑さに関係なく、お気軽にご相談ください。真剣に向き合って議論します。',
      paragraph3: 'お客様のあらゆるご要望に、プロフェッショナリズムと誠意を持って最大限お応えします。',
      quote: '誇張せず、隠しもしません。できることはできると言い、できないことはその理由をお伝えします。'
    },
    trust: {
      trustedBy: '主要ブランドからの信頼',
      testimonials: 'お客様の声',
      yearsExperience: '年の経験',
      storesServed: '店舗に対応',
      reproductionPromise: '図面再現の約束',
      brands: [{ name: 'ブランド A' }, { name: 'ブランド B' }, { name: 'ブランド C' }, { name: 'ブランド D' }, { name: 'ブランド E' }, { name: 'ブランド F' }],
      testimonialsList: [
        { quote: '品質は期待以上でした。什器は設計図に完璧に一致していました。', author: 'サラ・チェン', role: 'ブティック店主、上海' },
        { quote: 'プロフェッショナルなチーム、明確なコミュニケーション、納期通りの配送。強くお勧めします！', author: 'マイケル・チャン', role: '小売チェーンマネージャー、北京' }
      ]
    },
    cta: {
      title: 'アパレル店を開く準備はできていますか？既存店舗をアップグレードしますか？',
      subtitle: '什器の更新换代が必要ですか？',
      button: '無料店舗相談プランを取得',
      promise: 'コミットメント不要、24時間以内に返信。面倒を恐れず、証明する機会がないことだけを恐れます。'
    },
    footer: {
      description: 'アパレル小売向けの専門店舗什器・ディスプレイソリューション。図面から実物へ - お客様の信頼できる中国製パートナー。',
      quickLinks: 'クイックリンク',
      contactUs: 'お問い合わせ',
      newsletter: 'ニュースレター',
      newsletterDesc: '最新製品と業界インサイトを購読',
      subscribe: '購読',
      privacyPolicy: 'プライバシーポリシー',
      termsOfService: '利用規約',
      yourEmail: 'メールアドレス',
      premiumQuality: '高品質'
    },
    common: { loading: '読み込み中...', error: 'エラー', send: '送信', sending: '送信中...', success: '成功', close: '閉じる' },
    trustBanner: {
      text: '中国の店舗ディスプレイ業界から · すべての要件は図面を通じて確認、1:1の実現を目指します | OEM/ODM、製品サンプリング、材料サンプリングを受け付け'
    },
    quoteRequest: {
      title: '見積もりを依頼',
      submittedTitle: '見積もりリクエスト送信完了！',
      submittedMessage: 'お問い合わせありがとうございます。チームがリクエストを確認し、24時間以内に正式な見積もりをお送りします。',
      nextSteps: '次のステップ：',
      step1: '1. 確認メールをチェック',
      step2: '2. 詳細な見積もりを送信',
      step3: '3. オンラインで契約を確認・署名',
      step4: '4. 安全に支払いを手配',
      contactInfo: '連絡先情報',
      fullName: '氏名 *',
      emailAddress: 'メールアドレス *',
      companyName: '会社名 *',
      country: '国 *',
      phoneNumber: '電話番号',
      productDetails: '製品詳細',
      quantity: '数量 *',
      targetPrice: '目標価格（USD）',
      specifications: '仕様/要件',
      tradeTerms: '取引条件',
      deliveryTerms: '納品条件',
      paymentTerms: '支払条件',
      additionalMessage: '追加メッセージ',
      termsAgreement: '利用規約およびプライバシーポリシーに同意します。これは見積もりリクエストであり、拘束力のある注文ではないことを理解しています。',
      submitButton: '見積もりリクエストを送信',
      submitting: '送信中...',
      secureInfo: '🔒 お客様の情報は安全で、共有されることはありません',
      responseTime: '✓ 24時間以内にお問い合わせに返信します',
      contractInfo: '✓ お支払い前に正式な契約書を提供',
      errorAgreeTerms: '利用規約に同意してください',
      errorSubmit: '見積もりリクエストの送信に失敗しました。もう一度お試しください。'
    }
  },
  // Spanish translations
  es: {
    nav: {
      solutions: 'Soluciones',
      products: 'Productos',
      cases: 'Casos',
      resources: 'Recursos',
      about: 'Nosotros',
      contact: 'Contacto',
      consultation: 'Consulta Gratuita'
    },
    hero: {
      title: 'Fabricación de Mobiliario Comercial.',
      subtitle: 'Usted proporciona los requisitos, verificamos juntos los detalles del plano, refinamos la artesanía y producimos según los estándares del dibujo.',
      trustStatement: 'Aceptación de requisitos → Verificación de planos → Respuesta rápida con fecha estimada de finalización y cotización → Cada proceso sigue SOP/SIP para producción e inspección → El embalaje sigue estrictamente la lista BOM',
      exploreSolutions: 'Explorar Soluciones',
      contactExpert: 'Contactar Experto'
    },
    capabilities: {
      title: '¿Qué Podemos Hacer?',
      reqToDrawings: 'Requisitos → Planos',
      reqToDrawingsDesc: 'Ya sean bocetos a mano alzada, fotos o ideas, podemos ayudarle a convertirlos en planos de producción precisos.',
      drawingsToReality: 'Planos → Realidad',
      drawingsToRealityDesc: 'Construcción según planos, reproducción 1:1. Cada detalle, cada material, completamente consistente con los planos.',
      oemOdm: 'Servicios OEM/ODM',
      oemOdmDesc: 'Aceptamos OEM/ODM. Su marca, nosotros fabricamos. Sin cantidad mínima de pedido.'
    },
    solutions: {
      title: 'Soluciones de Exhibición Profesionales para Diferentes Categorías de Vestimenta',
      womenswear: 'Tiendas de Marcas de Moda Femenina de Alta Gama',
      boutique: 'Tiendas de Colección de Moda / Boutiques',
      sports: 'Tiendas de Marcas Deportivas / Casuales',
      kids: 'Tiendas de Moda Infantil / Fast Fashion',
      tags: {
        elegant: 'Elegante',
        textured: 'Texturizado',
        lightingAtmosphere: 'Ambiente Iluminado',
        trendy: 'Moderno',
        unique: 'Único',
        curatedDisplay: 'Exhibición Curada',
        dynamic: 'Dinámico',
        functional: 'Funcional',
        activeLifestyle: 'Estilo de Vida Activo',
        playful: 'Lúdico',
        flexible: 'Flexible',
        quickTurnover: 'Rotación Rápida'
      }
    },
    blueprint: {
      title: 'Cualquier Plano, Nos Esforzamos por la Implementación 1:1',
      subtitle: 'Usted se encarga del diseño, encontraremos todas las formas de convertirlo en realidad.',
      customerProvided: 'Proporcionado por el Cliente',
      finishedProduct: 'Nuestro Producto Terminado',
      reproduction: 'Reproducción 1:1',
      originalDrawing: 'Plano/Boceto Original',
      actualProduct: 'Producto Final Real',
      comparisons: [
        { description: 'Sistema de estantería minorista personalizado - del concepto al producto terminado' },
        { description: 'Accesorios de exhibición para boutiques - reproducción precisa' },
        { description: 'Percheros modulares - especificaciones exactas cumplidas' }
      ]
    },
    products: {
      title: 'Nuestros Sistemas de Exhibición',
      subtitle: 'Accesorios de grado comercial para entornos minoristas profesionales',
      viewAll: 'Ver Todos los Productos',
      viewDetails: 'Ver Detalles',
      getQuote: 'Obtener Cotización',
      learnMore: 'Más Información',
      items: [
        {
          name: 'Sistema Modular de Percheros',
          description: 'Estructura de acero resistente con estantes ajustables',
          specs: 'Acero / Personalizable / Capacidad 200kg'
        },
        {
          name: 'Estantería de Exhibición para Boutiques',
          description: 'Elegante combinación de madera y metal',
          specs: 'Madera y Metal / Varios tamaños / Capacidad 150kg'
        },
        {
          name: 'Unidad de Exhibición de Pared',
          description: 'Solución de exhibición montada en pared que ahorra espacio',
          specs: 'Aluminio / Modular / 100kg por estante'
        },
        {
          name: 'Mesa de Exhibición Central',
          description: 'Pieza central versátil para mostrar productos',
          specs: 'Materiales mixtos / Tamaños personalizados / Capacidad 300kg'
        },
        {
          name: 'Sistema de Riel para Prendas',
          description: 'Riel colgante premium con iluminación integrada',
          specs: 'Acabado latón / Listo para LED / Resistente'
        },
        {
          name: 'Pared de Exhibición para Zapatos',
          description: 'Estantes escalonados optimizados para calzado',
          specs: 'Acrílico y Madera / Estantes inclinados / Fácil montaje'
        }
      ]
    },
    productsPage: {
      title: 'Nuestros Productos',
      subtitle: 'Accesorios profesionales y soluciones de exhibición para retail de moda',
      customSolutionTitle: '¿Necesita una Solución Personalizada?',
      customSolutionSubtitle: 'Contáctenos para discutir sus requisitos específicos',
      getInTouch: 'Póngase en Contacto'
    },
    productDetail: {
      backToProducts: '← Volver a Productos',
      description: 'Accesorio profesional de grado comercial para entornos minoristas.',
      specifications: 'Especificaciones:',
      material: 'Material',
      loadCapacity: 'Capacidad de Carga',
      customizableSizes: 'Tamaños personalizables disponibles',
      easyAssembly: 'Fácil montaje con instrucciones incluidas',
      requestQuote: 'Solicitar Cotización',
      downloadSpecs: 'Descargar Especificaciones (PDF)',
      shirtRackDescription: 'Personalizable',
      bagRackDescription: 'Personalizable con opciones de logo, estilos, colores, materiales, estructuras y dimensiones personalizables'
    },
    contact: {
      title: 'Contáctenos',
      subtitle: '¿Listo para comenzar su proyecto? Póngase en contacto con nuestro equipo',
      sendMessageTitle: 'Envíenos un Mensaje',
      nameLabel: 'Nombre *',
      companyLabel: 'Empresa / Nombre de Tienda',
      emailLabel: 'Correo Electrónico *',
      phoneLabel: 'Teléfono',
      storeAreaLabel: 'Área de Tienda (m²)',
      requirementTypeLabel: 'Tipo de Requisito',
      requirementTypePlaceholder: 'Seleccione...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'Necesito servicios OEM/ODM (marca privada)',
      uploadDrawingsLabel: 'Subir Planos o Imágenes de Referencia',
      uploadFormats: 'Formatos aceptados: JPG, PNG, PDF (Máx 10MB por archivo)',
      messageLabel: 'Mensaje *',
      messagePlaceholder: 'Cuéntenos sobre los requisitos de su proyecto...',
      sendInquiry: 'Enviar Consulta',
      responseTime: 'Normalmente respondemos dentro de 24 horas',
      successMessage: '¡Gracias! Responderemos dentro de 24 horas.',
      failMessage: 'Error al enviar. Por favor, inténtelo de nuevo.',
      contactInfoTitle: 'Información de Contacto',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      connectTitle: 'Conéctese con Nosotros',
      chatSystem: 'Sistema de Chat',
      businessHours: 'Horario de Atención (Equipo Humano)',
      businessHoursContent: 'Lunes–Viernes: 9:00 AM – 6:00 PM (GMT+8)<br />Sábado: 9:00 AM – 12:00 PM (GMT+8)<br />Domingo y festivos: Cerrado',
      aiSupport: '¿Fuera de Estas Horas?',
      aiSupportContent: 'Nuestro asistente de IA está disponible <strong>24/7</strong> para responder preguntas comunes, verificar pedidos y ayudar con problemas rápidos. Para solicitudes complejas, le responderemos dentro del próximo día hábil.',
      phoneNotice: 'Aviso de Servicio Telefónico',
      phoneNoticeText: 'El servicio telefónico internacional aún no está disponible. Por favor, utilice el correo electrónico, Lark o nuestro sistema de chat para contactarnos. Disculpe las molestias.'
    },
    cases: {
      title: 'Tiendas Reales · Transformaciones Reales',
      subtitle: 'Tiendas reales, transformaciones reales - vea cómo hemos ayudado a las empresas a tener éxito',
      viewAll: 'Ver Todos los Casos',
      items: [
        { name: 'Boutique Elegante Shanghái', result: 'SKU en exhibición +40%' },
        { name: 'Tienda de Colección Trendy Pekín', result: 'Tiempo de permanencia +35%' },
        { name: 'Tienda Insignia Deportiva Guangzhou', result: 'Conversión de ventas +25%' },
        { name: 'Tienda de Moda Infantil Shenzhen', result: 'Utilización del espacio +50%' },
        { name: 'Moda Femenina de Lujo Hangzhou', result: 'Percepción de marca elevada' },
        { name: 'Cadena Fast Fashion Chengdu', result: 'Eficiencia de reabastecimiento +60%' }
      ]
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones integrales para sus necesidades de exhibición minorista',
      customDesign: 'Profundización de Artesanía',
      customDesignDesc: 'Puede proporcionar planos, fotos o descripciones verbales. Crearemos planos de artesanía y verificaremos cada detalle con usted - desde materiales, colores, estructuras, estándares de calidad, escenarios de uso del producto, hasta métodos de instalación. Después de confirmar que todo es correcto, procedemos con la profundización de artesanía, marcamos SOP para artesanía y SIP para inspección, durante toda la producción, embalaje, y proporcionamos servicios de guía de instalación remota.',
      oemOdm: 'Servicios OEM/ODM',
      oemOdmDesc: 'Su marca, nuestra experiencia en fabricación. Sin cantidades mínimas de pedido.',
      spacePlanning: 'Proporcionar Muestras',
      spacePlanningDesc: 'Aceptamos solicitudes de muestreo de productos y solicitudes de muestreo de materiales (el muestreo de materiales se centra principalmente en la comparación de color y material).',
      installationSupport: 'Soporte de Instalación',
      installationSupportDesc: 'Guías de instalación detalladas y soporte remoto para una configuración sin problemas.',
      processTitle: 'Nuestro Proceso',
      steps: [
        'Aceptar Requisitos',
        'Coincidir Requisitos con Planos - Confirmar material, color, estructura, escenario de uso, método de instalación, embalaje, etiquetado, manual y transporte para cada producto basado en planos',
        'Calcular Fecha Estimada de Finalización y Cotización',
        'Profundización de Planos - Establecer ruta de procesamiento, BOM de fabricación, SOP de producción y SIP de inspección para cada producto',
        'Planificación PMC - Establecer plan de compras y plan de producción, comprar y producir según el plan',
        'Inspección de Ensamblaje de Prueba y Grabación de Video',
        'Embalaje, Etiquetado, Almacenamiento, Programar Envío con Cliente, Enviar Videos de Ensamblaje de Prueba para Cada Producto y Lista de Embalaje Mostrando Qué Componentes Están en Qué Caja de Madera'
      ],
      ctaTitle: '¿Listo para Comenzar?',
      ctaSubtitle: 'Contáctenos para discutir los requisitos de su proyecto',
      contactUs: 'Contáctenos'
    },
    caseDetail: {
      backToCases: '← Volver a Casos',
      projectOverview: 'Descripción General del Proyecto',
      projectOverviewDesc: 'Este estudio de caso demuestra nuestra capacidad para transformar espacios minoristas con accesorios personalizados que coinciden perfectamente con la identidad de marca y los requisitos funcionales del cliente.',
      challenge: 'El Desafío',
      challengeDesc: 'El cliente necesitaba una renovación completa de la tienda para mostrar mejor sus productos y mejorar el flujo de clientes.',
      solution: 'Nuestra Solución',
      solutionDesc: 'Diseñamos y fabricamos un sistema de exhibición integral que maximizó el espacio del piso mientras mantenía una estética elegante y moderna.',
      results: 'Resultados',
      result1: 'Visibilidad del producto aumentada en 40%',
      result2: 'Tiempo de permanencia del cliente mejorado',
      result3: 'Percepción de marca mejorada',
      startProject: 'Comience Su Proyecto'
    },
    brandStory: {
      title: 'Somos de China Continental.',
      paragraph1: 'Quizás lejos de usted, pero cerca de sus necesidades.',
      paragraph2: 'No importa el tamaño de la tienda, el presupuesto o la complejidad del diseño—mientras hable, nos sentaremos y tendremos una discusión seria.',
      paragraph3: 'Para cada uno de sus requisitos, haremos todo lo posible para realizarlos con profesionalismo y sinceridad.',
      quote: 'No exageramos, no ocultamos. Si podemos hacerlo, lo diremos. Si no podemos, le diremos por qué.'
    },
    trust: {
      trustedBy: 'Confiado por Marcas Líderes',
      testimonials: 'Lo Que Dicen Nuestros Clientes',
      yearsExperience: 'Años de Experiencia',
      storesServed: 'Tiendas Atendidas',
      reproductionPromise: 'Promesa de Reproducción de Planos',
      brands: [
        { name: 'Marca A' },
        { name: 'Marca B' },
        { name: 'Marca C' },
        { name: 'Marca D' },
        { name: 'Marca E' },
        { name: 'Marca F' }
      ],
      testimonialsList: [
        {
          quote: 'La calidad superó nuestras expectativas. Los accesorios coincidieron perfectamente con nuestros planos de diseño.',
          author: 'Sarah Chen',
          role: 'Propietaria de Boutique, Shanghái'
        },
        {
          quote: 'Equipo profesional, comunicación clara y entrega a tiempo. ¡Altamente recomendado!',
          author: 'Michael Zhang',
          role: 'Gerente de Cadena Minorista, Pekín'
        }
      ]
    },
    cta: {
      title: '¿Listo para Abrir una Tienda de Ropa? ¿O Actualizar Su Tienda Existente?',
      subtitle: '¿Necesita actualizaciones y modernización de accesorios?',
      button: 'Obtener Plan de Consulta de Tienda Gratuito',
      promise: 'Sin compromiso requerido, respuesta dentro de 24 horas. No tememos las molestias, solo tememos no tener la oportunidad de demostrarnos.'
    },
    footer: {
      description: 'Accesorios profesionales y soluciones de exhibición para retail de moda. Del plano a la realidad - su socio de fabricación chino de confianza.',
      quickLinks: 'Enlaces Rápidos',
      contactUs: 'Contáctenos',
      newsletter: 'Boletín',
      newsletterDesc: 'Suscríbase para obtener los últimos productos e información de la industria',
      subscribe: 'Suscribirse',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      yourEmail: 'Su correo electrónico',
      premiumQuality: 'Calidad Premium'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      send: 'Enviar',
      sending: 'Enviando...',
      success: 'Éxito',
      close: 'Cerrar'
    },
    trustBanner: {
      text: 'De la industria china de exhibición de tiendas · Todos los requisitos confirmados a través de planos, esforzándose por la implementación 1:1 | Aceptamos OEM/ODM, muestreo de productos y muestreo de materiales'
    }
  },
  // French translations
  fr: {
    nav: {
      solutions: 'Solutions',
      products: 'Produits',
      cases: 'Études de Cas',
      resources: 'Ressources',
      about: 'À Propos',
      contact: 'Contact',
      consultation: 'Consultation Gratuite'
    },
    hero: {
      title: 'Fabrication de Mobilier Commercial.',
      subtitle: 'Vous fournissez les exigences, nous vérifions ensemble les détails du plan, je raffine l\'artisanat et produis selon les normes du dessin.',
      trustStatement: 'Acceptation des exigences → Vérification des plans → Réponse rapide avec date de fin estimée et devis → Chaque processus suit SOP/SIP pour production et inspection → L\'emballage suit strictement la liste BOM',
      exploreSolutions: 'Explorer les Solutions',
      contactExpert: 'Contacter un Expert'
    },
    capabilities: {
      title: 'Que Pouvons-Nous Faire ?',
      reqToDrawings: 'Exigences → Plans',
      reqToDrawingsDesc: 'Qu\'il s\'agisse de croquis à main levée, de photos ou d\'idées, nous pouvons vous aider à les transformer en plans de production précis.',
      drawingsToReality: 'Plans → Réalité',
      drawingsToRealityDesc: 'Construction selon les plans, reproduction 1:1. Chaque détail, chaque matériau, complètement cohérent avec les plans.',
      oemOdm: 'Services OEM/ODM',
      oemOdmDesc: 'Nous acceptons OEM/ODM. Votre marque, nous fabriquons. Sans quantité minimum de commande.'
    },
    solutions: {
      title: 'Solutions d\'Affichage Professionnelles pour Différentes Catégories de Vêtements',
      womenswear: 'Magasins de Marques de Mode Féminine Haut de Gamme',
      boutique: 'Magasins de Collection de Mode / Boutiques',
      sports: 'Magasins de Marques Sportives / Décontractées',
      kids: 'Magasins de Mode Enfantaine / Fast Fashion',
      tags: {
        elegant: 'Élégant',
        textured: 'Texturé',
        lightingAtmosphere: 'Ambiance Lumineuse',
        trendy: 'Tendance',
        unique: 'Unique',
        curatedDisplay: 'Affichage Curaté',
        dynamic: 'Dynamique',
        functional: 'Fonctionnel',
        activeLifestyle: 'Style de Vie Actif',
        playful: 'Ludique',
        flexible: 'Flexible',
        quickTurnover: 'Rotation Rapide'
      }
    },
    blueprint: {
      title: 'N\'Importe Quel Plan, Nous Nous Efforçons de l\'Implémentation 1:1',
      subtitle: 'Vous vous occupez du design, nous trouverons tous les moyens de le concrétiser.',
      customerProvided: 'Fourni par le Client',
      finishedProduct: 'Notre Produit Fini',
      reproduction: 'Reproduction 1:1',
      originalDrawing: 'Plan/Croquis Original',
      actualProduct: 'Produit Final Réel',
      comparisons: [
        { description: 'Système d\'étagères de détail personnalisé - du concept au produit fini' },
        { description: 'Accessoires d\'affichage pour boutiques - reproduction précise' },
        { description: 'Portants modulaires - spécifications exactes respectées' }
      ]
    },
    products: {
      title: 'Nos Systèmes d\'Affichage',
      subtitle: 'Accessoires de qualité commerciale pour environnements de détail professionnels',
      viewAll: 'Voir Tous les Produits',
      viewDetails: 'Voir les Détails',
      getQuote: 'Obtenir un Devis',
      learnMore: 'En Savoir Plus',
      items: [
        {
          name: 'Système Modulaire de Portants',
          description: 'Cadre en acier robuste avec étagères réglables',
          specs: 'Acier / Personnalisable / Capacité 200kg'
        },
        {
          name: 'Étagère d\'Affichage pour Boutiques',
          description: 'Élégante combinaison bois et métal',
          specs: 'Bois et Métal / Tailles variées / Capacité 150kg'
        },
        {
          name: 'Unité d\'Affichage Murale',
          description: 'Solution d\'affichage murale gain de place',
          specs: 'Aluminium / Modulaire / 100kg par étagère'
        },
        {
          name: 'Table d\'Affichage Centrale',
          description: 'Pièce maîtresse polyvalente pour présenter les produits',
          specs: 'Matériaux mixtes / Tailles personnalisées / Capacité 300kg'
        },
        {
          name: 'Système de Rail pour Vêtements',
          description: 'Rail suspendu premium avec éclairage intégré',
          specs: 'Finition laiton / Prêt LED / Robuste'
        },
        {
          name: 'Mur d\'Affichage pour Chaussures',
          description: 'Étagères étagées optimisées pour la chaussure',
          specs: 'Acrylique et Bois / Étagères inclinées / Montage facile'
        }
      ]
    },
    productsPage: {
      title: 'Nos Produits',
      subtitle: 'Accessoires professionnels et solutions d\'affichage pour le détail de mode',
      customSolutionTitle: 'Besoin d\'une Solution Personnalisée ?',
      customSolutionSubtitle: 'Contactez-nous pour discuter de vos exigences spécifiques',
      getInTouch: 'Prenez Contact'
    },
    productDetail: {
      backToProducts: '← Retour aux Produits',
      description: 'Accessoire professionnel de qualité commerciale pour environnements de détail.',
      specifications: 'Spécifications :',
      material: 'Matériau',
      loadCapacity: 'Capacité de Charge',
      customizableSizes: 'Tailles personnalisables disponibles',
      easyAssembly: 'Montage facile avec instructions incluses',
      requestQuote: 'Demander un Devis',
      downloadSpecs: 'Télécharger les Spécifications (PDF)',
      shirtRackDescription: 'Personnalisable',
      bagRackDescription: 'Personnalisable avec options de logo, styles, couleurs, matériaux, structures et dimensions au choix'
    },
    contact: {
      title: 'Contactez-Nous',
      subtitle: 'Prêt à commencer votre projet ? Contactez notre équipe',
      sendMessageTitle: 'Envoyez-Nous un Message',
      nameLabel: 'Nom *',
      companyLabel: 'Entreprise / Nom du Magasin',
      emailLabel: 'E-mail *',
      phoneLabel: 'Téléphone',
      storeAreaLabel: 'Surface du Magasin (m²)',
      requirementTypeLabel: 'Type d\'Exigence',
      requirementTypePlaceholder: 'Sélectionnez...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'J\'ai besoin de services OEM/ODM (marque privée)',
      uploadDrawingsLabel: 'Télécharger des Plans ou Images de Référence',
      uploadFormats: 'Formats acceptés : JPG, PNG, PDF (Max 10 Mo par fichier)',
      messageLabel: 'Message *',
      messagePlaceholder: 'Parlez-nous des exigences de votre projet...',
      sendInquiry: 'Envoyer la Demande',
      responseTime: 'Nous répondons généralement sous 24 heures',
      successMessage: 'Merci ! Nous répondrons sous 24 heures.',
      failMessage: 'Échec de l\'envoi. Veuillez réessayer.',
      contactInfoTitle: 'Informations de Contact',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      connectTitle: 'Connectez-Vous avec Nous',
      chatSystem: 'Système de Chat',
      businessHours: 'Heures d\'Assistance (Équipe Humaine)',
      businessHoursContent: 'Lundi–Vendredi : 9h00 – 18h00 (GMT+8)<br />Samedi : 9h00 – 12h00 (GMT+8)<br />Dimanche et jours fériés : Fermé',
      aiSupport: 'En Dehors de Ces Heures ?',
      aiSupportContent: 'Notre assistant IA est disponible <strong>24h/24 et 7j/7</strong> pour répondre aux questions courantes, vérifier les commandes et aider avec les problèmes rapides. Pour les demandes complexes, nous vous répondrons dans le prochain jour ouvrable.',
      phoneNotice: 'Avis de Service Téléphonique',
      phoneNoticeText: 'Le service téléphonique international n\'est pas encore disponible. Veuillez utiliser l\'e-mail, Lark ou notre système de chat pour nous contacter. Nous nous excusons pour tout inconvénient.'
    },
    cases: {
      title: 'Magasins Réels · Transformations Réelles',
      subtitle: 'Magasins réels, transformations réelles - voyez comment nous avons aidé les entreprises à réussir',
      viewAll: 'Voir Toutes les Études de Cas',
      items: [
        { name: 'Boutique Élégante Shanghai', result: 'SKU en affichage +40%' },
        { name: 'Magasin de Collection Tendance Pékin', result: 'Temps de séjour client +35%' },
        { name: 'Magasin Phare Sportif Guangzhou', result: 'Conversion des ventes +25%' },
        { name: 'Magasin de Mode Enfantine Shenzhen', result: 'Utilisation de l\'espace +50%' },
        { name: 'Mode Féminine de Luxe Hangzhou', result: 'Perception de la marque élevée' },
        { name: 'Chaîne Fast Fashion Chengdu', result: 'Efficacité de réapprovisionnement +60%' }
      ]
    },
    services: {
      title: 'Nos Services',
      subtitle: 'Solutions complètes pour vos besoins d\'affichage de détail',
      customDesign: 'Approfondissement de l\'Artisanat',
      customDesignDesc: 'Vous pouvez fournir des plans, des photos ou des descriptions verbales. Nous créerons des plans d\'artisanat et vérifierons chaque détail avec vous - des matériaux, couleurs, structures, normes de qualité, scénarios d\'utilisation du produit, aux méthodes d\'installation. Après avoir confirmé que tout est correct, nous procédons à l\'approfondissement de l\'artisanat, marquons SOP pour l\'artisanat et SIP pour l\'inspection, tout au long de la production, de l\'emballage, et fournissons des services de guide d\'installation à distance.',
      oemOdm: 'Services OEM/ODM',
      oemOdmDesc: 'Votre marque, notre expertise en fabrication. Sans quantités minimales de commande.',
      spacePlanning: 'Fournir des Échantillons',
      spacePlanningDesc: 'Nous acceptons les demandes d\'échantillonnage de produits et les demandes d\'échantillonnage de matériaux (l\'échantillonnage de matériaux se concentre principalement sur la comparaison de couleur et de matériau).',
      installationSupport: 'Support d\'Installation',
      installationSupportDesc: 'Guides d\'installation détaillés et support à distance pour une configuration sans problème.',
      processTitle: 'Notre Processus',
      steps: [
        'Accepter les Exigences',
        'Faire Correspondre les Exigences aux Plans - Confirmer matériau, couleur, structure, scénario d\'utilisation, méthode d\'installation, emballage, étiquetage, manuel et transport pour chaque produit basé sur les plans',
        'Calculer la Date de Fin Estimée et le Devis',
        'Approfondissement des Plans - Établir le chemin de traitement, la nomenclature de fabrication, le SOP de production et le SIP d\'inspection pour chaque produit',
        'Planification PMC - Établir le plan d\'achat et le plan de production, acheter et produire selon le plan',
        'Inspection d\'Assemblage d\'Essai et Enregistrement Vidéo',
        'Emballage, Étiquetage, Entreposage, Planifier l\'Expédition avec le Client, Envoyer les Vidéos d\'Assemblage d\'Essai pour Chaque Produit et la Liste de Colisage Montrant Quels Composants Sont dans Quelle Caisse en Bois'
      ],
      ctaTitle: 'Prêt à Commencer ?',
      ctaSubtitle: 'Contactez-nous pour discuter des exigences de votre projet',
      contactUs: 'Contactez-Nous'
    },
    caseDetail: {
      backToCases: '← Retour aux Études de Cas',
      projectOverview: 'Aperçu du Projet',
      projectOverviewDesc: 'Cette étude de cas démontre notre capacité à transformer les espaces de détail avec des accessoires personnalisés qui correspondent parfaitement à l\'identité de marque et aux exigences fonctionnelles du client.',
      challenge: 'Le Défi',
      challengeDesc: 'Le client avait besoin d\'une refonte complète du magasin pour mieux présenter ses produits et améliorer le flux de clients.',
      solution: 'Notre Solution',
      solutionDesc: 'Nous avons conçu et fabriqué un système d\'affichage complet qui a maximisé l\'espace au sol tout en maintenant une esthétique élégante et moderne.',
      results: 'Résultats',
      result1: 'Visibilité des produits augmentée de 40%',
      result2: 'Temps de séjour client amélioré',
      result3: 'Perception de la marque améliorée',
      startProject: 'Commencez Votre Projet'
    },
    brandStory: {
      title: 'Nous Venons de Chine Continentale.',
      paragraph1: 'Peut-être loin de vous, mais proche de vos besoins.',
      paragraph2: 'Peu importe la taille du magasin, le budget ou la complexité du design—tant que vous parlez, nous nous asseyerons et aurons une discussion sérieuse.',
      paragraph3: 'Pour chacune de vos exigences, nous ferons de notre mieux pour les réaliser avec professionnalisme et sincérité.',
      quote: 'Nous n\'exagérons pas, nous ne cachons rien. Si nous pouvons le faire, nous le dirons. Si nous ne pouvons pas, nous vous dirons pourquoi.'
    },
    trust: {
      trustedBy: 'Approuvé par les Grandes Marques',
      testimonials: 'Ce Que Disent Nos Clients',
      yearsExperience: 'Années d\'Expérience',
      storesServed: 'Magasins Desservis',
      reproductionPromise: 'Promesse de Reproduction de Plans',
      brands: [
        { name: 'Marque A' },
        { name: 'Marque B' },
        { name: 'Marque C' },
        { name: 'Marque D' },
        { name: 'Marque E' },
        { name: 'Marque F' }
      ],
      testimonialsList: [
        {
          quote: 'La qualité a dépassé nos attentes. Les accessoires correspondaient parfaitement à nos plans de conception.',
          author: 'Sarah Chen',
          role: 'Propriétaire de Boutique, Shanghai'
        },
        {
          quote: 'Équipe professionnelle, communication claire et livraison à temps. Hautement recommandé !',
          author: 'Michael Zhang',
          role: 'Gestionnaire de Chaîne de Détail, Pékin'
        }
      ]
    },
    cta: {
      title: 'Prêt à Ouvrir un Magasin de Vêtements ? Ou à Moderniser Votre Magasin Existant ?',
      subtitle: 'Besoin de mises à jour et de modernisation des accessoires ?',
      button: 'Obtenir un Plan de Consultation de Magasin Gratuit',
      promise: 'Aucun engagement requis, réponse sous 24 heures. Nous n\'avons pas peur des tracas, seulement de ne pas avoir la chance de faire nos preuves.'
    },
    footer: {
      description: 'Accessoires professionnels et solutions d\'affichage pour le détail de mode. Du plan à la réalité - votre partenaire de fabrication chinois de confiance.',
      quickLinks: 'Liens Rapides',
      contactUs: 'Contactez-Nous',
      newsletter: 'Bulletin',
      newsletterDesc: 'Abonnez-vous pour obtenir les derniers produits et informations de l\'industrie',
      subscribe: 'S\'abonner',
      privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions d\'Utilisation',
      yourEmail: 'Votre e-mail',
      premiumQuality: 'Qualité Premium'
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      success: 'Succès',
      close: 'Fermer'
    },
    trustBanner: {
      text: 'De l\'industrie chinoise d\'affichage de magasins · Toutes les exigences confirmées par des plans, s\'efforçant pour une mise en œuvre 1:1 | Acceptant OEM/ODM, échantillonnage de produits et échantillonnage de matériaux'
    }
  },
  // German translations
  de: {
    nav: {
      solutions: 'Lösungen',
      products: 'Produkte',
      cases: 'Referenzen',
      resources: 'Ressourcen',
      about: 'Über uns',
      contact: 'Kontakt',
      consultation: 'Kostenlose Beratung'
    },
    hero: {
      title: 'Herstellung von Geschäftsmöbeln.',
      subtitle: 'Sie liefern die Anforderungen, wir überprüfen gemeinsam die Zeichnungsdetails, ich vertiefe die Handwerkstechnik und produziere nach Zeichnungsstandards.',
      trustStatement: 'Anforderungsannahme → Zeichnungsüberprüfung → Schnelle Antwort mit geschätztem Fertigstellungsdatum & Angebot → Jeder Prozess folgt SOP/SIP für Produktion und Inspektion → Verpackung folgt strikt der BOM-Liste',
      exploreSolutions: 'Lösungen entdecken',
      contactExpert: 'Experten kontaktieren'
    },
    capabilities: {
      title: 'Was können wir tun?',
      reqToDrawings: 'Anforderungen → Zeichnungen',
      reqToDrawingsDesc: 'Ob handgezeichnete Skizzen, Fotos oder Ideen – wir helfen Ihnen, sie in präzise Produktionszeichnungen umzusetzen.',
      drawingsToReality: 'Zeichnungen → Realität',
      drawingsToRealityDesc: 'Bau nach Zeichnung, 1:1-Reproduktion. Jedes Detail, jedes Material, vollständig konsistent mit den Zeichnungen.',
      oemOdm: 'OEM/ODM-Dienstleistungen',
      oemOdmDesc: 'Wir akzeptieren OEM/ODM. Ihre Marke, wir fertigen. Ohne Mindestbestellmenge.'
    },
    solutions: {
      title: 'Professionelle Display-Lösungen für verschiedene Bekleidungskategorien',
      womenswear: 'High-End Damenmode-Markengeschäfte',
      boutique: 'Mode-Kollektionsgeschäfte / Boutiquen',
      sports: 'Sport-/Casual-Markengeschäfte',
      kids: 'Kinder-/Fast-Fashion-Geschäfte',
      tags: {
        elegant: 'Elegant',
        textured: 'Strukturiert',
        lightingAtmosphere: 'Lichtatmosphäre',
        trendy: 'Trendig',
        unique: 'Einzigartig',
        curatedDisplay: 'Kuratierte Ausstellung',
        dynamic: 'Dynamisch',
        functional: 'Funktional',
        activeLifestyle: 'Aktiver Lebensstil',
        playful: 'Verspielt',
        flexible: 'Flexibel',
        quickTurnover: 'Schneller Umsatz'
      }
    },
    blueprint: {
      title: 'Jede Zeichnung, wir streben 1:1-Umsetzung an',
      subtitle: 'Sie kümmern sich um das Design, wir finden alle Wege, es zur Realität zu machen.',
      customerProvided: 'Vom Kunden bereitgestellt',
      finishedProduct: 'Unser Fertigprodukt',
      reproduction: '1:1-Reproduktion',
      originalDrawing: 'Originalzeichnung/Skizze',
      actualProduct: 'Tatsächliches Fertigprodukt',
      comparisons: [
        { description: 'Maßgeschneidertes Einzelhandelsregalsystem - vom Konzept zum Fertigprodukt' },
        { description: 'Boutique-Display-Ausstattung - präzise Reproduktion' },
        { description: 'Modulare Kleiderständer - exakte Spezifikationen erfüllt' }
      ]
    },
    products: {
      title: 'Unsere Display-Systeme',
      subtitle: 'Gewerbliche Ausstattung für professionelle Einzelhandelsumgebungen',
      viewAll: 'Alle Produkte anzeigen',
      viewDetails: 'Details anzeigen',
      getQuote: 'Angebot anfordern',
      learnMore: 'Mehr erfahren',
      items: [
        {
          name: 'Modulares Kleiderständersystem',
          description: 'Robuster Stahlrahmen mit verstellbaren Regalen',
          specs: 'Stahl / Anpassbar / 200kg Tragfähigkeit'
        },
        {
          name: 'Boutique-Display-Regal',
          description: 'Elegante Holz-Metall-Kombination',
          specs: 'Holz & Metall / Verschiedene Größen / 150kg Tragfähigkeit'
        },
        {
          name: 'Einzelhandels-Wanddisplay',
          description: 'Platzsparende wandmontierte Display-Lösung',
          specs: 'Aluminium / Modular / 100kg pro Regal'
        },
        {
          name: 'Zentrale Insel-Display-Tisch',
          description: 'Vielseitiges Herzstück für Produktpräsentation',
          specs: 'Gemischte Materialien / Maßgeschneiderte Größen / 300kg Tragfähigkeit'
        },
        {
          name: 'Kleiderstangensystem',
          description: 'Premium-Hängestange mit integrierter Beleuchtung',
          specs: 'Messing-Oberfläche / LED-bereit / Schwerlast'
        },
        {
          name: 'Schuh-Display-Wand',
          description: 'Abgestufte Regale optimiert für Schuh-Einzelhandel',
          specs: 'Acryl & Holz / Abgewinkelte Regale / Einfache Montage'
        }
      ]
    },
    productsPage: {
      title: 'Unsere Produkte',
      subtitle: 'Professionelle Geschäftsausstattung und Display-Lösungen für Bekleidungseinzelhandel',
      customSolutionTitle: 'Benötigen Sie eine maßgeschneiderte Lösung?',
      customSolutionSubtitle: 'Kontaktieren Sie uns, um Ihre spezifischen Anforderungen zu besprechen',
      getInTouch: 'Kontakt aufnehmen'
    },
    productDetail: {
      backToProducts: '← Zurück zu Produkten',
      description: 'Professionelle gewerbliche Ausstattung für Einzelhandelsumgebungen.',
      specifications: 'Spezifikationen:',
      material: 'Material',
      loadCapacity: 'Tragfähigkeit',
      customizableSizes: 'Maßgeschneiderte Größen verfügbar',
      easyAssembly: 'Einfache Montage mit beiliegender Anleitung',
      requestQuote: 'Angebot anfordern',
      downloadSpecs: 'Spezifikationen herunterladen (PDF)',
      shirtRackDescription: 'Anpassbar',
      bagRackDescription: 'Anpassbar mit Logo-Optionen, individuelle Gestaltung von Stil, Farbe, Material, Struktur und Abmessungen'
    },
    contact: {
      title: 'Kontaktieren Sie uns',
      subtitle: 'Bereit, Ihr Projekt zu starten? Nehmen Sie Kontakt mit unserem Team auf',
      sendMessageTitle: 'Senden Sie uns eine Nachricht',
      nameLabel: 'Name *',
      companyLabel: 'Firma / Geschäftsname',
      emailLabel: 'E-Mail *',
      phoneLabel: 'Telefon',
      storeAreaLabel: 'Geschäftsfläche (m²)',
      requirementTypeLabel: 'Anforderungstyp',
      requirementTypePlaceholder: 'Auswählen...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'Ich benötige OEM/ODM-Dienstleistungen (Private Labeling)',
      uploadDrawingsLabel: 'Zeichnungen oder Referenzbilder hochladen',
      uploadFormats: 'Akzeptierte Formate: JPG, PNG, PDF (Max 10MB pro Datei)',
      messageLabel: 'Nachricht *',
      messagePlaceholder: 'Erzählen Sie uns von Ihren Projektanforderungen...',
      sendInquiry: 'Anfrage senden',
      responseTime: 'Wir antworten normalerweise innerhalb von 24 Stunden',
      successMessage: 'Danke! Wir werden innerhalb von 24 Stunden antworten.',
      failMessage: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.',
      contactInfoTitle: 'Kontaktinformationen',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      connectTitle: 'Verbinden Sie sich mit uns',
      chatSystem: 'Chat-System',
      businessHours: 'Support-Zeiten (Human Team)',
      businessHoursContent: 'Montag–Freitag: 9:00–18:00 Uhr (GMT+8)<br />Samstag: 9:00–12:00 Uhr (GMT+8)<br />Sonntag & Feiertage: Geschlossen',
      aiSupport: 'Außerhalb dieser Zeiten?',
      aiSupportContent: 'Unser KI-Assistent ist <strong>24/7</strong> verfügbar, um häufige Fragen zu beantworten, Bestellungen zu prüfen und bei schnellen Problemen zu helfen. Für komplexe Anfragen erhalten Sie am nächsten Werktag eine Antwort.',
      phoneNotice: 'Telefondienst-Hinweis',
      phoneNoticeText: 'Der internationale Telefondienst ist noch nicht verfügbar. Bitte verwenden Sie E-Mail, Lark oder unser Chat-System, um uns zu kontaktieren. Wir entschuldigen uns für eventuelle Unannehmlichkeiten.'
    },
    cases: {
      title: 'Echte Geschäfte · Echte Transformationen',
      subtitle: 'Echte Geschäfte, echte Transformationen - sehen Sie, wie wir Unternehmen zum Erfolg verholfen haben',
      viewAll: 'Alle Referenzen anzeigen',
      items: [
        { name: 'Elegante Boutique Shanghai', result: 'Display-SKU-Anzahl +40%' },
        { name: 'Trendy Kollektionsgeschäft Peking', result: 'Kundenverweildauer +35%' },
        { name: 'Sportmarken-Flagship Guangzhou', result: 'Verkaufskonversion +25%' },
        { name: 'Kindermode-Geschäft Shenzhen', result: 'Raumnutzung +50%' },
        { name: 'Luxus-Damenmode Hangzhou', result: 'Markenwahrnehmung verbessert' },
        { name: 'Fast-Fashion-Kette Chengdu', result: 'Nachschubeffizienz +60%' }
      ]
    },
    services: {
      title: 'Unsere Dienstleistungen',
      subtitle: 'Umfassende Lösungen für Ihre Einzelhandels-Display-Bedürfnisse',
      customDesign: 'Handwerksvertiefung',
      customDesignDesc: 'Sie können Zeichnungen, Fotos oder mündliche Beschreibungen liefern. Wir erstellen Handwerkszeichnungen und überprüfen jedes Detail mit Ihnen - von Materialien, Farben, Strukturen, Qualitätsstandards, Produktverwendungsszenarien bis hin zu Installationsmethoden. Nach Bestätigung, dass alles korrekt ist, fahren wir mit der Handwerksvertiefung fort, markieren SOP für Handwerk und SIP für Inspektion, während der gesamten Produktion, Verpackung, und bieten Ferninstallationsanleitungsdienste an.',
      oemOdm: 'OEM/ODM-Dienstleistungen',
      oemOdmDesc: 'Ihre Marke, unsere Fertigungsexpertise. Ohne Mindestbestellmengen.',
      spacePlanning: 'Musterversorgung',
      spacePlanningDesc: 'Wir akzeptieren Produktmusteranfragen und Materialmusteranfragen (Materialmuster konzentrieren sich hauptsächlich auf Farb- und Materialvergleich).',
      installationSupport: 'Installationsunterstützung',
      installationSupportDesc: 'Detaillierte Installationsanleitungen und Remote-Support für nahtlose Einrichtung.',
      processTitle: 'Unser Prozess',
      steps: [
        'Anforderungen akzeptieren',
        'Anforderungen mit Zeichnungen abgleichen - Material, Farbe, Struktur, Verwendungsszenario, Installationsmethode, Verpackung, Etikettierung, Handbuch und Transport für jedes Produkt basierend auf Zeichnungen bestätigen',
        'Geschätztes Fertigstellungsdatum & Angebot berechnen',
        'Zeichnungsvertiefung - Verarbeitungsweg, Fertigungs-BOM, Produktions-SOP und Inspektions-SIP für jedes Produkt festlegen',
        'PMC-Planung - Beschaffungsplan und Produktionsplan erstellen, gemäß Plan beschaffen und produzieren',
        'Testmontage-Inspektion & Videoaufnahme',
        'Verpackung, Etikettierung, Einlagerung, Versand mit Kunde planen, Testmontage-Videos für jedes Produkt und Packliste senden, die zeigt, welche Komponenten in welcher Holzkiste sind'
      ],
      ctaTitle: 'Bereit loszulegen?',
      ctaSubtitle: 'Kontaktieren Sie uns, um Ihre Projektanforderungen zu besprechen',
      contactUs: 'Kontaktieren Sie uns'
    },
    caseDetail: {
      backToCases: '← Zurück zu Referenzen',
      projectOverview: 'Projektübersicht',
      projectOverviewDesc: 'Diese Fallstudie demonstriert unsere Fähigkeit, Einzelhandelsräume mit maßgeschneiderter Ausstattung zu transformieren, die perfekt zur Markenidentität und den funktionalen Anforderungen des Kunden passt.',
      challenge: 'Die Herausforderung',
      challengeDesc: 'Der Kunde benötigte eine komplette Geschäftsumgestaltung, um seine Produkte besser zu präsentieren und den Kundenfluss zu verbessern.',
      solution: 'Unsere Lösung',
      solutionDesc: 'Wir entwarfen und fertigten ein umfassendes Display-System, das die Bodenfläche maximiert und gleichzeitig eine elegante, moderne Ästhetik beibehält.',
      results: 'Ergebnisse',
      result1: 'Produktsichtbarkeit um 40% erhöht',
      result2: 'Kundenverweildauer verbessert',
      result3: 'Markenwahrnehmung verbessert',
      startProject: 'Starten Sie Ihr Projekt'
    },
    brandStory: {
      title: 'Wir kommen vom chinesischen Festland.',
      paragraph1: 'Vielleicht weit von Ihnen entfernt, aber nah an Ihren Bedürfnissen.',
      paragraph2: 'Egal ob Geschäftgröße, Budget oder Designkomplexität – solange Sie sprechen, setzen wir uns hin und führen eine ernsthafte Diskussion.',
      paragraph3: 'Für jede Ihrer Anforderungen werden wir unser Bestes tun, um sie mit Professionalität und Aufrichtigkeit zu verwirklichen.',
      quote: 'Wir übertreiben nicht, wir verbergen nichts. Wenn wir es können, sagen wir es. Wenn wir es nicht können, sagen wir Ihnen warum.'
    },
    trust: {
      trustedBy: 'Vertraut von führenden Marken',
      testimonials: 'Was unsere Kunden sagen',
      yearsExperience: 'Jahre Erfahrung',
      storesServed: 'Bediente Geschäfte',
      reproductionPromise: 'Zeichnungsreproduktionsversprechen',
      brands: [
        { name: 'Marke A' },
        { name: 'Marke B' },
        { name: 'Marke C' },
        { name: 'Marke D' },
        { name: 'Marke E' },
        { name: 'Marke F' }
      ],
      testimonialsList: [
        {
          quote: 'Die Qualität übertraf unsere Erwartungen. Die Ausstattung stimmte perfekt mit unseren Designzeichnungen überein.',
          author: 'Sarah Chen',
          role: 'Boutique-Besitzerin, Shanghai'
        },
        {
          quote: 'Professionelles Team, klare Kommunikation und pünktliche Lieferung. Sehr empfehlenswert!',
          author: 'Michael Zhang',
          role: 'Einzelhandelsketten-Manager, Peking'
        }
      ]
    },
    cta: {
      title: 'Bereit, ein Bekleidungsgeschäft zu eröffnen? Oder Ihr bestehendes Geschäft zu modernisieren?',
      subtitle: 'Benötigen Sie Ausstattungsupdates und Modernisierung?',
      button: 'Kostenlosen Geschäftsberatungsplan erhalten',
      promise: 'Keine Verpflichtung erforderlich, Antwort innerhalb von 24 Stunden. Wir scheuen keine Mühe, nur keine Gelegenheit, uns zu beweisen.'
    },
    footer: {
      description: 'Professionelle Geschäftsausstattung und Display-Lösungen für Bekleidungseinzelhandel. Von der Zeichnung zur Realität - Ihr vertrauenswürdiger chinesischer Fertigungspartner.',
      quickLinks: 'Schnelllinks',
      contactUs: 'Kontaktieren Sie uns',
      newsletter: 'Newsletter',
      newsletterDesc: 'Abonnieren Sie für neueste Produkte und Brancheneinblicke',
      subscribe: 'Abonnieren',
      privacyPolicy: 'Datenschutzrichtlinie',
      termsOfService: 'Nutzungsbedingungen',
      yourEmail: 'Ihre E-Mail',
      premiumQuality: 'Premium-Qualität'
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      send: 'Senden',
      sending: 'Wird gesendet...',
      success: 'Erfolg',
      close: 'Schließen'
    },
    trustBanner: {
      text: 'Aus Chinas Geschäftsanzeigenindustrie · Alle Anforderungen werden durch Zeichnungen bestätigt, streben nach 1:1-Umsetzung | Akzeptieren von OEM/ODM, Produktmusterung und Materialmusterung'
    }
  },
  // Korean translations
  ko: {
    nav: {
      solutions: '솔루션',
      products: '제품',
      cases: '사례',
      resources: '리소스',
      about: '회사 소개',
      contact: '연락처',
      consultation: '무료 매장 상담'
    },
    hero: {
      title: '상업용 가구 제조.',
      subtitle: '귀하가 요구사항을 제공하면, 우리가 함께 도면 세부사항을 확인하고, 제가 공예를 심화하며 도면 표준에 따라 생산을 완료합니다.',
      trustStatement: '요구사항 수락 → 도면 확인 → 예상 완료 날짜 및 견적 신속 답변 → 모든 공정은 SOP/SIP에 따라 제작 및 검사 → 포장은 BOM 목록을 엄격히 준수',
      exploreSolutions: '솔루션 탐색',
      contactExpert: '전문가 연락'
    },
    capabilities: {
      title: '우리가 할 수 있는 일',
      reqToDrawings: '요구사항 → 도면',
      reqToDrawingsDesc: '손그림 스케치, 사진 또는 아이디어라도 정확한 생산 도면으로 변환할 수 있도록 도와드립니다.',
      drawingsToReality: '도면 → 현실',
      drawingsToRealityDesc: '도면에 따른 시공, 1:1 재현. 모든 디테일, 모든 소재가 도면과 완전히 일치합니다.',
      oemOdm: 'OEM/ODM 서비스',
      oemOdmDesc: 'OEM/ODM 수락. 귀하의 브랜드, 우리가 제조. 최소 주문량 없음.'
    },
    solutions: {
      title: '다양한 의류 카테고리를 위한 전문 디스플레이 솔루션',
      womenswear: '고급 여성복 브랜드 매장',
      boutique: '패션 컬렉션 매장 / 부티크',
      sports: '스포츠/캐주얼 브랜드 매장',
      kids: '아동복/패스트 패션 매장',
      tags: {
        elegant: '우아함',
        textured: '질감',
        lightingAtmosphere: '조명 분위기',
        trendy: '트렌디',
        unique: '독특함',
        curatedDisplay: '큐레이션 디스플레이',
        dynamic: '다이내믹',
        functional: '기능적',
        activeLifestyle: '액티브 라이프스타일',
        playful: '장난기',
        flexible: '유연함',
        quickTurnover: '신속한 회전'
      }
    },
    blueprint: {
      title: '어떤 도면이든 1:1 구현을 위해 노력합니다',
      subtitle: '디자인은 귀하가 맡으세요. 우리는 그것을 현실로 만드는 모든 방법을 찾습니다.',
      customerProvided: '고객 제공',
      finishedProduct: '우리의 완제품',
      reproduction: '1:1 재현',
      originalDrawing: '원본 도면/스케치',
      actualProduct: '실제 완제품',
      comparisons: [
        { description: '맞춤형 소매 선반 시스템 - 컨셉에서 완제품까지' },
        { description: '부티크 디스플레이 비품 - 정밀 재현' },
        { description: '모듈식 의류 걸이 - 정확한 사양 충족' }
      ]
    },
    products: {
      title: '우리의 디스플레이 시스템',
      subtitle: '전문 소매 환경을 위한 상업용 등급 비품',
      viewAll: '모든 제품 보기',
      viewDetails: '세부사항 보기',
      getQuote: '견적 요청',
      learnMore: '자세히 알아보기',
      items: [
        {
          name: '모듈식 의류 걸이 시스템',
          description: '조절 가능한 선반이 있는 중강철 프레임',
          specs: '강철 / 맞춤 가능 / 200kg 하중'
        },
        {
          name: '부티크 디스플레이 선반',
          description: '우아한 목재와 금속 조합 선반',
          specs: '목재 & 금속 / 다양한 크기 / 150kg 하중'
        },
        {
          name: '소매 벽면 디스플레이 유닛',
          description: '공간 효율적인 벽 장착 디스플레이 솔루션',
          specs: '알루미늄 / 모듈식 / 선반당 100kg'
        },
        {
          name: '중앙 아일랜드 디스플레이 테이블',
          description: '제품 전시를 위한 다목적 센터피스',
          specs: '혼합 소재 / 맞춤 크기 / 300kg 하중'
        },
        {
          name: '의류 레일 시스템',
          description: '통합 조명이 있는 프리미엄 행잉 레일',
          specs: '황동 마감 / LED 준비 / 중량급'
        },
        {
          name: '신발 디스플레이 월',
          description: '신발 소매에 최적화된 계단식 선반',
          specs: '아크릴 & 목재 / 경사 선반 / 쉬운 조립'
        }
      ]
    },
    productsPage: {
      title: '우리의 제품',
      subtitle: '의류 소매를 위한 전문 매장 비품 및 디스플레이 솔루션',
      customSolutionTitle: '맞춤형 솔루션이 필요하신가요?',
      customSolutionSubtitle: '구체적인 요구사항을 논의하려면 저희에게 연락하십시오',
      getInTouch: '연락하기'
    },
    productDetail: {
      backToProducts: '← 제품으로 돌아가기',
      description: '소매 환경을 위한 전문 상업용 등급 비품.',
      specifications: '사양:',
      material: '소재',
      loadCapacity: '하중 용량',
      customizableSizes: '맞춤 크기 가능',
      easyAssembly: '포함된 설명서로 쉬운 조립',
      requestQuote: '견적 요청',
      downloadSpecs: '사양 다운로드 (PDF)',
      shirtRackDescription: '맞춤 제작 가능',
      bagRackDescription: '로고 옵션 포함 맞춤 제작 가능, 스타일, 색상, 소재, 구조, 치수 자유 설계'
    },
    contact: {
      title: '문의하기',
      subtitle: '프로젝트를 시작할 준비가 되셨나요? 우리 팀에 연락하십시오',
      sendMessageTitle: '메시지 보내기',
      nameLabel: '이름 *',
      companyLabel: '회사 / 매장명',
      emailLabel: '이메일 *',
      phoneLabel: '전화번호',
      storeAreaLabel: '매장 면적 (㎡)',
      requirementTypeLabel: '요구사항 유형',
      requirementTypePlaceholder: '선택...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'OEM/ODM 서비스가 필요합니다 (프라이빗 라벨링)',
      uploadDrawingsLabel: '도면 또는 참조 이미지 업로드',
      uploadFormats: '허용 형식: JPG, PNG, PDF (파일당 최대 10MB)',
      messageLabel: '메시지 *',
      messagePlaceholder: '프로젝트 요구사항에 대해 알려주세요...',
      sendInquiry: '문의 보내기',
      responseTime: '보통 24시간 이내에 답변드립니다',
      successMessage: '감사합니다! 24시간 이내에 답변드리겠습니다.',
      failMessage: '전송 실패. 다시 시도해 주세요.',
      contactInfoTitle: '연락처 정보',
      email: '이메일',
      phone: '전화',
      address: '주소',
      connectTitle: '우리와 연결',
      chatSystem: '채팅 시스템',
      businessHours: '지원 시간 (인간 팀)',
      businessHoursContent: '월요일–금요일: 오전 9:00 – 오후 6:00 (GMT+8)<br />토요일: 오전 9:00 – 오후 12:00 (GMT+8)<br />일요일 및 공휴일: 휴무',
      aiSupport: '이 시간 외에?',
      aiSupportContent: '저희 AI 어시스턴트는 일반적인 질문에 답변하고, 주문을 확인하며, 빠른 문제를 해결하기 위해 <strong>24/7</strong> 이용 가능합니다. 복잡한 요청의 경우 다음 영업일에 답변드리겠습니다.',
      phoneNotice: '전화 서비스 안내',
      phoneNoticeText: '국제 전화 서비스가 아직 이용할 수 없습니다. 이메일, Lark 또는 채팅 시스템을 이용해 연락해 주세요. 불편을 드려 죄송합니다.'
    },
    cases: {
      title: '실제 매장 · 실제 변화',
      subtitle: '실제 매장, 실제 변화 - 우리가 기업의 성공을 어떻게 도왔는지 확인하세요',
      viewAll: '모든 사례 보기',
      items: [
        { name: '상하이 우아한 부티크', result: '디스플레이 SKU 수 +40%' },
        { name: '베이징 트렌드 컬렉션 매장', result: '고객 체류 시간 +35%' },
        { name: '광저우 스포츠 브랜드 플래그십', result: '판매 전환율 +25%' },
        { name: '선전 아동복 패션 매장', result: '공간 활용도 +50%' },
        { name: '항저우 럭셔리 여성복', result: '브랜드 인식 향상' },
        { name: '청두 패스트 패션 체인', result: '재고補充 효율 +60%' }
      ]
    },
    services: {
      title: '우리의 서비스',
      subtitle: '소매 디스플레이 요구를 위한 포괄적인 솔루션',
      customDesign: '공예 심화',
      customDesignDesc: '도면, 사진 또는 구두 설명을 제공할 수 있습니다. 우리는 공예 도면을 생성하고 모든 세부사항을 귀하와 확인합니다 - 소재, 색상, 구조, 품질 기준, 제품 사용 시나리오, 설치 방법부터. 모든 것이正確한 것을 확인한 후 공예 심화를 진행하고, 공예 SOP와 검사 SIP를 표시하며, 전체 생산, 포장 과정에서 원격 설치 가이드 서비스를 제공합니다.',
      oemOdm: 'OEM/ODM 서비스',
      oemOdmDesc: '귀하의 브랜드, 우리의 제조 전문성. 최소 주문량 없음.',
      spacePlanning: '샘플 제공',
      spacePlanningDesc: '제품 샘플 요청과 재료 샘플 요청을 수락합니다 (재료 샘플은 주로 색상과 소재 비교에 중점을 둡니다).',
      installationSupport: '설치 지원',
      installationSupportDesc: '원활한 설치를 위한 상세한 설치 가이드와 원격 지원.',
      processTitle: '우리의 프로세스',
      steps: [
        '요구사항 수락',
        '요구사항을 도면에 맞추기 - 도면을 기반으로 각 제품의 소재, 색상, 구조, 사용 시나리오, 설치 방법, 포장, 라벨링, 매뉴얼 및 운송 확인',
        '예상 완료 날짜 및 견적 계산',
        '도면 심화 - 각 제품의 가공 경로, 제조 BOM, 생산 SOP 및 검사 SIP 확립',
        'PMC 계획 - 조달 계획과 생산 계획 수립, 계획에 따라 조달 및 생산',
        '시험 조립 검사 및 비디오 녹화',
        '포장, 라벨링, 입고, 고객과 배송 일정 조정, 각 제품의 시험 조립 비디오와 어떤 구성 요소가 어떤 나무 상자에 있는지 보여주는 포장 목록 전송'
      ],
      ctaTitle: '시작할 준비가 되셨나요?',
      ctaSubtitle: '프로젝트 요구사항을 논의하려면 저희에게 연락하십시오',
      contactUs: '문의하기'
    },
    caseDetail: {
      backToCases: '← 사례로 돌아가기',
      projectOverview: '프로젝트 개요',
      projectOverviewDesc: '이 사례 연구는 고객의 브랜드アイデン티티와 기능적 요구사항에 완벽하게 맞는 맞춤형 비품으로 소매 공간을 변혁하는 우리의 능력을 보여줍니다.',
      challenge: '도전 과제',
      challengeDesc: '고객은 제품을 더 잘展示하고 고객 흐름을 개선하기 위해 매장의 완전한 개조가 필요했습니다.',
      solution: '우리의 솔루션',
      solutionDesc: '우리는 우아하고 현대적인 미학을 유지하면서 바닥 공간을 최대화하는 포괄적인 디스플레이 시스템을 설계하고 제조했습니다.',
      results: '결과',
      result1: '제품 가시성 40% 증가',
      result2: '고객 체류 시간 개선',
      result3: '브랜드 인식 향상',
      startProject: '프로젝트 시작'
    },
    brandStory: {
      title: '우리는 중국 대륙에서 왔습니다.',
      paragraph1: '아마도 여러분에게서 멀리 떨어져 있을지 모르지만, 여러분의 요구사항에는 가까이 있습니다.',
      paragraph2: '매장 크기, 예산 또는 디자인 복잡성에 관계없이 -只要你开口,我们就坐下来认真谈。',
      paragraph3: '여러분의 모든 요구사항에 대해 전문성과 성실함으로 실현하기 위해 최선을 다하겠습니다.',
      quote: '우리는 과장하지 않고, 숨기지 않습니다. 할 수 있으면 한다고 말하고, 할 수 없으면 그 이유를 말씀드리겠습니다.'
    },
    trust: {
      trustedBy: '주요 브랜드의 신뢰',
      testimonials: '고객의 의견',
      yearsExperience: '년 경험',
      storesServed: '서비스한 매장',
      reproductionPromise: '도면 재현 약속',
      brands: [
        { name: '브랜드 A' },
        { name: '브랜드 B' },
        { name: '브랜드 C' },
        { name: '브랜드 D' },
        { name: '브랜드 E' },
        { name: '브랜드 F' }
      ],
      testimonialsList: [
        {
          quote: '품질이 기대를 초과했습니다. 비품이 디자인 도면과 완벽하게 일치했습니다.',
          author: 'Sarah Chen',
          role: '부티크 소유자, 상하이'
        },
        {
          quote: '전문적인 팀, 명확한 커뮤니케이션, 정시 배송. 강력히 추천합니다!',
          author: 'Michael Zhang',
          role: '소매 체인 매니저, 베이징'
        }
      ]
    },
    cta: {
      title: '의류 매장을 열 준비가 되셨나요? 또는 기존 매장을 업그레이드하시겠습니까?',
      subtitle: '비품 업데이트와 현대화가 필요하신가요?',
      button: '무료 매장 상담 계획 받기',
      promise: '약속 불필요, 24시간 이내 답변. 우리는 번거로움을 두려워하지 않으며, 단지 자신을 증명할 기회를 갖지 못하는 것만 두려워합니다.'
    },
    footer: {
      description: '의류 소매를 위한 전문 매장 비품 및 디스플레이 솔루션. 도면에서 현실로 - 신뢰할 수 있는 중국 제조 파트너.',
      quickLinks: '빠른 링크',
      contactUs: '문의하기',
      newsletter: '뉴스레터',
      newsletterDesc: '최신 제품 및 업계 통찰력 구독',
      subscribe: '구독',
      privacyPolicy: '개인정보 보호정책',
      termsOfService: '이용약관',
      yourEmail: '이메일 주소',
      premiumQuality: '프리미엄 품질'
    },
    common: {
      loading: '로딩 중...',
      error: '오류',
      send: '보내기',
      sending: '전송 중...',
      success: '성공',
      close: '닫기'
    },
    trustBanner: {
      text: '중국 매장 디스플레이 산업에서 · 모든 요구사항은 도면을 통해 확인되며 1:1 구현을 위해 노력합니다 | OEM/ODM, 제품 샘플링 및 재료 샘플링 수락'
    }
  },
  // Portuguese translations
  pt: {
    nav: {
      solutions: 'Soluções',
      products: 'Produtos',
      cases: 'Casos',
      resources: 'Recursos',
      about: 'Sobre Nós',
      contact: 'Contato',
      consultation: 'Consultoria Gratuita'
    },
    hero: {
      title: 'Fabricação de Mobiliário Comercial.',
      subtitle: 'Você fornece os requisitos, verificamos juntos os detalhes do desenho, aprofundo o artesanato e produzo conforme padrões de desenho.',
      trustStatement: 'Aceitação de requisitos → Verificação de desenhos → Resposta rápida com data estimada de conclusão e cotação → Todos os processos seguem SOP/SIP para produção e inspeção → Embalagem segue estritamente lista BOM',
      exploreSolutions: 'Explorar Soluções',
      contactExpert: 'Contatar Especialista'
    },
    capabilities: {
      title: 'O que podemos fazer?',
      reqToDrawings: 'Requisitos → Desenhos',
      reqToDrawingsDesc: 'Seja esboços à mão, fotos ou ideias – ajudamos você a transformá-los em desenhos de produção precisos.',
      drawingsToReality: 'Desenhos → Realidade',
      drawingsToRealityDesc: 'Construção conforme desenho, reprodução 1:1. Cada detalhe, cada material, totalmente consistente com os desenhos.',
      oemOdm: 'Serviços OEM/ODM',
      oemOdmDesc: 'Aceitamos OEM/ODM. Sua marca, nós fabricamos. Sem quantidade mínima de pedido.'
    },
    solutions: {
      title: 'Soluções de exibição profissional para várias categorias de vestuário',
      womenswear: 'Lojas de marcas femininas de alto padrão',
      boutique: 'Lojas de coleções de moda / Boutiques',
      sports: 'Lojas de marcas esportivas/casuais',
      kids: 'Lojas infantis/fast fashion',
      tags: {
        elegant: 'Elegante',
        textured: 'Texturizado',
        lightingAtmosphere: 'Atmosfera de iluminação',
        trendy: 'Trendy',
        unique: 'Único',
        curatedDisplay: 'Exibição curada',
        dynamic: 'Dinâmico',
        functional: 'Funcional',
        activeLifestyle: 'Estilo de vida ativo',
        playful: 'Lúdico',
        flexible: 'Flexível',
        quickTurnover: 'Giro rápido'
      }
    },
    blueprint: {
      title: 'Para qualquer desenho, buscamos implementação 1:1',
      subtitle: 'Você cuida do design, encontramos todas as maneiras de torná-lo realidade.',
      customerProvided: 'Fornecido pelo cliente',
      finishedProduct: 'Nosso produto acabado',
      reproduction: 'Reprodução 1:1',
      originalDrawing: 'Desenho/esboço original',
      actualProduct: 'Produto acabado real',
      comparisons: [
        { description: 'Sistema de prateleiras de varejo personalizado - do conceito ao produto acabado' },
        { description: 'Equipamento de exibição de boutique - reprodução precisa' },
        { description: 'Cabides modulares - especificações exatas atendidas' }
      ]
    },
    products: {
      title: 'Nossos Sistemas de Exibição',
      subtitle: 'Equipamentos comerciais para ambientes de varejo profissionais',
      viewAll: 'Ver todos os produtos',
      viewDetails: 'Ver detalhes',
      getQuote: 'Solicitar cotação',
      learnMore: 'Saiba mais',
      items: [
        {
          name: 'Sistema Modular de Cabides',
          description: 'Estrutura de aço resistente com prateleiras ajustáveis',
          specs: 'Aço / Personalizável / Capacidade de 200kg'
        },
        {
          name: 'Prateleira de Exibição Boutique',
          description: 'Combinação elegante de madeira e metal',
          specs: 'Madeira & Metal / Vários tamanhos / Capacidade de 150kg'
        },
        {
          name: 'Unidade de Exibição de Parede',
          description: 'Solução de exibição montada na parede com eficiência espacial',
          specs: 'Alumínio / Modular / 100kg por prateleira'
        },
        {
          name: 'Mesa de Exibição Central',
          description: 'Peça central versátil para exposição de produtos',
          specs: 'Materiais mistos / Tamanhos personalizados / Capacidade de 300kg'
        },
        {
          name: 'Sistema de Trilho de Roupas',
          description: 'Trilho pendurado premium com iluminação integrada',
          specs: 'Acabamento em latão / Pronto para LED / Pesado'
        },
        {
          name: 'Parede de Exibição de Sapatos',
          description: 'Prateleiras escalonadas otimizadas para varejo de calçados',
          specs: 'Acrílico & Madeira / Prateleiras inclinadas / Fácil montagem'
        }
      ]
    },
    productsPage: {
      title: 'Nossos Produtos',
      subtitle: 'Equipamentos comerciais profissionais e soluções de exibição para varejo de vestuário',
      customSolutionTitle: 'Precisa de uma solução personalizada?',
      customSolutionSubtitle: 'Entre em contato conosco para discutir seus requisitos específicos',
      getInTouch: 'Entrar em contato'
    },
    productDetail: {
      backToProducts: '← Voltar aos produtos',
      description: 'Equipamento comercial profissional para ambientes de varejo.',
      specifications: 'Especificações:',
      material: 'Material',
      loadCapacity: 'Capacidade de carga',
      customizableSizes: 'Tamanhos personalizáveis disponíveis',
      easyAssembly: 'Montagem fácil com manual incluído',
      requestQuote: 'Solicitar cotação',
      downloadSpecs: 'Baixar especificações (PDF)',
      shirtRackDescription: 'Personalizável',
      bagRackDescription: 'Personalizável com opções de logotipo, estilos, cores, materiais, estruturas e dimensões customizáveis'
    },
    contact: {
      title: 'Entre em Contato',
      subtitle: 'Pronto para iniciar seu projeto? Entre em contato com nossa equipe',
      sendMessageTitle: 'Envie-nos uma mensagem',
      nameLabel: 'Nome *',
      companyLabel: 'Empresa / Nome da loja',
      emailLabel: 'E-mail *',
      phoneLabel: 'Telefone',
      storeAreaLabel: 'Área da loja (m²)',
      requirementTypeLabel: 'Tipo de requisito',
      requirementTypePlaceholder: 'Selecionar...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'Preciso de serviços OEM/ODM (rotulagem privada)',
      uploadDrawingsLabel: 'Carregar desenhos ou imagens de referência',
      uploadFormats: 'Formatos aceitos: JPG, PNG, PDF (Máx 10MB por arquivo)',
      messageLabel: 'Mensagem *',
      messagePlaceholder: 'Conte-nos sobre os requisitos do seu projeto...',
      sendInquiry: 'Enviar consulta',
      responseTime: 'Normalmente respondemos dentro de 24 horas',
      successMessage: 'Obrigado! Responderemos dentro de 24 horas.',
      failMessage: 'Falha no envio. Por favor, tente novamente.',
      contactInfoTitle: 'Informações de contato',
      email: 'E-mail',
      phone: 'Telefone',
      address: 'Endereço',
      connectTitle: 'Conecte-se conosco',
      chatSystem: 'Sistema de chat',
      businessHours: 'Horário de Suporte (Equipe Humana)',
      businessHoursContent: 'Segunda–Sexta: 9:00 – 18:00 (GMT+8)<br />Sábado: 9:00 – 12:00 (GMT+8)<br />Domingo e feriados: Fechado',
      aiSupport: 'Fora Desses Horários?',
      aiSupportContent: 'Nosso assistente de IA está disponível <strong>24/7</strong> para responder perguntas comuns, verificar pedidos e ajudar com problemas rápidos. Para solicitações complexas, retornaremos no próximo dia útil.',
      phoneNotice: 'Aviso de Serviço Telefônico',
      phoneNoticeText: 'O serviço telefônico internacional ainda não está disponível. Por favor, use e-mail, Lark ou nosso sistema de chat para nos contatar. Pedimos desculpas por qualquer inconveniente.'
    },
    cases: {
      title: 'Lojas Reais · Transformações Reais',
      subtitle: 'Lojas reais, transformações reais - veja como ajudamos empresas a terem sucesso',
      viewAll: 'Ver todos os casos',
      items: [
        { name: 'Boutique Elegante Xangai', result: 'Número de SKU de exibição +40%' },
        { name: 'Loja de Coleção Trendy Pequim', result: 'Tempo de permanência do cliente +35%' },
        { name: 'Flagship de Marca Esportiva Guangzhou', result: 'Conversão de vendas +25%' },
        { name: 'Loja Infantil Shenzhen', result: 'Utilização do espaço +50%' },
        { name: 'Moda Feminina Luxo Hangzhou', result: 'Percepção da marca melhorada' },
        { name: 'Rede Fast Fashion Chengdu', result: 'Eficiência de reposição +60%' }
      ]
    },
    services: {
      title: 'Nossos Serviços',
      subtitle: 'Soluções abrangentes para suas necessidades de exibição de varejo',
      customDesign: 'Aprofundamento Artesanal',
      customDesignDesc: 'Você pode fornecer desenhos, fotos ou descrições verbais. Criamos desenhos artesanais e verificamos todos os detalhes com você - desde materiais, cores, estruturas, padrões de qualidade, cenários de uso do produto até métodos de instalação. Após confirmar que tudo está correto, prosseguimos com o aprofundamento artesanal, marcamos SOP para artesanato e SIP para inspeção, durante toda a produção, embalagem, e fornecemos serviços de guia de instalação remota.',
      oemOdm: 'Serviços OEM/ODM',
      oemOdmDesc: 'Sua marca, nossa expertise em fabricação. Sem quantidades mínimas de pedido.',
      spacePlanning: 'Fornecimento de Amostras',
      spacePlanningDesc: 'Aceitamos solicitações de amostras de produtos e solicitações de amostras de materiais (amostras de materiais concentram-se principalmente em comparação de cores e materiais).',
      installationSupport: 'Suporte de Instalação',
      installationSupportDesc: 'Guias de instalação detalhados e suporte remoto para configuração perfeita.',
      processTitle: 'Nosso Processo',
      steps: [
        'Aceitar requisitos',
        'Corresponder requisitos com desenhos - confirmar material, cor, estrutura, cenário de uso, método de instalação, embalagem, rotulagem, manual e transporte para cada produto com base nos desenhos',
        'Calcular data estimada de conclusão e cotação',
        'Aprofundamento de desenhos - estabelecer rota de processamento, BOM de fabricação, SOP de produção e SIP de inspeção para cada produto',
        'Planejamento PMC - elaborar plano de aquisição e plano de produção, adquirir e produzir conforme o plano',
        'Inspeção de montagem de teste e gravação de vídeo',
        'Embalagem, rotulagem, armazenamento, agendar envio com cliente, enviar vídeos de montagem de teste para cada produto e lista de embalagem mostrando quais componentes estão em qual caixa de madeira'
      ],
      ctaTitle: 'Pronto para começar?',
      ctaSubtitle: 'Entre em contato conosco para discutir os requisitos do seu projeto',
      contactUs: 'Entre em contato'
    },
    caseDetail: {
      backToCases: '← Voltar aos casos',
      projectOverview: 'Visão geral do projeto',
      projectOverviewDesc: 'Este estudo de caso demonstra nossa capacidade de transformar espaços de varejo com equipamentos personalizados que se encaixam perfeitamente na identidade da marca e nos requisitos funcionais do cliente.',
      challenge: 'O Desafio',
      challengeDesc: 'O cliente precisava de uma reforma completa da loja para exibir melhor seus produtos e melhorar o fluxo de clientes.',
      solution: 'Nossa Solução',
      solutionDesc: 'Projetamos e fabricamos um sistema de exibição abrangente que maximiza o espaço do piso enquanto mantém uma estética elegante e moderna.',
      results: 'Resultados',
      result1: 'Visibilidade do produto aumentada em 40%',
      result2: 'Tempo de permanência do cliente melhorado',
      result3: 'Percepção da marca melhorada',
      startProject: 'Inicie seu projeto'
    },
    brandStory: {
      title: 'Somos do continente chinês.',
      paragraph1: 'Talvez longe de você, mas perto das suas necessidades.',
      paragraph2: 'Independentemente do tamanho da loja, orçamento ou complexidade do design - desde que você fale, sentamos e discutimos seriamente.',
      paragraph3: 'Para cada um dos seus requisitos, faremos o nosso melhor para realizá-lo com profissionalismo e sinceridade.',
      quote: 'Não exageramos, não escondemos nada. Se pudermos fazer, dizemos. Se não pudermos, dizemos por quê.'
    },
    trust: {
      trustedBy: 'Confiado por marcas líderes',
      testimonials: 'O que nossos clientes dizem',
      yearsExperience: 'Anos de experiência',
      storesServed: 'Lojas atendidas',
      reproductionPromise: 'Promessa de reprodução de desenhos',
      brands: [
        { name: 'Marca A' },
        { name: 'Marca B' },
        { name: 'Marca C' },
        { name: 'Marca D' },
        { name: 'Marca E' },
        { name: 'Marca F' }
      ],
      testimonialsList: [
        {
          quote: 'A qualidade superou nossas expectativas. Os equipamentos corresponderam perfeitamente aos nossos desenhos de design.',
          author: 'Sarah Chen',
          role: 'Proprietária de Boutique, Xangai'
        },
        {
          quote: 'Equipe profissional, comunicação clara e entrega pontual. Altamente recomendado!',
          author: 'Michael Zhang',
          role: 'Gerente de Rede de Varejo, Pequim'
        }
      ]
    },
    cta: {
      title: 'Pronto para abrir uma loja de roupas? Ou atualizar sua loja existente?',
      subtitle: 'Precisa de atualizações e modernização de equipamentos?',
      button: 'Obter plano de consultoria de loja gratuito',
      promise: 'Sem compromisso necessário, resposta dentro de 24 horas. Não tememos nenhum incômodo, apenas não ter oportunidade de nos provar.'
    },
    footer: {
      description: 'Equipamentos comerciais profissionais e soluções de exibição para varejo de vestuário. Do desenho à realidade - seu parceiro de fabricação chinês confiável.',
      quickLinks: 'Links rápidos',
      contactUs: 'Entre em contato',
      newsletter: 'Newsletter',
      newsletterDesc: 'Assine para obter os produtos mais recentes e insights do setor',
      subscribe: 'Assinar',
      privacyPolicy: 'Política de Privacidade',
      termsOfService: 'Termos de Serviço',
      yourEmail: 'Seu e-mail',
      premiumQuality: 'Qualidade Premium'
    },
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      send: 'Enviar',
      sending: 'Enviando...',
      success: 'Sucesso',
      close: 'Fechar'
    },
    trustBanner: {
      text: 'Da indústria chinesa de exibição de lojas · Todos os requisitos confirmados através de desenhos, esforçando-se para implementação 1:1 | Aceitando OEM/ODM, amostragem de produtos e amostragem de materiais'
    }
  },
  // Russian translations
  ru: {
    nav: {
      solutions: 'Решения',
      products: 'Продукты',
      cases: 'Кейсы',
      resources: 'Ресурсы',
      about: 'О нас',
      contact: 'Контакты',
      consultation: 'Бесплатная консультация'
    },
    hero: {
      title: 'Производство коммерческой мебели.',
      subtitle: 'Вы предоставляете требования, мы вместе проверяем детали чертежа, я углубляю мастерство и произвожу в соответствии со стандартами чертежа.',
      trustStatement: 'Принятие требований → Проверка чертежей → Быстрый ответ с предполагаемой датой завершения и сметой → Все процессы следуют SOP/SIP для производства и инспекции → Упаковка строго следует списку BOM',
      exploreSolutions: 'Изучить решения',
      contactExpert: 'Связаться с экспертом'
    },
    capabilities: {
      title: 'Что мы можем сделать?',
      reqToDrawings: 'Требования → Чертежи',
      reqToDrawingsDesc: 'Будь то ручные эскизы, фотографии или идеи – мы поможем вам превратить их в точные производственные чертежи.',
      drawingsToReality: 'Чертежи → Реальность',
      drawingsToRealityDesc: 'Строительство по чертежу, воспроизведение 1:1. Каждая деталь, каждый материал полностью соответствуют чертежам.',
      oemOdm: 'Услуги OEM/ODM',
      oemOdmDesc: 'Мы принимаем OEM/ODM. Ваш бренд, мы производим. Без минимальных объемов заказа.'
    },
    solutions: {
      title: 'Профессиональные решения для отображения различных категорий одежды',
      womenswear: 'Магазины высококлассных женских брендов',
      boutique: 'Магазины модных коллекций / Бутики',
      sports: 'Магазины спортивных/повседневных брендов',
      kids: 'Детские магазины/магазины быстрой моды',
      tags: {
        elegant: 'Элегантный',
        textured: 'Текстурированный',
        lightingAtmosphere: 'Атмосфера освещения',
        trendy: 'Модный',
        unique: 'Уникальный',
        curatedDisplay: 'Курируемая выставка',
        dynamic: 'Динамичный',
        functional: 'Функциональный',
        activeLifestyle: 'Активный образ жизни',
        playful: 'Игривый',
        flexible: 'Гибкий',
        quickTurnover: 'Быстрая оборачиваемость'
      }
    },
    blueprint: {
      title: 'Для любого чертежа мы стремимся к реализации 1:1',
      subtitle: 'Вы заботитесь о дизайне, мы находим все способы воплотить его в реальность.',
      customerProvided: 'Предоставлено клиентом',
      finishedProduct: 'Наш готовый продукт',
      reproduction: 'Воспроизведение 1:1',
      originalDrawing: 'Оригинальный чертеж/эскиз',
      actualProduct: 'Фактический готовый продукт',
      comparisons: [
        { description: 'Индивидуальная система розничных полок - от концепции до готового продукта' },
        { description: 'Бутик-оборудование для отображения - точное воспроизведение' },
        { description: 'Модульные вешалки для одежды - точные спецификации выполнены' }
      ]
    },
    products: {
      title: 'Наши системы отображения',
      subtitle: 'Коммерческое оборудование для профессиональных розничных сред',
      viewAll: 'Посмотреть все продукты',
      viewDetails: 'Посмотреть детали',
      getQuote: 'Запросить смету',
      learnMore: 'Узнать больше',
      items: [
        {
          name: 'Модульная система вешалок для одежды',
          description: 'Прочная стальная рама с регулируемыми полками',
          specs: 'Сталь / Настраиваемая / Грузоподъемность 200 кг'
        },
        {
          name: 'Бутик-полка для отображения',
          description: 'Элегантная комбинация дерева и металла',
          specs: 'Дерево и металл / Различные размеры / Грузоподъемность 150 кг'
        },
        {
          name: 'Розничный настенный блок отображения',
          description: 'Пространственно эффективное настенное решение для отображения',
          specs: 'Алюминий / Модульный / 100 кг на полку'
        },
        {
          name: 'Центральный островной стол для отображения',
          description: 'Универсальный центральный элемент для демонстрации продукции',
          specs: 'Смешанные материалы / Индивидуальные размеры / Грузоподъемность 300 кг'
        },
        {
          name: 'Система рельсов для одежды',
          description: 'Премиум подвесной рельс с интегрированным освещением',
          specs: 'Латунное покрытие / Готов к светодиоду / Тяжелый режим'
        },
        {
          name: 'Стена для отображения обуви',
          description: 'Ступенчатые полки, оптимизированные для розничной торговли обувью',
          specs: 'Акрил и дерево / Наклонные полки / Легкая сборка'
        }
      ]
    },
    productsPage: {
      title: 'Наши продукты',
      subtitle: 'Профессиональное коммерческое оборудование и решения для отображения для розничной торговли одеждой',
      customSolutionTitle: 'Нужно индивидуальное решение?',
      customSolutionSubtitle: 'Свяжитесь с нами, чтобы обсудить ваши конкретные требования',
      getInTouch: 'Связаться'
    },
    productDetail: {
      backToProducts: '← Вернуться к продуктам',
      description: 'Профессиональное коммерческое оборудование для розничных сред.',
      specifications: 'Спецификации:',
      material: 'Материал',
      loadCapacity: 'Грузоподъемность',
      customizableSizes: 'Доступны индивидуальные размеры',
      easyAssembly: 'Легкая сборка с прилагаемым руководством',
      requestQuote: 'Запросить смету',
      downloadSpecs: 'Скачать спецификации (PDF)',
      shirtRackDescription: 'Настраиваемый',
      bagRackDescription: 'Настраиваемый с опциями логотипа, индивидуальный дизайн стиля, цвета, материалов, структуры и размеров'
    },
    contact: {
      title: 'Свяжитесь с нами',
      subtitle: 'Готовы начать свой проект? Свяжитесь с нашей командой',
      sendMessageTitle: 'Отправьте нам сообщение',
      nameLabel: 'Имя *',
      companyLabel: 'Компания / Название магазина',
      emailLabel: 'Электронная почта *',
      phoneLabel: 'Телефон',
      storeAreaLabel: 'Площадь магазина (м²)',
      requirementTypeLabel: 'Тип требования',
      requirementTypePlaceholder: 'Выбрать...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'Мне нужны услуги OEM/ODM (частная маркировка)',
      uploadDrawingsLabel: 'Загрузить чертежи или справочные изображения',
      uploadFormats: 'Принимаемые форматы: JPG, PNG, PDF (Макс 10 МБ на файл)',
      messageLabel: 'Сообщение *',
      messagePlaceholder: 'Расскажите нам о требованиях вашего проекта...',
      sendInquiry: 'Отправить запрос',
      responseTime: 'Обычно мы отвечаем в течение 24 часов',
      successMessage: 'Спасибо! Мы ответим в течение 24 часов.',
      failMessage: 'Не удалось отправить. Пожалуйста, попробуйте еще раз.',
      contactInfoTitle: 'Контактная информация',
      email: 'Электронная почта',
      phone: 'Телефон',
      address: 'Адрес',
      connectTitle: 'Свяжитесь с нами',
      chatSystem: 'Система чата',
      businessHours: 'Часы поддержки (человеческая команда)',
      businessHoursContent: 'Понедельник–Пятница: 9:00 – 18:00 (GMT+8)<br />Суббота: 9:00 – 12:00 (GMT+8)<br />Воскресенье и праздники: Закрыто',
      aiSupport: 'Вне этих часов?',
      aiSupportContent: 'Наш ИИ-ассистент доступен <strong>24/7</strong>, чтобы ответить на общие вопросы, проверить заказы и помочь с быстрыми проблемами. Для сложных запросов мы вернемся к вам в следующий рабочий день.',
      phoneNotice: 'Уведомление о телефонной связи',
      phoneNoticeText: 'Международная телефонная связь пока недоступна. Пожалуйста, используйте электронную почту, Lark или нашу систему чата для связи с нами. Приносим извинения за неудобства.'
    },
    cases: {
      title: 'Реальные магазины · Реальные трансформации',
      subtitle: 'Реальные магазины, реальные трансформации - посмотрите, как мы помогли предприятиям добиться успеха',
      viewAll: 'Посмотреть все кейсы',
      items: [
        { name: 'Элегантный бутик Шанхай', result: 'Количество SKU дисплея +40%' },
        { name: 'Трендовый магазин коллекций Пекин', result: 'Время пребывания клиентов +35%' },
        { name: 'Флагман спортивного бренда Гуанчжоу', result: 'Конверсия продаж +25%' },
        { name: 'Детский магазин Шэньчжэнь', result: 'Использование пространства +50%' },
        { name: 'Роскошная женская одежда Ханчжоу', result: 'Восприятие бренда улучшено' },
        { name: 'Сеть быстрой моды Чэнду', result: 'Эффективность пополнения запасов +60%' }
      ]
    },
    services: {
      title: 'Наши услуги',
      subtitle: 'Комплексные решения для ваших потребностей в розничном отображении',
      customDesign: 'Углубление мастерства',
      customDesignDesc: 'Вы можете предоставить чертежи, фотографии или устные описания. Мы создаем рабочие чертежи и проверяем все детали с вами - от материалов, цветов, структур, стандартов качества, сценариев использования продукта до методов установки. После подтверждения, что все правильно, мы приступаем к углублению мастерства, отмечаем SOP для мастерства и SIP для инспекции, во время всего производства, упаковки, и предоставляем услуги удаленного руководства по установке.',
      oemOdm: 'Услуги OEM/ODM',
      oemOdmDesc: 'Ваш бренд, наш опыт производства. Без минимальных объемов заказа.',
      spacePlanning: 'Предоставление образцов',
      spacePlanningDesc: 'Мы принимаем запросы на образцы продуктов и запросы на образцы материалов (образцы материалов в основном сосредоточены на сравнении цветов и материалов).',
      installationSupport: 'Поддержка установки',
      installationSupportDesc: 'Подробные руководства по установке и удаленная поддержка для безупречной настройки.',
      processTitle: 'Наш процесс',
      steps: [
        'Принять требования',
        'Соответствие требований чертежам - подтвердить материал, цвет, структуру, сценарий использования, метод установки, упаковку, маркировку, руководство и транспортировку для каждого продукта на основе чертежей',
        'Рассчитать предполагаемую дату завершения и смету',
        'Углубление чертежей - установить маршрут обработки, производственную BOM, производственный SOP и инспекционный SIP для каждого продукта',
        'Планирование PMC - разработать план закупок и производственный план, закупать и производить в соответствии с планом',
        'Инспекция тестовой сборки и видеозапись',
        'Упаковка, маркировка, хранение, согласовать отправку с клиентом, отправить видео тестовой сборки для каждого продукта и упаковочный лист, показывающий, какие компоненты находятся в каком деревянном ящике'
      ],
      ctaTitle: 'Готовы начать?',
      ctaSubtitle: 'Свяжитесь с нами, чтобы обсудить требования вашего проекта',
      contactUs: 'Свяжитесь с нами'
    },
    caseDetail: {
      backToCases: '← Вернуться к кейсам',
      projectOverview: 'Обзор проекта',
      projectOverviewDesc: 'Это тематическое исследование демонстрирует нашу способность трансформировать розничные пространства с помощью индивидуального оборудования, которое идеально соответствует идентичности бренда и функциональным требованиям клиента.',
      challenge: 'Вызов',
      challengeDesc: 'Клиенту нужна была полная реконструкция магазина, чтобы лучше демонстрировать свои продукты и улучшить поток клиентов.',
      solution: 'Наше решение',
      solutionDesc: 'Мы спроектировали и изготовили комплексную систему отображения, которая максимизирует площадь пола, сохраняя при этом элегантную современную эстетику.',
      results: 'Результаты',
      result1: 'Видимость продукта увеличена на 40%',
      result2: 'Время пребывания клиентов улучшено',
      result3: 'Восприятие бренда улучшено',
      startProject: 'Начните свой проект'
    },
    brandStory: {
      title: 'Мы из материкового Китая.',
      paragraph1: 'Возможно, далеко от вас, но близко к вашим потребностям.',
      paragraph2: 'Независимо от размера магазина, бюджета или сложности дизайна - как только вы скажете, мы сядем и серьезно обсудим.',
      paragraph3: 'Для каждого из ваших требований мы сделаем все возможное, чтобы реализовать его с профессионализмом и искренностью.',
      quote: 'Мы не преувеличиваем, мы ничего не скрываем. Если мы можем это сделать, мы говорим. Если мы не можем, мы говорим почему.'
    },
    trust: {
      trustedBy: 'Доверяют ведущие бренды',
      testimonials: 'Что говорят наши клиенты',
      yearsExperience: 'Лет опыта',
      storesServed: 'Обслуженные магазины',
      reproductionPromise: 'Обещание воспроизведения чертежей',
      brands: [
        { name: 'Бренд A' },
        { name: 'Бренд B' },
        { name: 'Бренд C' },
        { name: 'Бренд D' },
        { name: 'Бренд E' },
        { name: 'Бренд F' }
      ],
      testimonialsList: [
        {
          quote: 'Качество превзошло наши ожидания. Оборудование идеально соответствовало нашим дизайнерским чертежам.',
          author: 'Sarah Chen',
          role: 'Владелица бутика, Шанхай'
        },
        {
          quote: 'Профессиональная команда, четкая коммуникация и своевременная доставка. Настоятельно рекомендую!',
          author: 'Michael Zhang',
          role: 'Менеджер розничной сети, Пекин'
        }
      ]
    },
    cta: {
      title: 'Готовы открыть магазин одежды? Или обновить существующий магазин?',
      subtitle: 'Нужно обновление и модернизация оборудования?',
      button: 'Получить бесплатный план консультации магазина',
      promise: 'Никаких обязательств не требуется, ответ в течение 24 часов. Мы не боимся никаких хлопот, только отсутствия возможности доказать себя.'
    },
    footer: {
      description: 'Профессиональное коммерческое оборудование и решения для отображения для розничной торговли одеждой. От чертежа к реальности - ваш надежный китайский производственный партнер.',
      quickLinks: 'Быстрые ссылки',
      contactUs: 'Свяжитесь с нами',
      newsletter: 'Рассылка',
      newsletterDesc: 'Подпишитесь, чтобы получать новейшие продукты и отраслевую информацию',
      subscribe: 'Подписаться',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Условия обслуживания',
      yourEmail: 'Ваш email',
      premiumQuality: 'Премиум качество'
    },
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      send: 'Отправить',
      sending: 'Отправка...',
      success: 'Успех',
      close: 'Закрыть'
    },
    trustBanner: {
      text: 'Из китайской индустрии магазинных дисплеев · Все требования подтверждаются через чертежи, стремимся к реализации 1:1 | Принимаем OEM/ODM, выборку продукции и выборку материалов'
    }
  },
  // Arabic translations
  ar: {
    nav: {
      solutions: 'الحلول',
      products: 'المنتجات',
      cases: 'حالات الدراسة',
      resources: 'الموارد',
      about: 'من نحن',
      contact: 'اتصل بنا',
      consultation: 'استشارة مجانية'
    },
    hero: {
      title: 'تصنيع الأثاث التجاري.',
      subtitle: 'أنت تقدم المتطلبات، نتحقق معًا من تفاصيل الرسم، أعمق الحرفية وأنتج وفقًا لمعايير الرسم.',
      trustStatement: 'قبول المتطلبات → التحقق من الرسومات → رد سريع مع تاريخ الانتهاء المقدر والعرض → جميع العمليات تتبع SOP/SIP للإنتاج والفحص → التعبئة تتبع قائمة BOM بدقة',
      exploreSolutions: 'استكشف الحلول',
      contactExpert: 'تواصل مع الخبير'
    },
    capabilities: {
      title: 'ماذا يمكننا أن نفعل؟',
      reqToDrawings: 'المتطلبات → الرسومات',
      reqToDrawingsDesc: 'سواء كانت رسومات يدوية أو صورًا أو أفكارًا – نساعدك في تحويلها إلى رسومات إنتاج دقيقة.',
      drawingsToReality: 'الرسومات → الواقع',
      drawingsToRealityDesc: 'البناء حسب الرسم، إعادة إنتاج 1:1. كل تفصيل، كل مادة، متسقة تمامًا مع الرسومات.',
      oemOdm: 'خدمات OEM/ODM',
      oemOdmDesc: 'نقبل OEM/ODM. علامتك التجارية، نحن نصنع. بدون حد أدنى لكميات الطلب.'
    },
    solutions: {
      title: 'حلول عرض احترافية لفئات الملابس المختلفة',
      womenswear: 'متاجر العلامات التجارية النسائية الراقية',
      boutique: 'متاجر مجموعات الموضة / البوتيكات',
      sports: 'متاجر العلامات التجارية الرياضية/الكاجوال',
      kids: 'متاجر الأطفال/الأزياء السريعة',
      tags: {
        elegant: 'أنيق',
        textured: 'ملمس',
        lightingAtmosphere: 'أجواء الإضاءة',
        trendy: 'عصري',
        unique: 'فريد',
        curatedDisplay: 'عرض منسق',
        dynamic: 'ديناميكي',
        functional: 'وظيفي',
        activeLifestyle: 'نمط حياة نشط',
        playful: 'مرح',
        flexible: 'مرن',
        quickTurnover: 'دوران سريع'
      }
    },
    blueprint: {
      title: 'لأي رسم، نسعى لتحقيق تنفيذ 1:1',
      subtitle: 'أنت تهتم بالتصميم، نجد جميع الطرق لتحويله إلى واقع.',
      customerProvided: 'مقدم من العميل',
      finishedProduct: 'منتجنا النهائي',
      reproduction: 'إعادة إنتاج 1:1',
      originalDrawing: 'الرسم/المسودة الأصلية',
      actualProduct: 'المنتج النهائي الفعلي',
      comparisons: [
        { description: 'نظام رفوف التجزئة المخصص - من المفهوم إلى المنتج النهائي' },
        { description: 'معدات عرض البوتيك - إعادة إنتاج دقيقة' },
        { description: 'علاقات الملابس المعيارية - مواصفات دقيقة محققة' }
      ]
    },
    products: {
      title: 'أنظمة العرض لدينا',
      subtitle: 'معدات تجارية لبيئات التجزئة الاحترافية',
      viewAll: 'عرض جميع المنتجات',
      viewDetails: 'عرض التفاصيل',
      getQuote: 'طلب عرض سعر',
      learnMore: 'اعرف المزيد',
      items: [
        {
          name: 'نظام علاقات الملابس المعياري',
          description: 'إطار فولاذي متين مع رفوف قابلة للتعديل',
          specs: 'فولاذ / قابل للتخصيص / سعة تحميل 200 كجم'
        },
        {
          name: 'رف عرض البوتيك',
          description: 'مزيج أنيق من الخشب والمعدن',
          specs: 'خشب ومعدن / أحجام مختلفة / سعة تحميل 150 كجم'
        },
        {
          name: 'وحدة عرض الحائط للبيع بالتجزئة',
          description: 'حل عرض مثبت على الحائط فعال من حيث المساحة',
          specs: 'ألومنيوم / معياري / 100 كجم لكل رف'
        },
        {
          name: 'طاولة عرض الجزيرة المركزية',
          description: 'قطعة مركزية متعددة الاستخدامات لعرض المنتجات',
          specs: 'مواد مختلطة / أحجام مخصصة / سعة تحميل 300 كجم'
        },
        {
          name: 'نظام سكة الملابس',
          description: 'سكة تعليق متميزة مع إضاءة مدمجة',
          specs: 'تشطيب نحاسي / جاهز LED / للاستخدام الشاق'
        },
        {
          name: 'جدار عرض الأحذية',
          description: 'رفوف متدرجة محسنة لتجارة التجزئة للأحذية',
          specs: 'أكريليك وخشب / رفوف مائلة / تجميع سهل'
        }
      ]
    },
    productsPage: {
      title: 'منتجاتنا',
      subtitle: 'معدات تجارية احترافية وحلول عرض لتجارة التجزئة للملابس',
      customSolutionTitle: 'هل تحتاج إلى حل مخصص؟',
      customSolutionSubtitle: 'اتصل بنا لمناقشة متطلباتك المحددة',
      getInTouch: 'تواصل معنا'
    },
    productDetail: {
      backToProducts: '← العودة إلى المنتجات',
      description: 'معدات تجارية احترافية لبيئات التجزئة.',
      specifications: 'المواصفات:',
      material: 'المادة',
      loadCapacity: 'سعة التحميل',
      customizableSizes: 'أحجام قابلة للتخصيص متاحة',
      easyAssembly: 'تجميع سهل مع دليل مرفق',
      requestQuote: 'طلب عرض سعر',
      downloadSpecs: 'تنزيل المواصفات (PDF)',
      shirtRackDescription: 'قابل للتخصيص',
      bagRackDescription: 'قابل للتخصيص مع خيارات الشعار، تصميم مخصص للأسلوب واللون والمواد والهيكل والأبعاد'
    },
    contact: {
      title: 'اتصل بنا',
      subtitle: 'هل أنت مستعد لبدء مشروعك؟ تواصل مع فريقنا',
      sendMessageTitle: 'أرسل لنا رسالة',
      nameLabel: 'الاسم *',
      companyLabel: 'الشركة / اسم المتجر',
      emailLabel: 'البريد الإلكتروني *',
      phoneLabel: 'الهاتف',
      storeAreaLabel: 'مساحة المتجر (م²)',
      requirementTypeLabel: 'نوع المتطلب',
      requirementTypePlaceholder: 'اختر...',
      // newStore removed - using requirementTypes object
      // renovation removed - using requirementTypes object
      // expansion removed - using requirementTypes object
      // replacement removed - using requirementTypes object
      needOEMLabel: 'أحتاج إلى خدمات OEM/ODM (وضع العلامات الخاصة)',
      uploadDrawingsLabel: 'تحميل الرسومات أو الصور المرجعية',
      uploadFormats: 'التنسيقات المقبولة: JPG, PNG, PDF (حد أقصى 10 ميجابايت لكل ملف)',
      messageLabel: 'الرسالة *',
      messagePlaceholder: 'أخبرنا عن متطلبات مشروعك...',
      sendInquiry: 'إرسال الاستفسار',
      responseTime: 'نرد عادةً خلال 24 ساعة',
      successMessage: 'شكرًا لك! سنرد خلال 24 ساعة.',
      failMessage: 'فشل الإرسال. يرجى المحاولة مرة أخرى.',
      contactInfoTitle: 'معلومات الاتصال',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      connectTitle: 'تواصل معنا',
      chatSystem: 'نظام الدردشة',
      businessHours: 'ساعات الدعم (فريق بشري)',
      businessHoursContent: 'الاثنين–الجمعة: 9:00 ص – 6:00 م (GMT+8)<br />السبت: 9:00 ص – 12:00 م (GMT+8)<br />الأحد والعطلات: مغلق',
      aiSupport: 'خارج هذه الساعات؟',
      aiSupportContent: 'مساعد الذكاء الاصطناعي الخاص بنا متاح <strong>على مدار الساعة طوال أيام الأسبوع</strong> للإجابة على الأسئلة الشائعة والتحقق من الطلبات والمساعدة في المشكلات السريعة.对于复杂的请求，我们将在下一个工作日回复。',
      phoneNotice: 'إشعار خدمة الهاتف',
      phoneNoticeText: 'خدمة الهاتف الدولية غير متوفرة بعد. يرجى استخدام البريد الإلكتروني أو Lark أو نظام الدردشة للتواصل معنا. نعتذر عن أي إزعاج.'
    },
    cases: {
      title: 'متاجر حقيقية · تحولات حقيقية',
      subtitle: 'متاجر حقيقية، تحولات حقيقية - شاهد كيف ساعدنا الشركات على النجاح',
      viewAll: 'عرض جميع الحالات',
      items: [
        { name: 'بوتيك أنيق شنغهاي', result: 'عدد SKU للعرض +40%' },
        { name: 'متجر مجموعة عصرية بكين', result: 'وقت بقاء العملاء +35%' },
        { name: 'متجر رئيسي للعلامة الرياضية قوانغتشو', result: 'تحويل المبيعات +25%' },
        { name: 'متجر أطفال شنتشن', result: 'استخدام المساحة +50%' },
        { name: 'أزياء نسائية فاخرة هانغتشو', result: 'تحسين تصور العلامة التجارية' },
        { name: 'سلسلة أزياء سريعة تشنغدو', result: 'كفاءة إعادة التزويد +60%' }
      ]
    },
    services: {
      title: 'خدماتنا',
      subtitle: 'حلول شاملة لاحتياجات عرض التجزئة الخاصة بك',
      customDesign: 'تعميق الحرفية',
      customDesignDesc: 'يمكنك تقديم رسومات أو صور أو أوصاف شفوية. ننشئ رسومات حرفية ونتحقق من جميع التفاصيل معك - من المواد والألوان والهياكل ومعايير الجودة وسيناريوهات استخدام المنتج وطرق التركيب. بعد التأكد من صحة كل شيء، نواصل تعميق الحرفية، ونضع علامة SOP للحرفية وSIP للفحص، أثناء الإنتاج والتعبئة بالكامل، ونقدم خدمات دليل التركيب عن بُعد.',
      oemOdm: 'خدمات OEM/ODM',
      oemOdmDesc: 'علامتك التجارية، خبرتنا في التصنيع. بدون حدود دنيا لكميات الطلب.',
      spacePlanning: 'توفير العينات',
      spacePlanningDesc: 'نقبل طلبات عينات المنتجات وطلبات عينات المواد (تركز عينات المواد بشكل أساسي على مقارنة الألوان والمواد).',
      installationSupport: 'دعم التركيب',
      installationSupportDesc: 'أدلة تركيب مفصلة ودعم عن بُعد لإعداد سلس.',
      processTitle: 'عمليتنا',
      steps: [
        'قبول المتطلبات',
        'مطابقة المتطلبات مع الرسومات - تأكيد المادة واللون والهيكل وسيناريو الاستخدام وطريقة التركيب والتغليف ووضع العلامات والدليل والنقل لكل منتج بناءً على الرسومات',
        'حساب تاريخ الانتهاء المقدر والعرض',
        'تعميق الرسومات - إنشاء مسار المعالجة وBOM التصنيع وSOP الإنتاج وSIP الفحص لكل منتج',
        'تخطيط PMC - وضع خطة الشراء وخطة الإنتاج والشراء والإنتاج وفقًا للخطة',
        'فحص التجميع التجريبي وتسجيل الفيديو',
        'التغليف ووضع العلامات والتخزين وجدولة الشحن مع العميل وإرسال مقاطع فيديو التجميع التجريبي لكل منتج وقائمة التعبئة التي توضح المكونات الموجودة في كل صندوق خشبي'
      ],
      ctaTitle: 'هل أنت مستعد للبدء؟',
      ctaSubtitle: 'اتصل بنا لمناقشة متطلبات مشروعك',
      contactUs: 'اتصل بنا'
    },
    caseDetail: {
      backToCases: '← العودة إلى الحالات',
      projectOverview: 'نظرة عامة على المشروع',
      projectOverviewDesc: 'توضح دراسة الحالة هذه قدرتنا على تحويل مساحات التجزئة بمعدات مخصصة تناسب تمامًا هوية العلامة التجارية والمتطلبات الوظيفية للعميل.',
      challenge: 'التحدي',
      challengeDesc: 'كان العميل بحاجة إلى تجديد كامل للمتجر لعرض منتجاته بشكل أفضل وتحسين تدفق العملاء.',
      solution: 'حلنا',
      solutionDesc: 'صممنا وصنعنا نظام عرض شامل يزيد من مساحة الأرضية مع الحفاظ على جماليات أنيقة وعصرية.',
      results: 'النتائج',
      result1: 'زيادة رؤية المنتج بنسبة 40%',
      result2: 'تحسين وقت بقاء العملاء',
      result3: 'تحسين تصور العلامة التجارية',
      startProject: 'ابدأ مشروعك'
    },
    brandStory: {
      title: 'نحن من البر الرئيسي للصين.',
      paragraph1: 'ربما بعيدًا عنك، لكن قريبًا من احتياجاتك.',
      paragraph2: 'بغض النظر عن حجم المتجر أو الميزانية أو تعقيد التصميم - بمجرد أن تتحدث، نجلس ونناقش بجدية.',
      paragraph3: 'لكل متطلب من متطلباتك، سنبذل قصارى جهدنا لتحقيقه باحترافية وإخلاص.',
      quote: 'لا نبالغ، لا نخفي شيئًا. إذا استطعنا القيام بذلك، نقول ذلك. إذا لم نستطع، نخبرك بالسبب.'
    },
    trust: {
      trustedBy: 'موثوق به من قبل العلامات التجارية الرائدة',
      testimonials: 'ماذا يقول عملاؤنا',
      yearsExperience: 'سنوات من الخبرة',
      storesServed: 'المتاجر المخدومة',
      reproductionPromise: 'وعد إعادة إنتاج الرسومات',
      brands: [
        { name: 'العلامة A' },
        { name: 'العلامة B' },
        { name: 'العلامة C' },
        { name: 'العلامة D' },
        { name: 'العلامة E' },
        { name: 'العلامة F' }
      ],
      testimonialsList: [
        {
          quote: 'تجاوزت الجودة توقعاتنا. تطابقت المعدات تمامًا مع رسومات التصميم الخاصة بنا.',
          author: 'سارة تشين',
          role: 'مالكة بوتيك، شنغهاي'
        },
        {
          quote: 'فريق محترف، تواصل واضح وتسليم في الوقت المحدد. موصى به بشدة!',
          author: 'مايكل تشانغ',
          role: 'مدير سلسلة تجزئة، بكين'
        }
      ]
    },
    cta: {
      title: 'هل أنت مستعد لفتح متجر ملابس؟ أو تحديث متجرك الحالي؟',
      subtitle: 'هل تحتاج إلى تحديثات وتحديث للمعدات؟',
      button: 'احصل على خطة استشارة متجر مجانية',
      promise: 'لا يلزم وجود التزام، رد خلال 24 ساعة. لا نخشى أي إزعاج، فقط عدم الحصول على فرصة لإثبات أنفسنا.'
    },
    footer: {
      description: 'معدات تجارية احترافية وحلول عرض لتجارة التجزئة للملابس. من الرسم إلى الواقع - شريك التصنيع الصيني الموثوق به.',
      quickLinks: 'روابط سريعة',
      contactUs: 'اتصل بنا',
      newsletter: 'النشرة الإخبارية',
      newsletterDesc: 'اشترك للحصول على أحدث المنتجات ورؤى الصناعة',
      subscribe: 'اشترك',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
      yourEmail: 'بريدك الإلكتروني',
      premiumQuality: 'جودة متميزة'
    },
    common: {
      loading: 'جارٍ التحميل...',
      error: 'خطأ',
      send: 'إرسال',
      sending: 'جارٍ الإرسال...',
      success: 'نجاح',
      close: 'إغلاق'
    },
    trustBanner: {
      text: 'من صناعة عروض المتاجر الصينية · يتم تأكيد جميع المتطلبات من خلال الرسومات، نسعى لتحقيق التنفيذ 1:1 | نقبل OEM/ODM، أخذ عينات المنتجات وأخذ عينات المواد'
    }
  }
}

// Fill empty or incomplete language objects with English fallback
const englishFallback = translations.en
const incompleteLanguages: Language[] = []

incompleteLanguages.forEach(lang => {
  const langTranslations = translations[lang]
  
  // Check if language has all required sections
  const hasAllSections = 
    langTranslations &&
    langTranslations.nav &&
    langTranslations.hero &&
    langTranslations.contact &&
    langTranslations.products &&
    langTranslations.cases &&
    langTranslations.services &&
    langTranslations.brandStory &&
    langTranslations.trust &&
    langTranslations.cta &&
    langTranslations.footer &&
    langTranslations.common
  
  if (!hasAllSections) {
    console.log(`[i18n] ${lang} is incomplete, using English fallback`)
    translations[lang] = englishFallback
  }
})
