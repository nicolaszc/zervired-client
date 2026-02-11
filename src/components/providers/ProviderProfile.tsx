'use client'
import { Provider } from '@/interfaces/provider'
import RelatedProviders from '@/components/providers/RelatedProviders'
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { getRankIcon } from '@/lib/rank'
import Steps from '@/components/sections/Steps'
import { getMediaByProvider } from '@/lib/getProviderMedia'
import Gallery from '@/components/ui/Gallery'
import useIsMobile from '@/hooks/useIsMobile'
import { getGalleryEngine, chunkSlides } from '@/lib/galleryEngine'
import { cn } from '@/lib/utils'
interface Props {
  provider: Provider
}

export default function ProviderProfile({ provider }: Props) {
  const {
    //slug,
    name,
    title,
    location,
    services,
    priceFrom: price,
    image,
    description,
    //featured: isFeatured,
    rank = 0,
  } = provider

  const icon = getRankIcon(rank)
  const media = getMediaByProvider(provider.id)


const isMobile = useIsMobile()
console.log(!isMobile)
const galleryEngine = getGalleryEngine(
  media.length,
  isMobile
  
)

const slides = chunkSlides(
  media,
  galleryEngine.perSlide,
  galleryEngine.maxSlides
)


  return (
    <>
      <section className="mx-auto max-w-6xl px-6 my-16 relative z-1">

        {/* ================= Grid Layout ================= */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* ----- Left Column ----- */}
          <div>

            <div className="flex items-start gap-6">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-30 w-30 md:h-40 md:w-40 rounded-full object-cover mask-radial-at-top-left mask-radial-[40px]"
                />
              ) : (
                <div className="h-40 w-40 rounded-full bg-gray-200/60 dark:bg-gray-200/10 flex items-center justify-center text-4xl font-semibold">
                  {name.charAt(0)}
                </div>
              )} 

              <div>
                <h1 className="text-3xl font-semibold bg-s-fade"><FontAwesomeIcon icon={icon} className='me-2' />{name}</h1>
                <p className="mt-1 text-lg text-(--highlight-d) font-light bg-s-fade">{title}</p>
                <p className="mt-2 text-sm text-(--primary-l)/90 font-light bg-s-fade">{location}</p>

                {provider.priceFrom && (
                  <p className="mt-4 text-sm font-extralight bg-s-fade">
                    <FontAwesomeIcon icon={faTag} className='me-1 text-lg' />Desde <span className='font-medium text-2xl tracking-tight text-amber-500'>${formatPrice(price)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-xl font-medium bg-s-fade">Servicios</h2>
              <ul className="flex flex-wrap gap-3">
                {services.map(service => (
                  <li
                    key={service}
                    className="tag py-2"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>

          </div>
          
          {/* ----- Right Column ----- */}
          <div>
            
            {/* Description */}
            <div
              className="space-y-4 txt bg-s-fade"
              dangerouslySetInnerHTML={{ __html: description }}
            />
                      

          </div>

        </div>
      </section>

      <section className='relative z-1 my-16'>
        <div className="flex gap-4 justify-center items-center">
          <button className="cta cta-bg">
            Contactar
          </button>
          <button className="cta cta-ol">
            Solicitar servicio
          </button>
        </div>
      </section>
      
      <section className="relative z-1 mt-16 bg-s-blend">

        <div className={cn(
          'grid',
          galleryEngine.dense ? 'md:grid-cols-3' : 'md:grid-cols-2'
        )}>


          <div className={cn(
            galleryEngine.dense ? 'md:col-span-2' : 'md:col-span-1'
          )}>

            {/* ===== Gallery ===== */}
          <Gallery
  slides={slides}
  cols={galleryEngine.cols}
  rows={galleryEngine.rows}
/>


          </div>

          <div className="md:col-span-1">
            {/* ===== Map ===== */}
            <div className="relative min-h-80 md:min-h-full">
              <div className='blend cursor-pointer'>
                <iframe
                  src="https://maps.google.com/maps?q=-33.0245,-71.5518&z=13&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

          </div>  


        </div>
      </section>

      <section className='relative z-1 mt-16'>
        <RelatedProviders />
      </section>
      
      <section className='relative z-1 mt-16'>
              <Steps />
      </section>
    </>
  )
}
