'use client'

import { useState } from 'react'
import ProviderCard from '@/components/providers/ProviderCard'
import type { Provider } from '@/interfaces/provider'

import Image from 'next/image'
import logoWhite from '@/assets/logo/logo-zervired-white.svg'
import logoBlue from '@/assets/logo/logo-zervired-blue.svg'
import SectionTitle  from '@/components/ui/SectionTitle'

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
      
      {/* {title && (
        <h2 className="inline-block mb-8  basis-full w-full md:w-auto text-2xl font-semibold bg-s-fade">
          {title} ({providers.length})
        </h2>
      )} */}
      <SectionTitle className={''} title={
          <>
            {title}
            <span className="opacity-60 ml-1">
              ({providers.length})
            </span>
          </>
        } 
      />
      
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
              bg-linear-to-t gradient via-none
              theme-shadow
              theme-card
              flex flex-col 
              items-center justify-center
              min-h-48
              text-sm
              shake-element
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
