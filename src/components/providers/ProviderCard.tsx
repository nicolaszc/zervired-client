import Link from 'next/link'
import { Provider } from '@/interfaces/provider'
interface Props {
  provider: Provider
}

export default function ProviderCard({ provider }: Props) {
  return (
    <Link href={`/providers/${provider.slug}`}>
      <article className="rounded-lg bg-black/20 p-5 hover:shadow-md transition cursor-pointer">
      <div className="flex items-start gap-4">
        {provider.image ? (
  <img
    src={provider.image}
    alt={provider.name}
    className="h-14 w-14 rounded-full object-cover"
  />
) : (
  <div className="h-14 w-14 rounded-full bg-gray-200/10 flex items-center justify-center text-lg font-semibold">
    {provider.name.charAt(0)}
  </div>
)}


        <div className="flex-1">
          <h3 className="font-semibold">{provider.name}</h3>
          <p className="text-sm text-sky-500">{provider.title}</p>
          <p className="mt-1 text-xs text-amber-500/90">{provider.location}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {provider.services.map(service => (
              <span
                key={service}
                className="rounded-sm bg-sky-500/70 px-3 py-1 text-xs text-white/70"
              >
                {service}
              </span>
            ))}
          </div>

          {provider.priceFrom && (
            <p className="mt-4 text-sm font-extralight text-white/60">
              Desde <span className='text-amber-500 font-normal'>${provider.priceFrom.toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>
    </article>
    </Link>
  )
}
