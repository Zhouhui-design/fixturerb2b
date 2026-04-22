import { ShoppingBag, TrendingUp, Dumbbell, Baby } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'

const SolutionsSection = () => {
  const { t } = useLanguage()
  
  const solutions = [
    {
      icon: ShoppingBag,
      title: t.solutions.womenswear,
      tags: [t.solutions.tags.elegant, t.solutions.tags.textured, t.solutions.tags.lightingAtmosphere],
      color: 'from-pink-500/10 to-purple-500/10'
    },
    {
      icon: TrendingUp,
      title: t.solutions.boutique,
      tags: [t.solutions.tags.trendy, t.solutions.tags.unique, t.solutions.tags.curatedDisplay],
      color: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Dumbbell,
      title: t.solutions.sports,
      tags: [t.solutions.tags.dynamic, t.solutions.tags.functional, t.solutions.tags.activeLifestyle],
      color: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: Baby,
      title: t.solutions.kids,
      tags: [t.solutions.tags.playful, t.solutions.tags.flexible, t.solutions.tags.quickTurnover],
      color: 'from-orange-500/10 to-yellow-500/10'
    }
  ]

  return (
    <section id="solutions" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">
            {t.solutions.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${solution.color}`} />
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-lg bg-secondary group-hover:bg-primary/5 transition-colors duration-300">
                  <solution.icon className="w-7 h-7 text-charcoal" />
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-wood transition-colors duration-300">
                  {solution.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {solution.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SolutionsSection
