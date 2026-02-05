import { notFound } from 'next/navigation'
import ProvidersGrid from '@/components/providers/ProvidersGrid'
import { CATEGORIES } from '@/constants/categories'
import { providers } from '@/data/providers'

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
    <section className="relative z-1">
      <ProvidersGrid
      providers={filteredProviders}
      title={category.label}
    />
    </section>
  )
}
