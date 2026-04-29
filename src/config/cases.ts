/**
 * Centralized configuration for case study images
 * Makes it easy to add new cases without modifying component code
 */

export interface CaseImageConfig {
  id: number
  name: string
  result: string
  coverImage: string // Main image for the case listing
  galleryImages: string[] // All images for the case detail page
}

export const caseStudies: CaseImageConfig[] = [
  {
    id: 1,
    name: 'Pullin Store Fixture',
    result: 'Custom retail display solution',
    coverImage: '/images/pullin-1.jpg',
    galleryImages: [
      '/images/pullin-1.jpg',
      '/images/pullin-2.jpg',
      '/images/pullin-3.jpg',
      '/images/pullin-4.jpg',
      '/images/pullin-5.jpg',
      '/images/pullin-6.jpg',
      '/images/pullin-7.jpg',
      '/images/pullin-8.jpg'
    ]
  },
  {
    id: 2,
    name: 'Elegant Boutique Shanghai',
    result: 'Display SKU count +40%',
    coverImage: '/images/badgley-1.jpeg',
    galleryImages: [
      '/images/badgley-1.jpeg',
      '/images/badgley-2.jpeg',
      '/images/badgley-3.jpeg',
      '/images/badgley-4.jpeg',
      '/images/badgley-5.jpeg',
      '/images/badgley-6.jpeg',
      '/images/badgley-7.jpeg',
      '/images/badgley-8.jpeg',
      '/images/badgley-9.jpeg',
      '/images/badgley-10.jpeg',
      '/images/badgley-11.jpeg',
      '/images/badgley-12.jpeg',
      '/images/badgley-13.jpeg',
      '/images/badgley-14.jpeg',
      '/images/badgley-15.jpeg',
      '/images/badgley-16.jpeg',
      '/images/badgley-17.jpeg',
      '/images/badgley-18.jpeg',
      '/images/badgley-19.jpeg',
      '/images/badgley-20.jpeg',
      '/images/badgley-21.jpeg',
      '/images/badgley-22.jpeg',
      '/images/badgley-23.jpeg',
      '/images/badgley-24.jpeg',
      '/images/badgley-25.jpeg',
      '/images/badgley-26.jpeg',
      '/images/badgley-27.jpeg',
      '/images/badgley-28.jpeg',
      '/images/badgley-29.jpeg',
      '/images/badgley-30.jpeg',
      '/images/badgley-31.jpeg',
      '/images/badgley-32.jpeg'
    ]
  },
  {
    id: 3,
    name: 'Trend Collection Store Beijing',
    result: 'Customer dwell time +35%',
    coverImage: '/images/eve-1.jpg',
    galleryImages: [
      '/images/eve-1.jpg',
      '/images/eve-2.jpg',
      '/images/eve-3.jpg',
      '/images/eve-4.jpg',
      '/images/eve-5.jpg',
      '/images/eve-6.jpg',
      '/images/eve-7.jpg',
      '/images/eve-8.jpg',
      '/images/eve-9.jpg',
      '/images/eve-10.jpg',
      '/images/eve-11.jpg',
      '/images/eve-12.jpg',
      '/images/eve-13.jpg',
      '/images/eve-14.jpg',
      '/images/eve-15.jpg',
      '/images/eve-16.jpg',
      '/images/eve-17.jpg',
      '/images/eve-18.jpg',
      '/images/eve-19.jpg',
      '/images/eve-20.jpg',
      '/images/eve-21.jpg',
      '/images/eve-22.jpg',
      '/images/eve-23.jpg',
      '/images/eve-24.jpg'
    ]
  },
  {
    id: 4,
    name: 'Sports Brand Flagship Guangzhou',
    result: 'Sales conversion +25%',
    coverImage: '/images/pullin-4.jpg',
    galleryImages: [] // Images to be added
  },
  {
    id: 5,
    name: 'Kids Fashion Store Shenzhen',
    result: 'Space utilization +50%',
    coverImage: '/images/pullin-5.jpg',
    galleryImages: [] // Images to be added
  },
  {
    id: 6,
    name: 'Luxury Womenswear Hangzhou',
    result: 'Brand perception elevated',
    coverImage: '/images/pullin-6.jpg',
    galleryImages: [] // Images to be added
  }
]

/**
 * Helper function to get case study by ID
 */
export const getCaseStudy = (id: number): CaseImageConfig | undefined => {
  return caseStudies.find(caseStudy => caseStudy.id === id)
}

/**
 * Helper function to get all case studies
 */
export const getAllCases = (): CaseImageConfig[] => {
  return caseStudies
}
