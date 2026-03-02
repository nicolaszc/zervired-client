/*
  WISHLIST — FloatSearch

  □ Add explicit close button (setHasResults(false))
  □ Support ESC to close dropdown
  □ Toggle collapse/visibility for full search UI
  □ Persist collapsed state (localStorage)

*/

'use client'

import { useState, useMemo, useEffect, useDeferredValue, forwardRef, useImperativeHandle, useCallback, useRef} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { providers } from '@/data/providers'
import type { Provider } from '@/interfaces/provider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons'
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
  focus: () => void
}

function useIOSBoundaryScrollLock(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return

    let startY = 0

    const onTouchStart: EventListener = (e) => {
      const ev = e as TouchEvent
      startY = ev.touches[0]?.clientY ?? 0
    }

    const onTouchMove: EventListener = (e) => {
      const ev = e as TouchEvent

      if (!ev.cancelable) return

      const y = ev.touches[0]?.clientY ?? 0
      const deltaY = y - startY

      const atTop = el.scrollTop <= 0
      const atBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 1

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        ev.preventDefault()
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
    }
  }, [active])

  return ref
}

function useDebouncedValue<T>(value: T, delay = 100) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

const ProvidersSearch = forwardRef<ProvidersSearchHandle, Props>(
({ variant = 'header', className }, ref) => {

  const router = useRouter()
  const pathname = usePathname()
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebouncedValue(term, 100)
  //const deferredTerm = useDeferredValue(term)
  const { state, actions } = useUI()
  const isMobile = state.isMobile
  const inputRef = useRef<HTMLInputElement>(null)

  const containerStyles = {
    header: 'hidden md:flex justify-center items-center text-sm header-search-transition',
    mobile: 'flex w-full max-w-full min-w-0 px-6 pb-4 z-50',
    floating: 'flex w-full items-center', //sinnutilizar aún
  }

  const normalize = (value: unknown) =>
    String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      
  const suggestions: PredictiveSuggestions = useMemo(() => {
    const EMPTY = { services: [], locations: [], providers: [] }
    const q = normalize(debouncedTerm)
    if (q.length <= 0) {

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

  }, [debouncedTerm])

  const totalResults = suggestions.services.length + suggestions.locations.length + suggestions.providers.length 

  const hasResults =
  suggestions.services.length > 0 ||
  suggestions.locations.length > 0 ||
  suggestions.providers.length > 0 
  
  
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
    clear: clearTerm,
    focus: () => inputRef.current?.focus(),
  }))

  useEffect(() => {
    // Esto es para en limpiar el campo en cambio de pagina
    clearTerm()
  }, [pathname, clearTerm])
  
  const [vvh, setVvh] = useState<number | null>(null)

  useEffect(() => {
    if (!state.isMobile) return
    const vv = window.visualViewport
    if (!vv) return

    const onResize = () => setVvh(vv.height)
    onResize()
    vv.addEventListener("resize", onResize)
    vv.addEventListener("scroll", onResize)
    return () => {
      vv.removeEventListener("resize", onResize)
      vv.removeEventListener("scroll", onResize)
    }
  }, [state.isMobile])

  const listRef = useIOSBoundaryScrollLock(state.mobileSearchOpen)

  return (
   <>
     
    {!isMobile  && hasResults && (<div className={cn('search-overlay')} onClick={clearTerm}><div className='overlay-bg'></div></div>)}

    <div id="search-box" className={cn(containerStyles[variant], 'relative z-2', className)} onClick={(e) => {e.stopPropagation();/* if(isMobile){actions.requestMobileSearch('open')} */ }}>   

      <input
        id="search-input"
        ref={inputRef}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
        placeholder="¿Qué servicio buscas?"
        className={cn("input rounded-r-none search-input basis-2/3 text-[16px] placeholder:text-sm pt-1.5 pb-1.75 md:text-sm md:py-2"
        )}      
      />

      {isMobile && ( 
      <button
        onClick={(e) => {e.stopPropagation();clearTerm();actions.requestMobileSearch('close')}}
        className={cn("close-search-btn px-4 py-2.5"
        )}
      >
        <FontAwesomeIcon icon={faCircleArrowDown} />
      </button>
      )}

      <button
        onClick={() => {handleSearch()}}
        className={cn("px-6 py-2 cta-bg rounded-r-full rounded-l-none basis-1/3 cursor-pointer"
        )}
        >
        Buscar
      </button>

       
        <div 
          className={cn('search-results-box absolute w-full left-0 z-3 pb-10 md:pb-0',
            'top-full md:rounded-b-lg',      
            totalResults === 1 && 'to-300%',
            hasResults && 'pt-4',
            variant === 'header' && 'bg-linear-to-b gradient'
          )}
          style={{ height: hasResults && vvh ? `${vvh}px` : undefined}}
          ref={listRef}
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
