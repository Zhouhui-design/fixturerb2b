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
    name: 'French Light Luxury Lingerie',
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
    name: 'American Fashion Womenswear',
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
    name: 'EVE New York',
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
    name: 'Korean Art Fashion Brand',
    result: 'Sales conversion +25%',
    coverImage: '/images/korea-1.jpg',
    galleryImages: [
      '/images/korea-1.jpg',
      '/images/korea-2.jpg',
      '/images/korea-3.jpg',
      '/images/korea-4.jpg',
      '/images/korea-5.jpg',
      '/images/korea-6.jpg',
      '/images/korea-7.jpg',
      '/images/korea-8.jpg',
      '/images/korea-9.jpg',
      '/images/korea-10.jpg',
      '/images/korea-11.jpg',
      '/images/korea-12.jpg',
      '/images/korea-13.jpg',
      '/images/korea-14.jpg',
      '/images/korea-15.jpg',
      '/images/korea-16.jpg',
      '/images/korea-17.jpg',
      '/images/korea-18.jpg',
      '/images/korea-19.jpg',
      '/images/korea-20.jpg',
      '/images/korea-21.jpg',
      '/images/korea-22.jpg',
      '/images/korea-23.jpg'
    ]
  },
  {
    id: 5,
    name: 'Display Cabinet Collection',
    result: 'Space utilization +50%',
    coverImage: '/images/display-case-1.png',
    galleryImages: [
      '/images/display-case-1.png',
      '/images/display-case-2.png',
      '/images/display-case-3.png',
      '/images/display-case-4.png',
      '/images/display-case-5.png',
      '/images/display-case-6.png',
      '/images/display-case-7.png',
      '/images/display-case-8.png',
      '/images/display-case-9.png',
      '/images/display-case-10.png',
      '/images/display-case-11.png',
      '/images/display-case-12.png',
      '/images/display-case-13.png',
      '/images/display-case-14.png',
      '/images/display-case-15.png',
      '/images/display-case-16.png',
      '/images/display-case-17.png',
      '/images/display-case-18.png',
      '/images/display-case-19.png',
      '/images/display-case-20.png',
      '/images/display-case-21.png',
      '/images/display-case-22.png',
      '/images/display-case-23.png',
      '/images/display-case-24.png',
      '/images/display-case-25.png',
      '/images/display-case-26.png',
      '/images/display-case-27.png',
      '/images/display-case-28.png',
      '/images/display-case-29.png',
      '/images/display-case-30.png',
      '/images/display-case-31.png',
      '/images/display-case-32.png',
      '/images/display-case-33.png',
      '/images/display-case-34.png',
      '/images/display-case-35.png',
      '/images/display-case-36.png',
      '/images/display-case-37.png',
      '/images/display-case-38.png',
      '/images/display-case-39.png',
      '/images/display-case-40.png',
      '/images/display-case-41.png'
    ]
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
