import ProviderCard from '@/components/providers/ProviderCard'
import { providers } from '@/data/providers'

export default function FeaturedProviders() {
  const featured = providers.filter(p => p.featured).slice(0, 6)

  if (featured.length === 0) return null

  return (
    <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl w-full md:w-auto font-semibold bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          Proveedores destacados
        </h2>
        
      </div>

      <div className="-mx-6 md:mx-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:overflow-visible">
        <div className="flex gap-6 px-6 md:grid md:grid-cols-5 md:gap-6 md:px-0">
          {featured.map(provider => (
            <div
              key={provider.id}
              className="min-w-[70%] snap-start md:min-w-0">
              <ProviderCard provider={provider} featured />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
