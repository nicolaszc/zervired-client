import type { MediaItem } from '@/interfaces/media'

export type ProviderMedia = {
  providerId: number
  media: MediaItem[]
}

export const providerMedia: ProviderMedia[] = [
  {
    providerId: 1,
    media: [
      { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200' },
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200' },
      { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200' },
      { src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200' },
      { src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200' },
      { src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200' },
      { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200' },
      { src: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200' },
      { src: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200' },
      { src: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200' },
      { src: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200' },
      { src: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200' },
      
    
      
      
      
    ]
  },

  {
    providerId: 2,
    media: [
      { src: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200' },
      { src: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200' },
      { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200' },
      { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200' },
    ]
  }
]
