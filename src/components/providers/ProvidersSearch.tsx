/*
  WISHLIST — FloatSearch

  □ Add explicit close button (setHasResults(false))
  □ Support ESC to close dropdown
  □ Toggle collapse/visibility for full search UI
  □ Persist collapsed state (localStorage)

*/

'use client'

import { useState, useMemo, useEffect, useDeferredValue, forwardRef, useImperativeHandle, useCallback} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { providers } from '@/data/providers'
import type { Provider } from '@/interfaces/provider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useUI } from "@/context/UIContext"
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

export type ProvidersSearchHandle = {
  clear: () => void
}

const ProvidersSearch = forwardRef<ProvidersSearchHandle, Props>(
({ variant = 'header', className }, ref) => {

  const router = useRouter()
  const pathname = usePathname()
  const [term, setTerm] = useState('')
  const deferredTerm = useDeferredValue(term)
  const { state, actions } = useUI()
  const isMobile = state.isMobile

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

      if (hasResults) {
        document.body.classList.add('open-search');
      } else {
        document.body.classList.remove('open-search');
      }

    }  
  }, [hasResults, isMobile])
  
 const handleSearch = () => {
    const clean = term.trim()

    if (!clean) {
      clearTerm() // 🔥 cerramos UI igual
      return
    }

    router.push(`/search?q=${encodeURIComponent(clean)}`)
    clearTerm()
  }

  const clearTerm = useCallback(() => { 
    // Esto es para en limpiar el campo
    setTerm('')
    actions.requestMobileSearch('close')
  },[actions])
  
 
  useImperativeHandle(ref, () => ({
    clear: clearTerm
  }))

  useEffect(() => {
    // Esto es para en limpiar el campo en cambio de pagina
    clearTerm()
  }, [pathname, clearTerm])
  
  return (
   <>
     
    {!isMobile  && hasResults && (<div className={cn('search-overlay')} onClick={clearTerm}></div>)}

    <div id="search-box" className={cn(containerStyles[variant], 'search-box relative z-2 rounded-none py-0 md:px-0', className)} onClick={(e) => {e.stopPropagation();if(isMobile){actions.requestMobileSearch('open')} }}>   

      <input
        id="search-input"
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
        placeholder="¿Qué servicio buscas?"
        className={cn("input rounded-r-none search-input basis-2/3"
        )}      
      />

      {isMobile && ( 
      <button
        onClick={(e) => {e.stopPropagation();clearTerm();actions.requestMobileSearch('close')}}
        className={cn("close-search-btn p-4"
        )}
      >
        <FontAwesomeIcon icon={faCircleArrowLeft} />
      </button>
      )}

      <button
        onClick={() => {handleSearch()}}
        className={cn("cta cta-bg rounded-l-none  basis-1/3"
        )}
        >
        Buscar
      </button>

       
        <div 
          className={cn('search-results-box absolute w-full left-0 z-3 ',
            'top-full md:rounded-b-lg',      
            totalResults === 1 && 'to-300%',
            hasResults && 'mt-4',
            variant === 'header' && 'bg-linear-to-b gradient'
          )}
        >

          {hasResults && ( 
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
          )}
          {isMobile && (
          <p className={cn("text-xs text-center pb-6", hasResults &&("pt-6"))}>¿Quieres reactivar el hint de búsqueda? → <button>Reactivar</button></p>
          )}
        </div> 
           
    </div>
  </> 
  )}
)
ProvidersSearch.displayName = 'ProvidersSearch';
export default ProvidersSearch
