'use client'

import { useState } from 'react'
import ProviderCard from '@/components/providers/ProviderCard'
import type { Provider } from '@/interfaces/provider'

import Image from 'next/image'
import logoWhite from '@/assets/logo/logo-zervired-white.svg'
import logoBlue from '@/assets/logo/logo-zervired-blue.svg'

interface Props {
  providers: Provider[],
  title?: string
}

export default function ProvidersGrid({
  providers,
  title,
  }: Props) {   

  const INITIAL = 5
const STEP = 6

const computeNextVisible = (current: number) => {
  const remaining = providers.length - current

  if (remaining <= STEP + 1) {
    return providers.length
  }

  return current + STEP
}

const getInitialVisible = () => {
  const remaining = providers.length - INITIAL

  if (remaining <= 1) {
    return providers.length
  }

  return INITIAL
}

const [visible, setVisible] = useState(getInitialVisible)



  const shown = providers.slice(0, visible)
  const remaining = providers.length - visible
  const hasMore = remaining > 1

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-16 flex flex-wrap">
      
      {title && (
        <h2 className="inline-block mb-8  basis-full md:hidden w-full md:w-auto text-2xl font-semibold bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
          {title} ({providers.length})
        </h2>
      )}

      <div className="flex justify-center items-center mb-8 text-sm rounded-l-lg rounded-r-full bg-white dark:bg-[#041f2f] sticky top-35 basis-full md:hidden">
        <input
          type="text"
          placeholder="¿Qué servicio buscas?"
          className="w-full rounded-l-lg bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
        />
        <button className="rounded-r-full bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 text-white cursor-pointer transition">
          Buscar
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 basis-full">

        {/* PROVIDERS */}
        {shown.map(provider => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}

        {/* LOAD MORE CARD */}
        {hasMore && (
          <button
            onClick={() => setVisible(v => computeNextVisible(v))}
            className="
              rounded-lg
              bg-amber-500 dark:bg-sky-500
              p-5
              shadow-lg shadow-gray-500/30 dark:shadow-sky-500/30
              hover:shadow-xl hover:scale-[1.025]
              transition-all duration-500
              text-left
              flex flex-col items-center
              justify-center
              font-semibold
              cursor-pointer
              min-h-48
            "
          >
            <Image
              src={logoBlue}
              alt="Logo Zervired"
              height={60}
              className="h-15 w-auto text-sky-950 mb-3 opacity-80 dark:hidden"
              priority
            />  

            <Image
              src={logoWhite}
              alt="Logo Zervired"
              height={60}
              className="h-15 w-auto text-sky-950 mb-3 opacity-80 hidden dark:block"
              priority
            /> 
            Ver más servicios
          </button>
        )}

      </div>

    </div>
  )
}
