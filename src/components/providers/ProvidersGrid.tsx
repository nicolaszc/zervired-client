import ProviderCard from '@/components/providers/ProviderCard'
import { providers } from '@/data/providers'
export default function ProvidersGrid() {
  return (
         
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-16">
        <h2 className="inline-block mb-8 w-full md:w-auto text-2xl font-semibold bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          Servicios disponibles
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

      </div>    
    
  )
}
