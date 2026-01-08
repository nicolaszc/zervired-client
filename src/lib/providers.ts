import { providers } from '@/data/providers'
import { Provider } from '@/interfaces/provider'

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find(p => p.slug === slug)
}
