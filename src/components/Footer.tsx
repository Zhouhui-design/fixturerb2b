import { useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useLanguage } from '../contexts/LanguageContext'
import { openLarkChat } from '../utils/larkHelper'

// Custom icons for chat platforms
const LarkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z"/>
  </svg>
)

// TODO: Add more chat platform icons here as needed
// Example WhatsApp icon, Telegram icon, Line icon, etc.
// Copy the pattern below and customize for each platform:
// const PlatformIcon = () => (
//   <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
//     {/* Add platform SVG path */}
//   </svg>
// )

const Footer = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const quickLinks = [
    { label: t.nav.solutions, path: '/services' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.cases, path: '/cases' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' }
  ]

  return (
    <footer className="bg-gradient-to-b from-charcoal to-charcoal-light text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Logo & Description */}
          <div className="space-y-6">
            <div className="text-3xl font-bold tracking-tight inline-block cursor-pointer group" onClick={() => navigate('/')}>
              Fixture<span className="text-wood group-hover:text-white transition-colors duration-300">RB2B</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook' },
                { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
                { icon: Linkedin, href: siteConfig.social.linkedin, label: 'LinkedIn' },
                { icon: Twitter, href: siteConfig.social.twitter, label: 'Twitter' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-wood transition-colors duration-300"
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              {t.footer.quickLinks}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-wood" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-white/70 hover:text-wood transition-colors duration-200 text-sm text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              {t.footer.contactUs}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-wood" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                <Mail className="w-5 h-5 text-wood mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                <Phone className="w-5 h-5 text-wood mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                <MapPin className="w-5 h-5 text-wood mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">{t.contact.companyAddress || 'Registered Business Address, China'}</span>
              </li>
            </ul>

            {/* Chat Platform Icons */}
            <div className="mt-8">
              <p className="text-white/70 text-sm mb-4 font-medium">{t.contact.connectTitle}</p>
              <div className="flex space-x-3">
                {[
                  { icon: MessageCircle, href: siteConfig.contact.chatSystem, label: 'Chat System', onClick: undefined },
                  { icon: LarkIcon, href: '#', label: 'Lark', onClick: openLarkChat }
                  // TODO: Add more chat platforms here as needed (WhatsApp, Telegram, Line, etc.)
                  // Example: { icon: WhatsAppIcon, href: '#', label: 'WhatsApp', onClick: openWhatsAppChat }
                  // Example: { icon: TelegramIcon, href: '#', label: 'Telegram', onClick: openTelegramChat }
                ].map((platform) => (
                  <a
                    key={platform.label}
                    href={platform.href}
                    onClick={(e) => {
                      if (platform.onClick) {
                        e.preventDefault()
                        platform.onClick()
                      }
                    }}
                    className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center hover:bg-wood transition-colors duration-300"
                    title={platform.label}
                  >
                    <platform.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              {t.footer.newsletter}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-wood" />
            </h3>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t.footer.yourEmail}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-wood focus:ring-2 focus:ring-wood/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-wood text-white rounded-lg font-medium hover:bg-wood-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/50 text-sm">
              © 2026 FixtureRB2B. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button onClick={() => navigate('/privacy')} className="text-white/50 hover:text-white/80 text-sm transition-colors hover:underline">
                {t.footer.privacyPolicy}
              </button>
              <button onClick={() => navigate('/terms')} className="text-white/50 hover:text-white/80 text-sm transition-colors hover:underline">
                {t.footer.termsOfService}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
