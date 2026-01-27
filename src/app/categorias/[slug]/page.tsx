import { notFound } from 'next/navigation'
import { CATEGORIES } from '@/constants/categories'
import { providers } from '@/data/providers'
import ProviderCard from '@/components/providers/ProviderCard'

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map(slug => ({
    slug,
  }))
}

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  if (!(slug in CATEGORIES)) {
    notFound()
  }

  const category = CATEGORIES[slug as keyof typeof CATEGORIES]

  const filteredProviders = providers.filter(provider =>
    provider.categories.includes(slug)
  )

  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold">
          {category.label}
        </h1>
        <p className="mt-2 text-sm text-sky-500">
          Servicios disponibles en esta categoría
        </p>
      </header>

      {filteredProviders.length === 0 ? (
        <p className="text-sky-500">
          Aún no hay proveedores en esta categoría.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
            />
          ))}
        </div>
      )}
    </section>
  )
}
