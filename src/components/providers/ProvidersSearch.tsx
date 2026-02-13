/*
  WISHLIST — FloatSearch

  □ Add explicit close button (setHasResults(false))
  □ Support ESC to close dropdown
  □ Toggle collapse/visibility for full search UI
  □ Persist collapsed state (localStorage)

*/

'use client'

import { useState, useMemo, useEffect, useDeferredValue} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { providers } from '@/data/providers'
import type { Provider } from '@/interfaces/provider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import useIsMobile from '@/hooks/useIsMobile'
interface Props {
  variant?: 'header' | 'mobile' | 'floating'
  //dropdownDirection?: 'down' | 'up' // reserved — currently unused
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
  //dropdownDirection = 'down', // reserved — currently unused
  className,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [term, setTerm] = useState('')
  const [hasClass, setHasClass] = useState(false)
  const deferredTerm = useDeferredValue(term)
  const isMobile = useIsMobile()

  const containerStyles = {
    header: 'hidden md:flex justify-center items-center text-sm',
    mobile: 'flex w-full',
    floating: 'flex w-full items-center',
  }

  const normalize = (value: unknown) =>
    String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      
  const suggestions: PredictiveSuggestions = useMemo(() => {
    const EMPTY = { services: [], locations: [], providers: [] }
    const q = normalize(deferredTerm)
    
    if (q.length <= 2) {

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

  }, [deferredTerm])

  const totalResults = suggestions.services.length + suggestions.locations.length + suggestions.providers.length 

  const hasResults =
  suggestions.services.length > 0 ||
  suggestions.locations.length > 0 ||
  suggestions.providers.length > 0 

  useEffect(() => {
    // Esto es para en desktop abrir el overlay mediante clase auxiliar open-search
    // en desktop no se sigue la clase es solo para agregarla o quitarla en base a los resultados
    if(!isMobile){
    console.log('hasResults useEffect ' + hasResults) 

      if (hasResults) {
        document.body.classList.add('open-search');
      } else {
        document.body.classList.remove('open-search');
      }

    }  
  }, [hasResults, isMobile])
  
  const handleSearch = () => {
    if (!term.trim()) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
    clearTerm()
  }

  const clearTerm = () => { 
    // Esto es para en limpiar el campo
    console.log('clearTerm')
    setTerm('')
  }
  
  useEffect(() => {
    // Esto es para en limpiar el campo en cambio de pagina
    console.log('clearTerm on pathChange')
    clearTerm()
  }, [pathname])

  const bodyClass = document?.body.classList.contains('open-search')

  useEffect(() => {
    // Esto es escucha la clase que se agrega en el FloatSearch
    if(isMobile){
      console.log('hasClass useEffect ' + bodyClass) 

      clearTerm()
      const clearHasClass = () => setHasClass(bodyClass)
      clearHasClass()

    }
  },[hasClass, bodyClass, isMobile])

  return (
  <>
     
    {!isMobile  && hasResults && (<div className={cn('search-overlay')} onClick={clearTerm}></div>)}

    <div id="search-box" className={cn(containerStyles[variant], 'search-box relative z-2 cta rounded-none py-0 md:px-0', className)}>   

      <input
        id="search-input"
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}      
        placeholder="¿Qué servicio buscas?"
        className={cn("input rounded-r-none search-input"
        )}      
      />

      {isMobile && ( 
      <button
        onClick={clearTerm}
        className={cn("close-search-btn cta"
        )}
      >
        <FontAwesomeIcon icon={faCircleArrowLeft} />
      </button>
      )}

      <button
        onClick={() => {handleSearch()}}
        className={cn("cta cta-bg rounded-l-none"
        )}
        >
        Buscar
      </button>

      {hasResults && (   /* term.length >= 3 && hasResults && (   */ 
      <div 
        className={cn('search-results-box absolute w-full left-0 z-3 ',
          'top-full mt-4 rounded-b-lg theme-search-shadow',      
          totalResults === 1 && 'to-300%',
          variant === 'header' && 'bg-linear-to-b gradient'
        )}
      >

        <div
          className={cn(
            'theme-search-shadow',
          )}
        >
          {/* Servicios */}
          {suggestions.services.length > 0 && (
            <div className={cn("",
                totalResults > 1 && "border-b border-(--lowlight-l)/10 dark:border-white/10",
              )}
               >
           
              <div className="px-6 py-2 text-xs opacity-60">Servicios</div>
              {suggestions.services.map(s => (
                <div
                  key={s}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
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
               suggestions.services.length > 0 && suggestions.providers.length > 0 && "border-b border-(--lowlight-l)/10 dark:border-white/10",
              )}
              >
              <div className="px-6 py-2 text-xs opacity-60">Ubicaciones</div>
              {suggestions.locations.map(l => (
                <div
                  key={l}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(l)}`)}
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
              )}>
              <div className="px-6 py-2 text-xs opacity-60">Especialistas</div>
              {suggestions.providers.map(p => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/providers/${p.slug}`)}
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
              onClick={handleSearch}
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
      /* ) */)}
      
    </div>
  </>  
  )
}
