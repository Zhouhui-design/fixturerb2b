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
    coverImage: '/images/pullin-2.jpg',
    galleryImages: [] // Images to be added
  },
  {
    id: 3,
    name: 'Trend Collection Store Beijing',
    result: 'Customer dwell time +35%',
    coverImage: '/images/pullin-3.jpg',
    galleryImages: [] // Images to be added
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
