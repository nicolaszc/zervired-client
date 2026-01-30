import Link from 'next/link'
import { Provider } from '@/interfaces/provider'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faMedal, faAward, faTrophy, faTag, faStar } from '@fortawesome/free-solid-svg-icons'
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
    featured: isFeatured,
    rank = 0,
  } = provider

  const icon = getRankIcon(rank)

  return (
    <>
    {featured?(
      <article className="transition cursor-pointer text-center">
        <div className="relative flex justify-center filter drop-shadow-[0_12px_6px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_12px_6px_rgba(14,165,233,0.35)]">
          <div className="relative w-40 rounded-full bg-white dark:bg-[#041926] p-2">
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
            
            <a
              href="#"
              className="rounded-full w-12 h-12 flex justify-center items-center leading-1 tracking-1 text-sky-950/90 dark:text-white bg-white dark:bg-[#041926] absolute right-0 bottom-0"
            >
              +
            </a>               
          </div>
        </div>
        <div className="flex-1 text-sky-950/90 dark:text-white/80 text-center mt-3 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          <h3 className="font-semibold mb-2 text-lg"><FontAwesomeIcon icon={icon} className='me-2' />{name}</h3>
          <p className="text-sm font-light text-amber-500 dark:text-sky-500/75">{title}</p>
          {price && (
            <p className="text-xs font-extralight">
              <FontAwesomeIcon icon={faTag} className='me-1 text-sm' />Desde <span className='font-medium text-base tracking-tight'>${formatPrice(price)}</span>
            </p>
          )}
        </div>
      </article>
    ):(
      <Link href={`/providers/${slug}`}>
       <article className="rounded-lg bg-white dark:bg-[#041926] p-5 shadow-lg shadow-grey-500/30 dark:shadow-sky-500/30 hover:shadow-xl transition cursor-pointer ">
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
            <div className="h-14 w-14 rounded-full bg-gray-200/80 flex items-center justify-center text-lg font-semibold text-sky-950">
              {name.charAt(0)}
            </div>
          )}        

          <div className="flex-1 text-sky-950/90 dark:text-white/80">
            <h3 className="font-semibold text-lg"><FontAwesomeIcon icon={icon} className='me-2' />{name}</h3>
            <p className="text-sm text-sky-500 mt-3 font-normal">{title}</p>
            <p className="text-xs text-amber-500/90 font-light">{location}</p>

            <div className="mt-3 mb-4 flex flex-wrap gap-2">
              {services.map(service => (
                <span
                  key={service}
                  className="rounded-sm bg-sky-950 dark:bg-sky-500/70 px-3 py-1 text-xs text-white/70 font-extralight"
                >
                  {service}
                </span>
              ))}
            </div>

            {price && (
              <p className="text-xs font-extralight">
                <FontAwesomeIcon icon={faTag} className='me-1 text-sm' />Desde <span className='text-amber-500 font-medium text-base tracking-tight'>${formatPrice(price)}</span>
              </p>
            )}
          </div>
        </div>
      </article>
      </Link>
    )}
    </>
  )
}
