// Schema Markup utilities for SEO
// These generate JSON-LD structured data for different page types

export interface OrganizationSchema {
  name: string
  url: string
  logo: string
  description: string
  email?: string
  phone?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry: string
  }
  sameAs?: string[]
}

export interface ProductSchema {
  name: string
  description: string
  image: string | string[]
  sku?: string
  brand: string
  offers: {
    priceCurrency: string
    availability: string
    priceValidUntil?: string
    url: string
  }
  aggregateRating?: {
    ratingValue: string
    reviewCount: string
  }
}

export interface BreadcrumbSchema {
  itemListElement: Array<{
    position: number
    name: string
    item: string
  }>
}

export interface FAQSchema {
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

/**
 * Generate Organization Schema
 */
export const generateOrganizationSchema = (data: OrganizationSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    ...(data.address && {
      address: {
        '@type': 'PostalAddress',
        ...(data.address.streetAddress && { streetAddress: data.address.streetAddress }),
        ...(data.address.addressLocality && { addressLocality: data.address.addressLocality }),
        ...(data.address.addressRegion && { addressRegion: data.address.addressRegion }),
        ...(data.address.postalCode && { postalCode: data.address.postalCode }),
        addressCountry: data.address.addressCountry
      }
    }),
    contactPoint: {
      '@type': 'ContactPoint',
      ...(data.email && { email: data.email }),
      ...(data.phone && { telephone: data.phone }),
      contactType: 'sales',
      availableLanguage: ['English', 'Chinese', 'Spanish', 'French', 'German', 'Japanese', 'Korean']
    },
    sameAs: data.sameAs || []
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Generate Product Schema
 */
export const generateProductSchema = (data: ProductSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: Array.isArray(data.image) ? data.image : [data.image],
    ...(data.sku && { sku: data.sku }),
    brand: {
      '@type': 'Brand',
      name: data.brand
    },
    offers: {
      '@type': 'Offer',
      url: data.offers.url,
      priceCurrency: data.offers.priceCurrency,
      availability: data.offers.availability,
      ...(data.offers.priceValidUntil && { priceValidUntil: data.offers.priceValidUntil })
    },
    ...(data.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.aggregateRating.ratingValue,
        reviewCount: data.aggregateRating.reviewCount
      }
    })
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Generate BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (data: BreadcrumbSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.itemListElement.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item
    }))
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Generate FAQPage Schema
 */
export const generateFAQSchema = (data: FAQSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.mainEntity.map(qa => ({
      '@type': 'Question',
      name: qa.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.acceptedAnswer.text
      }
    }))
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Generate WebSite Schema (for homepage)
 */
export const generateWebSiteSchema = (): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FixtureRB2B',
    url: 'https://fixturerb2b.top',
    description: 'Professional B2B store fixtures and display solutions for apparel retail',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://fixturerb2b.top/products?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return JSON.stringify(schema, null, 2)
}

/**
 * Generate LocalBusiness Schema
 */
export const generateLocalBusinessSchema = (): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FixtureRB2B',
    image: 'https://fixturerb2b.top/logo.png',
    url: 'https://fixturerb2b.top',
    telephone: '+86-XXX-XXXX-XXXX',
    email: 'info@fixturerb2b.top',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    priceRange: '$$'
  }

  return JSON.stringify(schema, null, 2)
}
