import BrandStory from '../components/sections/BrandStory'

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-charcoal text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Your trusted partner in retail display solutions from China
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <BrandStory />

      {/* Values */}
      <div className="py-20 bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Precision</h3>
              <p className="text-muted-foreground">
                1:1 reproduction of your designs with exact specifications
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Honesty</h3>
              <p className="text-muted-foreground">
                Transparent communication and realistic expectations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-muted-foreground">
                Commercial-grade materials and professional craftsmanship
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Factory */}
      <div className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Our Facility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img
              src="/images/factory-workshop.jpg"
              alt="Factory"
              className="w-full rounded-lg"
            />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">State-of-the-Art Manufacturing</h3>
              <p className="text-muted-foreground">
                Our facility is equipped with modern machinery and staffed by experienced
                craftsmen who specialize in retail fixture production.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Advanced CNC machining capabilities</li>
                <li>✓ Professional welding and finishing</li>
                <li>✓ Strict quality control processes</li>
                <li>✓ Efficient production workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
