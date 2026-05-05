import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

interface SchemaMarkupProps {
  type: 'organization' | 'product' | 'breadcrumb' | 'faq' | 'website' | 'localbusiness'
  data?: any
}

/**
 * SchemaMarkup Component
 * Dynamically injects JSON-LD structured data into the page
 */
const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  let jsonLd = ''

  switch (type) {
    case 'organization':
      jsonLd = `
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FixtureRB2B",
          "url": "https://fixr2026.com",
          "logo": "https://fixr2026.com/logo.png",
          "description": "Professional B2B store fixtures and display solutions for apparel retail. From blueprint to reality - 1:1 reproduction, OEM/ODM services.",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "info@fixr2026.com",
            "contactType": "sales",
            "availableLanguage": ["English", "Chinese", "Spanish", "French", "German", "Japanese", "Korean", "Portuguese", "Russian", "Arabic"]
          },
          "sameAs": []
        }
      `
      break

    case 'website':
      jsonLd = `
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "FixtureRB2B",
          "url": "https://fixr2026.com",
          "description": "Professional B2B store fixtures manufacturer offering custom OEM/ODM services",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://fixr2026.com/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      `
      break

    case 'product':
      if (data) {
        jsonLd = `
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "${data.name}",
            "description": "${data.description}",
            "image": ${JSON.stringify(Array.isArray(data.image) ? data.image : [data.image])},
            "brand": {
              "@type": "Brand",
              "name": "FixtureRB2B"
            },
            "offers": {
              "@type": "Offer",
              "url": "${data.url || 'https://fixr2026.com' + window.location.pathname}",
              "priceCurrency": "${data.currency || 'USD'}",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "FixtureRB2B"
              }
            },
            ${data.rating ? `"aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "${data.rating}",
              "reviewCount": "${data.reviewCount || '50'}"
            },` : ''}
            "manufacturer": {
              "@type": "Organization",
              "name": "FixtureRB2B"
            }
          }
        `
      }
      break

    case 'breadcrumb':
      if (data && data.items) {
        const itemList = data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))

        jsonLd = `
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": ${JSON.stringify(itemList)}
          }
        `
      }
      break

    case 'faq':
      if (data && data.questions) {
        const questions = data.questions.map((qa: any) => ({
          '@type': 'Question',
          name: qa.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: qa.answer
          }
        }))

        jsonLd = `
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ${JSON.stringify(questions)}
          }
        `
      }
      break

    case 'localbusiness':
      jsonLd = `
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "FixtureRB2B",
          "image": "https://fixr2026.com/logo.png",
          "url": "https://fixr2026.com",
          "telephone": "+86-XXX-XXXX-XXXX",
          "email": "info@fixr2026.com",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CN"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          },
          "priceRange": "$$"
        }
      `
      break

    default:
      return null
  }

  return (
    <Helmet>
      <script type="application/ld+json">{jsonLd}</script>
    </Helmet>
  )
}

export default SchemaMarkup
