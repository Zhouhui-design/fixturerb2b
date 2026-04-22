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
    newStore: string
    renovation: string
    expansion: string
    replacement: string
    needOEMLabel: string
    uploadDrawingsLabel: string
    uploadFormats: string
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
    connectTitle: string
    chatSystem: string
    businessHours: string
    businessHoursContent: string
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
      subtitle: 'Commercial-grade fixtures for professional retail environments',
      viewAll: 'View All Products',
      viewDetails: 'View Details',
      getQuote: 'Get Quote',
      learnMore: 'Learn More',
      items: [
        {
          name: 'Modular Clothing Rack System',
          description: 'Heavy-duty steel frame with adjustable shelves',
          specs: 'Steel / Customizable / 200kg capacity'
        },
        {
          name: 'Boutique Display Shelving',
          description: 'Elegant wood and metal combination shelving',
          specs: 'Wood & Metal / Various sizes / 150kg capacity'
        },
        {
          name: 'Retail Wall Display Unit',
          description: 'Space-efficient wall-mounted display solution',
          specs: 'Aluminum / Modular / 100kg per shelf'
        },
        {
          name: 'Central Island Display Table',
          description: 'Versatile centerpiece for product showcasing',
          specs: 'Mixed materials / Custom sizes / 300kg capacity'
        },
        {
          name: 'Garment Rail System',
          description: 'Premium hanging rail with integrated lighting',
          specs: 'Brass finish / LED ready / Heavy-duty'
        },
        {
          name: 'Shoe Display Wall',
          description: 'Tiered shelving optimized for footwear retail',
          specs: 'Acrylic & Wood / Angled shelves / Easy assembly'
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
    productDetail: {
      backToProducts: '← Back to Products',
      description: 'Professional commercial-grade fixture for retail environments.',
      specifications: 'Specifications:',
      material: 'Material',
      loadCapacity: 'Load Capacity',
      customizableSizes: 'Customizable sizes available',
      easyAssembly: 'Easy assembly with included instructions',
      requestQuote: 'Request Quote',
      downloadSpecs: 'Download Specifications (PDF)'
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
      requirementTypePlaceholder: 'Select...',
      newStore: 'New Store',
      renovation: 'Store Renovation',
      expansion: 'Store Expansion',
      replacement: 'Fixture Replacement',
      needOEMLabel: 'I need OEM/ODM services (private labeling)',
      uploadDrawingsLabel: 'Upload Drawings or Reference Images',
      uploadFormats: 'Accepted formats: JPG, PNG, PDF (Max 10MB per file)',
      messageLabel: 'Message *',
      messagePlaceholder: 'Tell us about your project requirements...',
      sendInquiry: 'Send Inquiry',
      responseTime: 'We typically respond within 24 hours',
      successMessage: 'Thank you! We will reply within 24 hours.',
      failMessage: 'Failed to send. Please try again.',
      contactInfoTitle: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      connectTitle: 'Connect With Us',
      chatSystem: 'Chat System',
      businessHours: 'Business Hours',
      businessHoursContent: 'Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)<br />Saturday: 9:00 AM - 12:00 PM (GMT+8)<br />Sunday: Closed'
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
          name: '模块化服装架系统',
          description: '重型钢框架，可调节层板',
          specs: '钢材 / 可定制 / 200kg承重'
        },
        {
          name: '精品店展示架',
          description: '优雅的木材与金属组合货架',
          specs: '木与金属 / 多种尺寸 / 150kg承重'
        },
        {
          name: '零售墙式展示单元',
          description: '节省空间的壁挂式展示方案',
          specs: '铝合金 / 模块化 / 每层100kg'
        },
        {
          name: '中央岛式展示台',
          description: '多功能产品展示中心桌',
          specs: '混合材料 / 定制尺寸 / 300kg承重'
        },
        {
          name: '服装轨道系统',
          description: '带集成照明的高级悬挂轨道',
          specs: '黄铜饰面 / LED就绪 / 重型'
        },
        {
          name: '鞋类展示墙',
          description: '为鞋类零售优化的分层货架',
          specs: '亚克力与木材 / 倾斜层板 / 易组装'
        }
      ]
    },
    productsPage: {
      title: '我们的产品',
      subtitle: '专业的服装零售店铺陈列解决方案',
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
      downloadSpecs: '下载规格书 (PDF)'
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
      requirementTypePlaceholder: '请选择...',
      newStore: '新店开业',
      renovation: '店铺翻新',
      expansion: '店铺扩张',
      replacement: '陈列设备更换',
      needOEMLabel: '我需要OEM/ODM服务（贴牌代工）',
      uploadDrawingsLabel: '上传图纸或参考图片',
      uploadFormats: '接受格式：JPG, PNG, PDF（每个文件最大10MB）',
      messageLabel: '留言 *',
      messagePlaceholder: '告诉我们您的项目需求...',
      sendInquiry: '发送询盘',
      responseTime: '我们通常在24小时内回复',
      successMessage: '谢谢！我们将在24小时内回复。',
      failMessage: '发送失败，请重试。',
      contactInfoTitle: '联系信息',
      email: '邮箱',
      phone: '电话',
      address: '地址',
      connectTitle: '与我们联系',
      chatSystem: '在线聊天系统',
      businessHours: '营业时间',
      businessHoursContent: '周一至周五：上午9:00 - 下午6:00（GMT+8）<br />周六：上午9:00 - 中午12:00（GMT+8）<br />周日：休息'
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
      downloadSpecs: '仕様書ダウンロード (PDF)'
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
    common: { loading: '読み込み中...', error: 'エラー', send: '送信', sending: '送信中...', success: '成功', close: '閉じる' }
  } as Translations, // Incomplete - will use English fallback
  // Spanish translations (incomplete - will use English fallback)
  es: {} as Translations,
  // Arabic translations (incomplete - will use English fallback)
  ar: {} as Translations,
  // French, German, Korean, Portuguese, Russian use English fallback for now
  fr: {} as Translations,
  de: {} as Translations,
  ko: {} as Translations,
  pt: {} as Translations,
  ru: {} as Translations
}

// Fill empty or incomplete language objects with English fallback
const englishFallback = translations.en
const incompleteLanguages: Language[] = ['fr', 'de', 'ko', 'pt', 'ru', 'ja', 'es', 'ar']

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
