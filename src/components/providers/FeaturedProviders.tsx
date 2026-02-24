import ProviderCard from '@/components/providers/ProviderCard'
import { providers } from '@/data/providers'
import SectionTitle  from '@/components/ui/SectionTitle'
import { cn } from '@/lib/utils'
interface Props{
  count?: number
  context?: string
}
export default function FeaturedProviders({count = 5, context}: Props) {
  const featured = providers.filter(p => p.featured).slice(0, count)

  if (featured.length === 0) return null

  return (
    <div className={cn(context == 'section' ? 'mx-auto max-w-7xl pt-16 pb-8 px-6' : '')}>
      
      {context == 'section' && (
        <SectionTitle className={''} title={'Especialistas destacados'} />
      )}

      <div className="-mx-6 md:mx-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:overflow-visible">
        <div className={cn('flex gap-6 px-6 md:grid', count ? 'md:grid-cols-' + count : 'md:grid-cols-5', 'md:gap-6 md:px-0')}>
          {featured.map(provider => (
            <div
              key={provider.id}
              className="min-w-[70%] snap-start md:min-w-0">
              <ProviderCard provider={provider} featured />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
