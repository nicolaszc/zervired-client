import ProviderCard from '@/components/providers/ProviderCard'
import { providers } from '@/data/providers'

export default function FeaturedProviders() {
  const featured = providers.filter(p => p.featured).slice(0, 6)

  if (featured.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 relative z-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl w-full md:w-auto text-center md:text-start font-semibold bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          Proveedores destacados
        </h2>
        <span className="hidden md:inline-block text-xs text-amber-600 dark:text-sky-500 uppercase tracking-wide bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          Recomendados
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {featured.map(provider => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            featured
          />
        ))}
      </div>
    </section>
  )
}
