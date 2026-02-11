import Link from 'next/link'
import { Provider } from '@/interfaces/provider'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { getRankIcon } from '@/lib/rank'
import { formatPrice } from '@/lib/utils';


interface Props {
  provider: Provider
  featured?: boolean
}

export default function ProviderCard({ provider, featured = false }: Props) {
 

  const {
    slug,
    name,
    title,
    location,
    services,
    priceFrom: price,
    image,
    //featured: isFeatured,
    rank = 0,
  } = provider

  const icon = getRankIcon(rank)

  return (
    <>
    <Link href={`/providers/${slug}`}>
      {featured?(
        <article className="hover:scale-[1.025] transition-all duration-500 cursor-pointer text-center">
          <div className="relative flex justify-center theme-shadow transition-all duration-500 cursor-pointer">
            <div className="relative w-40 rounded-full bg-white dark:bg-(--secondary-d) p-2">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-36 w-36 rounded-full object-cover mask-radial-at-top-left mask-radial-[40px]"
                />
              ) : (
                <div className="h-36 w-36 rounded-full bg-gray-200/60 dark:bg-gray-200/10 flex items-center justify-center text-4xl font-semibold">
                  {name.charAt(0)}
                </div>
              )} 
              
              <span
                className="rounded-full w-12 h-12 flex justify-center items-center leading-1 tracking-1 text-(--primary-d)/90 dark:text-white bg-white dark:bg-[#041926] absolute right-0 bottom-0"
              >
                +
              </span>               
            </div>
          </div>
          <div className="flex-1 text-(--primary-d)/90 dark:text-white/80 text-center mt-3 bg-s-fade">
            <h3 className="font-semibold mb-2 text-xl"><FontAwesomeIcon icon={icon} className='me-2' />{name}</h3>
            <p className="text-sm font-light text-shadow-lg text-shadow-white dark:text-shadow-(--primary-d) text-(--highlight-d) dark:text-(--highlight-d)/75">{title}</p>
            {price && (
              <p className="text-sm font-extralight">
                <FontAwesomeIcon icon={faTag} className='me-1 text-sm' />Desde <span className='text-(--primary-l) font-semibold text-lg tracking-tight'>${formatPrice(price)}</span>
              </p>
            )}
          </div>
        </article>
      ):(    
        <article className="theme-card theme-shadow">
          <div className="flex items-start gap-4">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={48}
                height={48}
                unoptimized
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-gray-200/80 flex items-center justify-center text-lg font-semibold text-(--primary-d)">
                {name.charAt(0)}
              </div>
            )}        

            <div className="flex-1">
              <h3 className="font-semibold text-xl"><FontAwesomeIcon icon={icon} className='me-2' />{name}</h3>
              <p className="text-sm text-(--highlight-d) mt-3 mb-0.5 font-light">{title}</p>
              <p className="text-sm font-light">{location}</p>

              <div className="mt-3.5 mb-4.5 flex flex-wrap gap-2">
                {services.map(service => (
                  <span
                    key={service}
                    className="tag"
                  >
                    {service}
                  </span>
                ))}
              </div>

              {price && (
                <p className="text-sm font-extralight">
                  <FontAwesomeIcon icon={faTag} className='me-1 text-sm' />Desde <span className='text-(--primary-l) font-semibold text-lg tracking-tight'>${formatPrice(price)}</span>
                </p>
              )}
            </div>
          </div>
        </article>     
      )}
    </Link>
    </>
  )
}
