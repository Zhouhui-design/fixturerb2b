// Product image configuration
// Add new products here as you create them
// Format: productId: { whiteImage, sceneImage, galleryCount }

export interface ProductImageConfig {
  whiteImage: string
  sceneImage: string
  galleryCount?: number // Number of images in the gallery (optional)
}

export const productImages: Record<number, ProductImageConfig> = {
  1: {
    whiteImage: '/images/shirt-rack-1.jpg',
    sceneImage: '/images/shirt-rack-2.jpg',
    galleryCount: 12 // Shirt Display Rack has 12 images
  },
  2: {
    whiteImage: '/images/bag-rack-1.jpg',
    sceneImage: '/images/bag-rack-2.jpg',
    galleryCount: 15 // Bag Display Rack has 15 images
  },
  3: {
    whiteImage: '/images/shoe-rack-1.jpg',
    sceneImage: '/images/shoe-rack-2.jpg',
    galleryCount: 13 // Shoe Display Rack has 13 images
  },
  4: {
    whiteImage: '/images/womens-display-1.jpg',
    sceneImage: '/images/womens-display-2.jpg',
    galleryCount: 5 // Women's Display Rack has 5 images
  },
  5: {
    whiteImage: '/images/drawer-cabinet-1.jpg',
    sceneImage: '/images/drawer-cabinet-2.jpg',
    galleryCount: 9 // Display Cabinet with Drawers has 9 images
  },
  6: {
    whiteImage: '/images/wall-side-rack-1.jpg',
    sceneImage: '/images/wall-side-rack-2.jpg',
    galleryCount: 4 // Wall Side Rack has 4 images
  },
  // Add new products here:
  // 7: {
  //   whiteImage: '/images/your-product-1.jpg',
  //   sceneImage: '/images/your-product-2.jpg',
  //   galleryCount: 10 // If this product has multiple images
  // },
}

// Default images for products without specific configuration
export const defaultProductImages: ProductImageConfig = {
  whiteImage: '/images/product-showcase.jpg',
  sceneImage: '/images/hero-boutique.jpg',
  galleryCount: 1 // Single image by default
}

// Helper function to get product images
export const getProductImages = (productId: number): ProductImageConfig => {
  return productImages[productId] || defaultProductImages
}

// Helper function to generate gallery array
export const getProductGallery = (productId: number): string[] => {
  const config = getProductImages(productId)
  
  // If galleryCount is specified, generate numbered images
  if (config.galleryCount && config.galleryCount > 1) {
    // Extract base name from whiteImage (e.g., 'shirt-rack' from '/images/shirt-rack-1.jpg')
    const baseName = config.whiteImage.match(/\/images\/([a-z-]+)-\d+\.jpg$/)?.[1]
    
    if (baseName) {
      return Array.from({ length: config.galleryCount }, (_, i) => 
        `/images/${baseName}-${i + 1}.jpg`
      )
    }
  }
  
  // Return single image
  return [config.whiteImage]
}
