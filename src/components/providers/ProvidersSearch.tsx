/*
  WISHLIST — FloatSearch

  □ Add explicit close button (setHasResults(false))
  □ Support ESC to close dropdown
  □ Toggle collapse/visibility for full search UI
  □ Persist collapsed state (localStorage)

*/

'use client'

import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle, useCallback, useRef} from 'react'
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

const normalize = (value: unknown) =>
    String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

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

type SuggestionsContentProps = {
  hasResults: boolean
  totalResults: number
  suggestions: PredictiveSuggestions
  variant: 'header' | 'mobile' | 'floating'
  onPickService: (s: string) => void
  onPickLocation: (l: string) => void
  onPickProvider: (slug: string) => void
  onSubmit: () => void
}

const SuggestionsContent = React.memo(function SuggestionsContent({
  hasResults,
  totalResults,
  suggestions,
  variant,
  onPickService,
  onPickLocation,
  onPickProvider,
  onSubmit,
}: SuggestionsContentProps) {
  if (!hasResults) return null

  
  return (
    <div className={cn('theme-search-shadow')}>
      {/* Servicios */}
      {suggestions.services.length > 0 && (
        <div className={cn("", totalResults > 1 && "border-b border-(--lowlight-l)/10 dark:border-white/10")}>
          <div className="px-6 py-2 text-xs opacity-60">Servicios</div>
          {suggestions.services.map(s => (
            <div
              key={s}
              onClick={() => onPickService(s)}
              className="px-8 py-2 cursor-pointer hover:bg-(--lowlight-l)/10 dark:hover:bg-white/10"
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Ubicaciones */}
      {suggestions.locations.length > 0 && (
        <div className={cn("", suggestions.services.length > 0 && suggestions.providers.length > 0 && "border-b border-(--lowlight-l)/10 dark:border-white/10")}>
          <div className="px-6 py-2 text-xs opacity-60">Ubicaciones</div>
          {suggestions.locations.map(l => (
            <div
              key={l}
              onClick={() => onPickLocation(l)}
              className="px-10 py-2 cursor-pointer hover:bg-(--lowlight-l)/10 dark:hover:bg-white/10"
            >
              {l}
            </div>
          ))}
        </div>
      )}

      {/* Providers */}
      {suggestions.providers.length > 0 && (
        <div>
          <div className="px-6 py-2 text-xs opacity-60">Especialistas</div>
          {suggestions.providers.map(p => (
            <div
              key={p.id}
              onClick={() => onPickProvider(p.slug)}
              className="px-10 py-2 cursor-pointer hover:bg-(--lowlight-l)/10 dark:hover:bg-white/10"
            >
              <div className="font-semibold leading-tight">{p.name}</div>
              <div className="text-xs opacity-60 truncate">{p.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Ver todos */}
      <div>
        <button
          onClick={onSubmit}
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

    
  )
})


const ProvidersSearch = forwardRef<ProvidersSearchHandle, Props>(
({ variant = 'header', className }, ref) => {

  const router = useRouter()
  const pathname = usePathname()
  const [term, setTerm] = useState('')
  const [query, setQuery] = useState('') // lo que gatilla suggestions

  
  const { state, actions } = useUI()
  const isMobile = state.isMobile
  const inputRef = useRef<HTMLInputElement>(null)

  const containerStyles = {
    header: 'hidden md:flex justify-center items-center text-sm header-search-transition',
    mobile: 'flex w-full max-w-full min-w-0 px-6 pb-4 z-70',
    floating: 'flex w-full items-center', //sinnutilizar aún
  }

  useEffect(() => {
    const id = window.setTimeout(() => setQuery(term), 120) // debounce real
    return () => window.clearTimeout(id)
  }, [term])

  
   
  const searchIndex = useMemo(() => {
    return providers.map(p => ({
      provider: p,

      nameN: normalize(p.name),
      titleN: normalize(p.title),

      location: p.location,
      locationN: normalize(p.location),

      services: (p.services ?? []).map(s => ({
        orig: s,
        norm: normalize(s),
      })),
    }))
  }, [])

  const suggestions: PredictiveSuggestions = useMemo(() => {
  const EMPTY = { services: [], locations: [], providers: [] }

  const q = normalize(query)
  if (!q) return EMPTY

  const matchedServices = Array.from(
    new Set(
      searchIndex
        .flatMap(x => x.services)
        .filter(s => s.norm.includes(q))
        .map(s => s.orig)
    )
  ).slice(0, 5)

  const matchedLocations = Array.from(
    new Set(
      searchIndex
        .filter(x => x.locationN.includes(q))
        .map(x => x.location)
    )
  ).slice(0, 5)

  const matchedProviders =
    searchIndex
      .filter(x => x.nameN.includes(q) || x.titleN.includes(q))
      .slice(0, 5)
      .map(x => x.provider)

  return {
    services: matchedServices,
    locations: matchedLocations,
    providers: matchedProviders,
  }
}, [query, searchIndex])

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
  const onPickService = useCallback((s: string) => {
  router.push(`/search?q=${encodeURIComponent(s)}`)
}, [router])

const onPickLocation = useCallback((l: string) => {
  router.push(`/search?q=${encodeURIComponent(l)}`)
}, [router])

const onPickProvider = useCallback((slug: string) => {
  router.push(`/providers/${slug}`)
}, [router])

type UISnap = {
  mobileSearchOpen: boolean
  mobileSearchPeek: boolean
  dockOpen: boolean
  autoSearchSuppressed: boolean
  isMobile: boolean
}

/* const prev = useRef<UISnap | null>(null)

useEffect(() => {
  const snap: UISnap = {
    mobileSearchOpen: state.mobileSearchOpen,
    mobileSearchPeek: state.mobileSearchPeek,
    dockOpen: state.dockOpen,
    autoSearchSuppressed: state.autoSearchSuppressed,
    isMobile: state.isMobile,
  }

  if (prev.current) {
    (Object.keys(snap) as (keyof UISnap)[]).forEach((k) => {
      if (prev.current![k] !== snap[k]) {
        console.log('[UI change]', k, prev.current![k], '=>', snap[k])
      }
    })
  } else {
    console.log('[UI init]', snap)
  }

  prev.current = snap
}) */
  return (
   <>
     
    {!isMobile  && hasResults && (<div className={cn('search-overlay')} onClick={clearTerm}><div className='overlay-bg'></div></div>)}

    <div id="search-box" className={cn(containerStyles[variant], 'relative z-2', className)} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>   

      <input
        id="search-input"
        ref={inputRef}
        type="text"
        value={term}
        name="search"
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
        placeholder="¿Qué servicio buscas?"
        className={cn("input rounded-r-none search-input basis-2/3 text-[16px] placeholder:text-sm pt-1.5 pb-1.75 md:text-sm md:py-2"
        )} 
        onPointerDownCapture={(e) =>  e.stopPropagation()}
    
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

          <SuggestionsContent
            hasResults={hasResults}
            totalResults={totalResults}
            suggestions={suggestions}
            variant={variant}
            onPickService={onPickService}
            onPickLocation={onPickLocation}
            onPickProvider={onPickProvider}
            onSubmit={handleSearch}
          />

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
