import { providerMedia } from '@/data/media'

export function getMediaByProvider(id: number) {
  return providerMedia.find(p => p.providerId === id)?.media ?? []
}
