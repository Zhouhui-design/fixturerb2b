import HeroSection from '../components/sections/HeroSection'
import CapabilitiesSection from '../components/sections/CapabilitiesSection'
import SolutionsSection from '../components/sections/SolutionsSection'
import BlueprintShowcase from '../components/sections/BlueprintShowcase'
import ProductsSection from '../components/sections/ProductsSection'
import BrandStory from '../components/sections/BrandStory'
import TrustIndicators from '../components/TrustIndicators'
import CTASection from '../components/sections/CTASection'
import SchemaMarkup from '../components/SchemaMarkup'

const HomePage = () => {
  return (
    <>
      {/* Schema Markup for SEO */}
      <SchemaMarkup type="organization" />
      <SchemaMarkup type="website" />
      
      <HeroSection />
      <CapabilitiesSection />
      <SolutionsSection />
      <BlueprintShowcase />
      <ProductsSection />
      <TrustIndicators />
      <BrandStory />
      <CTASection />
    </>
  )
}

export default HomePage
