import ProvidersGrid from '@/components/providers/ProvidersGrid'
import { providers } from '@/data/providers'

interface Props {
  searchParams: {
    q?: string
  }
}

export default function SearchPage({ searchParams }: Props) {
  const query = (searchParams.q || '').toLowerCase()

  const results = providers.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.categories.some(c => c.toLowerCase().includes(query)) ||
    p.description?.toLowerCase().includes(query)
  )

  return (
    <section className="relative z-1 mt-16">
      <ProvidersGrid
        providers={results}
        title={`Resultados para "${searchParams.q}"`}
      />
    </section>
  )
}
