import ProviderCard from '@/components/providers/ProviderCard'
import { providers } from '@/data/providers'

export default function FeaturedProviders() {
  const featured = providers.filter(p => p.featured).slice(0, 6)

  if (featured.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 relative z-10">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          Proveedores destacados
        </h2>
        <span className="text-xs text-amber-600 uppercase tracking-wide bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          Recomendados
        </span>
      </header>

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
