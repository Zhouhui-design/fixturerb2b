import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Award, Clock, Globe, Shield } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import SchemaMarkup from '../components/SchemaMarkup'

const ProductsPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Product categories with detailed information
  const categories = [
    {
      id: 1,
      title: 'Retail Display Systems',
      subtitle: 'Commercial-Grade Store Fixtures',
      description: 'Modular display solutions for apparel retail environments. Customizable sizes, colors, and configurations.',
      image: '/products/display-systems.jpg',
      features: [
        'Modular design for flexibility',
        'Commercial-grade materials',
        'Easy assembly & maintenance',
        'Custom branding options'
      ],
      specs: {
        material: 'Steel, Wood, Acrylic',
        loadCapacity: '50-200 kg per unit',
        finish: 'Powder coating, Veneer',
        customization: 'Size, Color, Logo'
      },
      applications: ['Clothing Stores', 'Boutiques', 'Department Stores', 'Showrooms'],
      certifications: ['ISO 9001', 'CE Certified', 'Export Quality']
    },
    {
      id: 2,
      title: 'Wall Display Solutions',
      subtitle: 'Vertical Space Optimization',
      description: 'Maximize wall space with our professional wall-mounted display systems. Perfect for showcasing products efficiently.',
      image: '/products/wall-displays.jpg',
      features: [
        'Space-saving vertical design',
        'Adjustable shelving',
        'Integrated lighting options',
        'Quick installation system'
      ],
      specs: {
        material: 'Aluminum, MDF, Glass',
        dimensions: 'Custom sizes available',
        mounting: 'Wall-mounted, Freestanding',
        weight: 'Lightweight yet durable'
      },
      applications: ['Fashion Retail', 'Electronics Stores', 'Cosmetic Shops', 'Accessory Displays'],
      certifications: ['ISO 9001', 'Fire Resistant Materials']
    },
    {
      id: 3,
      title: 'Floor Standing Units',
      subtitle: 'Freestanding Display Fixtures',
      description: 'Versatile floor-standing displays that create impactful product presentations in any retail space.',
      image: '/products/floor-units.jpg',
      features: [
        'Stable freestanding structure',
        'Multiple tier options',
        'Mobile or fixed base',
        'Premium finish quality'
      ],
      specs: {
        material: 'Steel Frame, Wood Panels',
        height: '1.2m - 2.4m customizable',
        tiers: '2-6 levels',
        mobility: 'With/without wheels'
      },
      applications: ['Supermarkets', 'Chain Stores', 'Pop-up Shops', 'Trade Shows'],
      certifications: ['ISO 9001', 'Structural Safety Tested']
    }
  ]

  // Industry solutions
  const solutions = [
    {
      industry: 'Fashion & Apparel',
      description: 'Complete store fixture solutions for clothing retailers, from boutiques to department stores.',
      icon: '👗',
      clients: ['Boutiques', 'Chain Stores', 'Department Stores']
    },
    {
      industry: 'Electronics & Tech',
      description: 'Modern display systems designed to showcase technology products with style and security.',
      icon: '📱',
      clients: ['Phone Stores', 'Computer Shops', 'Gadget Retailers']
    },
    {
      industry: 'Cosmetics & Beauty',
      description: 'Elegant display solutions that enhance product appeal and drive sales in beauty retail.',
      icon: '💄',
      clients: ['Beauty Stores', 'Perfume Shops', 'Spa Retail']
    },
    {
      industry: 'Sports & Outdoor',
      description: 'Durable fixtures built to handle sports equipment and outdoor gear displays.',
      icon: '⚽',
      clients: ['Sports Stores', 'Outdoor Gear', 'Fitness Centers']
    }
  ]

  // FAQ data
  const faqData = {
    questions: [
      {
        question: "What is your minimum order quantity (MOQ)?",
        answer: "Our standard MOQ is 50 units per design, but we can accommodate smaller quantities for sample orders or trial projects. Contact us to discuss your specific needs."
      },
      {
        question: "Do you offer OEM/ODM customization services?",
        answer: "Yes! We provide full OEM/ODM services including custom dimensions, colors, materials, and branding. Send us your drawings or requirements, and we'll create a tailored solution."
      },
      {
        question: "What is the typical production lead time?",
        answer: "Standard production time is 30-45 days after order confirmation and deposit. Rush orders can be accommodated with additional fees. We'll provide a detailed timeline during quotation."
      },
      {
        question: "What quality certifications do your products have?",
        answer: "Our manufacturing partners hold ISO 9001 certification, and products meet CE standards. We conduct strict quality control at every production stage and provide inspection reports."
      },
      {
        question: "Can you help with store layout design?",
        answer: "Absolutely! We offer free consultation and can provide 3D layout designs based on your store dimensions and requirements. Our team has experience with various retail formats."
      },
      {
        question: "What are your payment terms?",
        answer: "We accept T/T (30% deposit, 70% before shipment), L/C at sight for large orders, and PayPal for sample orders. Flexible terms available for long-term partners."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we export worldwide. We can arrange shipping via FOB, CIF, or DDP terms. Our logistics team will handle all documentation and customs clearance support."
      },
      {
        question: "How do you ensure product quality?",
        answer: "We implement a 5-stage quality control process: material inspection, production monitoring, pre-assembly check, final inspection, and packaging verification. Photos/videos provided before shipment."
      }
    ]
  }

  return (
    <div className="min-h-screen">
      {/* Schema Markup */}
      <SchemaMarkup type="breadcrumb" data={{
        items: [
          { name: 'Home', url: 'https://fixturerb2b.top/' },
          { name: 'Products', url: 'https://fixturerb2b.top/products' }
        ]
      }} />

      {/* Hero Section with Value Proposition */}
      <div className="bg-gradient-to-br from-charcoal via-charcoal-light to-stone-800 text-white py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Commercial-Grade Store Fixtures
              <span className="block text-wood mt-2">From Blueprint to Reality</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Professional B2B display solutions for retail environments. 
              Custom OEM/ODM manufacturing with 1:1 reproduction accuracy. 
              Trusted by 500+ stores across 50+ countries.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">ISO 9001 Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">CE Approved</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Global Shipping</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="btn-shine bg-wood hover:bg-wood-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Request Custom Quote
              </button>
              <button
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-white/10"
              >
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us - Value Proposition */}
      <section className="py-16 bg-stone-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Why Partner With FixtureRB2B?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're not just suppliers – we're your strategic partner in creating exceptional retail experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-12 h-12 text-wood" />,
                title: 'Quality Assurance',
                desc: '5-stage QC process with detailed inspection reports before shipment'
              },
              {
                icon: <Clock className="w-12 h-12 text-wood" />,
                title: 'On-Time Delivery',
                desc: '98% on-time delivery rate with transparent production tracking'
              },
              {
                icon: <Award className="w-12 h-12 text-wood" />,
                title: 'Custom Solutions',
                desc: 'Full OEM/ODM services with 3D design support and prototyping'
              },
              {
                icon: <Globe className="w-12 h-12 text-wood" />,
                title: 'Global Experience',
                desc: 'Serving 500+ clients in 50+ countries with local compliance knowledge'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories - Detailed */}
      <section id="categories" className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Our Product Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive range of commercial-grade display solutions for every retail environment
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category, index) => (
              <div key={category.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Image */}
                <div className="relative group">
                  <div className="aspect-video bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl overflow-hidden shadow-lg">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      [Product Image Placeholder]
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-wood text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                    View Details →
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-3xl font-bold text-charcoal mb-2">{category.title}</h3>
                  <p className="text-wood font-semibold mb-4">{category.subtitle}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-bold text-charcoal mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {category.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div className="bg-stone-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-charcoal mb-3">Technical Specifications:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(category.specs).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="ml-2 text-charcoal font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="mb-6">
                    <h4 className="font-bold text-charcoal mb-2">Ideal For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.applications.map((app, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm text-gray-600">Certifications:</span>
                    <div className="flex gap-2">
                      {category.certifications.map((cert, idx) => (
                        <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-semibold">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/products/${category.id}`)}
                    className="inline-flex items-center gap-2 bg-wood hover:bg-wood-light text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    View Product Details
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 bg-charcoal text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industry Solutions
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Tailored display solutions for specific retail sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold mb-3">{solution.industry}</h3>
                <p className="text-white/80 text-sm mb-4">{solution.description}</p>
                <div>
                  <p className="text-xs text-white/60 mb-2">Serving:</p>
                  <div className="flex flex-wrap gap-1">
                    {solution.clients.map((client, cidx) => (
                      <span key={cidx} className="text-xs bg-white/20 px-2 py-1 rounded">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing & Quality */}
      <section className="py-20 bg-stone-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
                Our Manufacturing Excellence
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We partner with ISO 9001 certified manufacturers who share our commitment to quality and precision. 
                Our production network includes facilities with 10+ years of experience serving international brands.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Advanced CNC machining centers for precision cutting',
                  'Automated powder coating lines for consistent finish',
                  'In-house quality testing laboratory',
                  'Experienced engineering team for custom solutions',
                  'Lean manufacturing principles for efficiency'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/about')}
                className="bg-wood hover:bg-wood-light text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Learn About Our Partners
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Quality Control Process</h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Material Inspection', desc: 'All raw materials tested before production' },
                  { step: '02', title: 'Production Monitoring', desc: 'Real-time quality checks during manufacturing' },
                  { step: '03', title: 'Pre-Assembly Check', desc: 'Component verification before assembly' },
                  { step: '04', title: 'Final Inspection', desc: 'Comprehensive product testing and measurement' },
                  { step: '05', title: 'Packaging Verification', desc: 'Secure packaging with protection for transit' }
                ].map((qc, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-stone-50 rounded-lg">
                    <div className="text-2xl font-bold text-wood">{qc.step}</div>
                    <div>
                      <h4 className="font-bold text-charcoal">{qc.title}</h4>
                      <p className="text-sm text-gray-600">{qc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our products and services
            </p>
          </div>

          <SchemaMarkup type="faq" data={faqData} />

          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.questions.map((faq, idx) => (
              <details key={idx} className="group bg-white border border-gray-200 rounded-lg open:shadow-md transition-all">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-charcoal hover:text-wood transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-wood to-wood-light text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get a customized quote for your retail display needs. 
            Our team will respond within 24 hours with detailed pricing and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-wood hover:bg-stone-100 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg"
            >
              Request Free Quote
            </button>
            <button
              onClick={() => navigate('/cases')}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              View Case Studies
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductsPage
