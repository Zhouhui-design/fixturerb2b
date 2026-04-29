import { Shield, Award, Globe, Lock, CheckCircle, Star, Users, TrendingUp } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const TrustIndicators = () => {
  const { t } = useLanguage()

  const certifications = [
    { icon: Shield, title: 'ISO 9001 Certified', desc: 'Quality Management' },
    { icon: Award, title: 'CE Certified', desc: 'European Standards' },
    { icon: Globe, title: 'Export License', desc: 'Global Trade Approved' },
    { icon: Lock, title: 'SSL Secured', desc: '256-bit Encryption' }
  ]

  const stats = [
    { icon: Users, value: '500+', label: t.trustIndicators?.happyClients || 'Happy Clients', color: 'text-blue-600' },
    { icon: Globe, value: '50+', label: t.trustIndicators?.countriesServed || 'Countries Served', color: 'text-green-600' },
    { icon: TrendingUp, value: '10K+', label: t.trustIndicators?.productsDelivered || 'Products Delivered', color: 'text-purple-600' },
    { icon: Star, value: '4.9/5', label: t.trustIndicators?.customerRating || 'Customer Rating', color: 'text-yellow-600' }
  ]

  const guarantees = [
    {
      title: 'Trade Assurance',
      desc: 'Your payment is protected until you confirm delivery',
      icon: Shield
    },
    {
      title: 'Quality Guarantee',
      desc: '100% quality inspection before shipment',
      icon: CheckCircle
    },
    {
      title: 'On-time Delivery',
      desc: 'Compensation for late delivery',
      icon: Globe
    },
    {
      title: 'Secure Payment',
      desc: 'Multiple secure payment methods available',
      icon: Lock
    }
  ]

  const testimonials = [
    {
      name: 'John Smith',
      company: 'ABC Furniture Inc.',
      country: 'United States',
      rating: 5,
      text: 'Excellent quality and professional service. The contract was clear and payment process was smooth. Highly recommended!',
      avatar: 'JS'
    },
    {
      name: 'Maria Garcia',
      company: 'Euro Design Ltd.',
      country: 'Spain',
      rating: 5,
      text: 'Very trustworthy supplier. They provided all necessary certificates and the product quality exceeded our expectations.',
      avatar: 'MG'
    },
    {
      name: 'Ahmed Hassan',
      company: 'Middle East Trading',
      country: 'UAE',
      rating: 5,
      text: 'Great communication throughout the process. The formal contract gave us confidence to proceed with a large order.',
      avatar: 'AH'
    }
  ]

  return (
    <div className="space-y-16 py-12">
      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.trustIndicators?.certificationsTitle || 'Certifications & Compliance'}</h2>
            <p className="text-gray-600">{t.trustIndicators?.certificationsSubtitle || 'Internationally recognized quality standards'}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white border-2 border-gray-100 rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
                <cert.icon className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Guarantees</h2>
            <p className="text-gray-600">Your satisfaction and security are our priorities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <guarantee.icon className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{guarantee.title}</h3>
                <p className="text-sm text-gray-600">{guarantee.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Clients Say</h2>
            <p className="text-gray-600">Trusted by businesses worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.company}</p>
                    <p className="text-xs text-gray-500">{testimonial.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment Options</h2>
            <p className="text-gray-600">Multiple trusted payment methods for your convenience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-2">T/T</div>
              <p className="text-sm text-gray-600">Bank Transfer</p>
              <p className="text-xs text-gray-500 mt-1">Safe & Direct</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-800 mb-2">L/C</div>
              <p className="text-sm text-gray-600">Letter of Credit</p>
              <p className="text-xs text-gray-500 mt-1">Bank Guaranteed</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-500 mb-2">PayPal</div>
              <p className="text-sm text-gray-600">PayPal</p>
              <p className="text-xs text-gray-500 mt-1">Buyer Protection</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600 mb-2">W/U</div>
              <p className="text-sm text-gray-600">Western Union</p>
              <p className="text-xs text-gray-500 mt-1">Fast Transfer</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">All transactions are SSL encrypted and secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Process */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Simple & Transparent Process</h2>
            <p className="text-gray-600">From inquiry to delivery, we make it easy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Request Quote', desc: 'Submit your requirements', icon: '📋' },
              { step: '2', title: 'Receive Contract', desc: 'Get detailed quotation & contract', icon: '📄' },
              { step: '3', title: 'Sign & Pay', desc: 'E-sign contract & arrange payment', icon: '✍️' },
              { step: '4', title: 'Track Order', desc: 'Monitor production & shipping', icon: '🚢' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-primary/20 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="text-primary text-2xl">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrustIndicators
