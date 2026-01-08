export interface Provider {
  id: number
  slug: string
  name: string
  title: string
  location: string
  avatarUrl?: string
  services: string[]
  priceFrom?: number
}
