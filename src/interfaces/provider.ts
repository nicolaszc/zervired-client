export interface Provider {
  id: number
  slug: string
  name: string
  title: string
  location: string
  services: string[]
  priceFrom?: number
  image?: string | null
  categories: string[]   
  featured?: boolean     
}
