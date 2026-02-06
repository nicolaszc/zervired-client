'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { providers } from '@/data/providers'
import type { Provider } from '@/interfaces/provider'

interface Props {
  variant?: 'header' | 'mobile' | 'floating'
  dropdownDirection?: 'down' | 'up'
  className?: string
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

  return (
    <div className={cn(containerStyles[variant], 'relative', className)}
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
        className={cn("flex-1 md:min-w-64 rounded-l-lg bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none  text-sky-950",
          variant === "floating" && "ml-4"
        )}      
      />

      {hasResults && (

        
        <div
          className={cn(
            'absolute w-full left-0 bg-linear-to-b shadow-[0_16px_16px_-2px_rgba(0,0,0,0.15)] overflow-hidden z-50',
            dropdownDirection === 'down' && 'top-full mt-4 rounded-b-lg from-amber-500 from-20% to-amber-300 dark:from-[#041926] dark:from-20% dark:to-sky-950',
            dropdownDirection === 'up' && 'bottom-full mb-4 flex flex-col-reverse from-amber-300 from-20% to-amber-500 dark:from-sky-950 dark:from-20% dark:to-[#041926]'
          )}
        >
          {/* Servicios */}
          {suggestions.services.length > 0 && (
            <div className="border-b border-amber-950/15 dark:border-white/10">
              <div className="px-4 py-2 text-xs opacity-60">Servicios</div>
              {suggestions.services.map(s => (
                <div
                  key={s}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                  className="px-4 py-2 cursor-pointer hover:bg-amber-950/10 dark:hover:bg-white/10"
                >
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Ubicaciones */}
          {suggestions.locations.length > 0 && (
            <div className="border-b border-amber-950/15 dark:border-white/10">
              <div className="px-4 py-2 text-xs opacity-60">Ubicaciones</div>
              {suggestions.locations.map(l => (
                <div
                  key={l}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(l)}`)}
                  className="px-4 py-2 cursor-pointer hover:bg-amber-950/10 dark:hover:bg-white/10"
                >
                  {l}
                </div>
              ))}
            </div>
          )}

          {/* Providers */}
          <div className="px-4 py-2 text-xs opacity-60">Especialistas</div>
          {suggestions.providers.map(p => (
            <div
              key={p.id}
              onClick={() => router.push(`/providers/${p.slug}`)}
              className="px-4 py-3 cursor-pointer hover:bg-amber-950/10 dark:hover:bg-white/10"
            >
              <div className="font-semibold leading-tight">{p.name}</div>
              <div className="text-xs opacity-60 truncate">{p.title}</div>
            </div>
          ))}

          {/* CTA Ver todos */}
          <div className="border-t border-amber-950/10 dark:border-white/10">
            <button
              onClick={handleSearch}
              className="
                w-full
                text-center
                uppercase
                px-4 py-3
                font-semibold
                cursor-pointer
              bg-amber-950/10
              dark:bg-white/10
              hover:bg-amber-950/15
              dark:hover:bg-white/15
              "
            >
              Ver todos
            </button>
          </div>

        </div>
        
      )}

      <button
        onClick={handleSearch}
        className={cn("rounded-r-full bg-sky-950 hover:bg-sky-950/90  dark:bg-amber-500  dark:hover:bg-amber-600  px-6  py-2  text-white  cursor-pointer  transition",
        variant === "floating" && "mr-4"
        )}
      >
        Buscar
      </button>
    </div>
  )
}
