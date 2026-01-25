import Link from 'next/link'
import { Provider } from '@/interfaces/provider'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faMedal, faAward, faTrophy, faTag, faStar } from '@fortawesome/free-solid-svg-icons'
interface Props {
  provider: Provider
}

export default function ProviderCard({ provider }: Props) {
  return (
    <Link href={`/providers/${provider.slug}`}>
      <article className="rounded-lg bg-white dark:bg-[#041926] p-5 shadow-lg shadow-grey-500/30 dark:shadow-sky-500/30 hover:shadow-xl transition cursor-pointer ">
      <div className="flex items-start gap-4">
        {provider.image ? (
  <Image
    src={provider.image}
    alt={provider.name}
    width={48}
    height={48}
    unoptimized
    className="h-14 w-14 rounded-full object-cover"
  />
) : (
  <div className="h-14 w-14 rounded-full bg-gray-200/10 border-4 border-sky-500 flex items-center justify-center text-lg font-semibold">
    {provider.name.charAt(0)}
  </div>
)}


        <div className="flex-1 text-sky-950/90 dark:text-white/80">
          <h3 className="font-semibold">{provider.name}</h3>
          <FontAwesomeIcon icon={faThumbsUp} className='text-amber-500/70 dark:text-white/70' />
          <FontAwesomeIcon icon={faMedal} className='text-amber-500/70 dark:text-white/70' />
          <FontAwesomeIcon icon={faAward} className='text-amber-500/70 dark:text-white/70' />
          <FontAwesomeIcon icon={faTrophy} className='text-amber-500/70 dark:text-white/70' />
          <FontAwesomeIcon icon={faTag} className='text-amber-500/70 dark:text-white/70' />
          <FontAwesomeIcon icon={faStar} className='text-amber-500/70 dark:text-white/70' />
          <p className="text-sm text-sky-500 mt-4">{provider.title}</p>
          <p className="mt-1 text-xs text-amber-500/90">{provider.location}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {provider.services.map(service => (
              <span
                key={service}
                className="rounded-sm bg-sky-950 dark:bg-sky-500/70 px-3 py-1 text-xs text-white/70"
              >
                {service}
              </span>
            ))}
          </div>

          {provider.priceFrom && (
            <p className="mt-4 text-sm font-extralight text-sky-950/90 dark:text-white/90">
              Desde <span className='text-amber-500 font-normal'>${provider.priceFrom.toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>
    </article>
    </Link>
  )
}
