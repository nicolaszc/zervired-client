import { Provider } from '@/interfaces/provider'

interface Props {
  provider: Provider
}

export default function ProviderProfile({ provider }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-start gap-6">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold">
          {provider.name.charAt(0)}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{provider.name}</h1>
          <p className="mt-1 text-lg text-gray-600">{provider.title}</p>
          <p className="mt-2 text-sm text-gray-500">{provider.location}</p>

          {provider.priceFrom && (
            <p className="mt-4 text-lg font-medium">
              Desde ${provider.priceFrom.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Servicios</h2>
        <ul className="flex flex-wrap gap-3">
          {provider.services.map(service => (
            <li
              key={service}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm"
            >
              {service}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex gap-4">
        <button className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800">
          Contactar
        </button>
        <button className="rounded-md border px-6 py-3">
          Solicitar servicio
        </button>
      </div>
    </section>
  )
}
