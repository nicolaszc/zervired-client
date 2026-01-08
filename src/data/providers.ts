import { Provider } from '@/interfaces/provider'

export const providers: Provider[] = [
  {
    id: 1,
    slug: 'juan-electricista',
    name: 'Juan Pérez',
    title: 'Electricista certificado',
    location: 'Providencia, Santiago',
    services: ['Instalaciones', 'Reparaciones', 'Emergencias'],
    priceFrom: 25000,
  },
  {
    id: 2,
    slug: 'maria-peluquera',
    name: 'María González',
    title: 'Peluquera profesional',
    location: 'Ñuñoa, Santiago',
    services: ['Corte', 'Color', 'Tratamientos'],
    priceFrom: 18000,
  },
  {
    id: 3,
    slug: 'carlos-gasfiter',
    name: 'Carlos Rojas',
    title: 'Gásfiter a domicilio',
    location: 'La Florida, Santiago',
    services: ['Fugas', 'Mantención', 'Instalaciones'],
    priceFrom: 30000,
  },
]
