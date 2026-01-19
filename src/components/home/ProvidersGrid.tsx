import ProviderCard from '@/components/providers/ProviderCard'
import { providers } from '@/data/providers'
import { coda } from "@/styles/fonts/fonts";
import { montserrat } from "@/styles/fonts/fonts";
export default function ProvidersGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-2xl font-semibold" style={montserrat.style}>
        Servicios disponibles
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map(provider => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </section>
  )
}
