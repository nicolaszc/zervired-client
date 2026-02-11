import ProvidersGrid from '@/components/providers/ProvidersGrid'
import { providers } from '@/data/providers'

interface Props {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: Props) {
  const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const params = await searchParams
  const rawQuery = Array.isArray(params.q)
  ? params.q[0]
  : params.q ?? ''

  const query = normalize(rawQuery)

  const results = providers.filter(p => 
    normalize(p.name).includes(query) || 
    normalize(p.title).includes(query) || 
    normalize(p.description).includes(query) || 
    p.services.some(s => normalize(s).includes(query)) || 
    p.categories.some(c => normalize(c).includes(query)) 
  )

  return (
    <section className="relative z-1">
      <ProvidersGrid
        key={query}
        providers={results}
        title={`Resultados para "${params.q}"`}
      />
    </section>
  )
}
