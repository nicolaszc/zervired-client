/*
  WISHLIST — FloatSearch

  □ Add explicit close button (setHasResults(false))
  □ Support ESC to close dropdown
  □ Toggle collapse/visibility for full search UI
  □ Persist collapsed state (localStorage)

*/

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { providers } from '@/data/providers'
import type { Provider } from '@/interfaces/provider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

interface Props {
  variant?: 'header' | 'mobile' | 'floating'
  dropdownDirection?: 'down' | 'up'
  className?: string
  ProvidersSearch?: React.ReactNode
}

type PredictiveSuggestions = {
  services: string[]
  locations: string[]
  providers: Provider[]
}

export default function ProvidersSearch({
  variant = 'header',
  dropdownDirection = 'down',
  className,
}: Props) {
  const router = useRouter()
  const [term, setTerm] = useState('')

  const normalize = (value: unknown) =>
    String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      

  const suggestions: PredictiveSuggestions = useMemo(() => {

  const q = normalize(term)

  const EMPTY = { services: [], locations: [], providers: [] }

  if (q.length <= 1) {
    return EMPTY
  }

  // Servicios únicos
  const matchedServices = Array.from(
    new Set(
      providers
        .flatMap(p => p.services ?? [])
        .filter(s => normalize(s).includes(q))
    )
  ).slice(0, 5)

  // Ubicaciones únicas
  const matchedLocations = Array.from(
    new Set(
      providers
        .map(p => p.location)
        .filter(loc => normalize(loc).includes(q))
      )
  ).slice(0, 5)

  // Providers solo desde 3 chars
  const matchedProviders =
    providers
          .filter(p =>
            normalize(p.title).includes(q) ||
            normalize(p.name).includes(q)
          )
          .slice(0, 5)

  return {
    services: matchedServices,
    locations: matchedLocations,
    providers: matchedProviders,
  }

}, [term])


  const handleSearch = () => {
    if (!term.trim()) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
    setTerm('')
  }

  const containerStyles = {
    header: 'hidden md:flex justify-center items-center text-sm',
    mobile: 'flex w-full',
    floating: 'flex w-full items-center',
  }

  const hasResults =
  suggestions.services.length > 0 ||
  suggestions.locations.length > 0 ||
  suggestions.providers.length > 0

  

  const totalResults = suggestions.services.length + suggestions.locations.length + suggestions.providers.length 
  return (
  <>
    <div className='search-overlay'></div> 
    <div className={cn(containerStyles[variant], 'search-box relative z-2 cta rounded-none py-0 md:px-0', className)}
    onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setTerm('')
      }
    }}
    >

      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="¿Qué servicio buscas?"
        className={cn("input rounded-r-none"
        )}      
      />

      <button
        onClick={() => {setTerm('')}}
        className={cn("close-search-btn cta"
        )}
      >
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
      
      <button
        onClick={handleSearch}
        className={cn("cta cta-bg rounded-l-none"
        )}
      >
        Buscar
      </button>
      {hasResults && (     
      <div 
        className={cn('search-results-box absolute w-full left-0 z-3 ',
          dropdownDirection === 'down' && 'top-full mt-4 rounded-b-lg theme-search-shadow',
          dropdownDirection === 'up' && 'bottom-full mb-4 snap-mandatory snap-y',        
          dropdownDirection === 'down' && totalResults === 1 && 'to-300%',
          dropdownDirection === 'up' && totalResults === 1 && 'via-70% to-100%',
          variant === 'header' && 'bg-linear-to-b gradient'
        )}
      >

        <div
          className={cn(
            '',
            dropdownDirection === 'down' && 'theme-search-shadow',
            dropdownDirection === 'up' && 'flex flex-col-reverse',
          )}
        >
          {/* Servicios */}
          {suggestions.services.length > 0 && (
            <div className={cn("",
                dropdownDirection === 'down' && totalResults > 1 && "border-b border-(--lowlight-l)/10 dark:border-white/10",
              )}
               >
           
              <div className="px-6 py-2 text-xs opacity-60">Servicios</div>
              {suggestions.services.map(s => (
                <div
                  key={s}
                  onMouseDown={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                  className="px-8 py-2 cursor-pointer hover:bg-(--lowlight-l)/10 dark:hover:bg-white/10"
                >
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Ubicaciones */}
          {suggestions.locations.length > 0 && (
            <div className={cn("",
               dropdownDirection === 'down' && suggestions.services.length > 0 && suggestions.providers.length > 0 && "border-b border-(--lowlight-l)/10 dark:border-white/10",
                dropdownDirection === 'up' && totalResults > 1 && "border-b border-(--lowlight-l)/10 dark:border-white/10",
              )}
              >
              <div className="px-6 py-2 text-xs opacity-60">Ubicaciones</div>
              {suggestions.locations.map(l => (
                <div
                  key={l}
                  onMouseDown={() => router.push(`/search?q=${encodeURIComponent(l)}`)}
                  className="px-10 py-2 cursor-pointer hover:bg-(--lowlight-l)/10 dark:hover:bg-white/10"
                >
                  {l}
                </div>
              ))}
            </div>
          )}

          {/* Providers */}
          {suggestions.providers.length > 0 && (
            <div className={cn("",
                dropdownDirection === 'up' && totalResults > 1 && "border-b border-(--lowlight-l)/10 dark:border-white/10",
              )}>
              <div className="px-6 py-2 text-xs opacity-60">Especialistas</div>
              {suggestions.providers.map(p => (
                <div
                  key={p.id}
                  onMouseDown={() => router.push(`/providers/${p.slug}`)}
                  className="px-10 py-2 cursor-pointer hover:bg-(--lowlight-l)/10 dark:hover:bg-white/10"
                >
                  <div className="font-semibold leading-tight">{p.name}</div>
                  <div className="text-xs opacity-60 truncate">{p.title}</div>
                </div>
                ))}
            </div>
          )}
          {/* CTA Ver todos */}
          <div className="">
            <button
              onMouseDown={handleSearch}
              className={cn(
                'w-full text-center uppercase px-4 py-3 font-semibold cursor-pointer', 
                'bg-(--lowlight-l)/10 dark:bg-(--highlight-d)/20', 
                'hover:bg-(--lowlight-l)/15 dark:hover:bg-(--highlight-d)/50'
              )}
            >
              Ver todos
            </button>
            
          </div>

        </div>
       </div> 
      )}
      
    </div>
  </>  
  )
}
