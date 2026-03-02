'use client'

//import { useState, useCallback } from 'react'
import { useRef } from "react"
import { cn } from '@/lib/utils'
import ProvidersSearch from '@/components/providers/ProvidersSearch'
import type { ProvidersSearchHandle } from '@/components/providers/ProvidersSearch'
import { useUI } from "@/context/UIContext"
import ProviderCategories from '@/components/providers/ProviderCategories'
import FeaturedProviders from '@/components/providers/FeaturedProviders'
import SectionTitle  from '@/components/ui/SectionTitle'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

interface Props {
  className?: string
}
export default function AdvabcedSearch({ className}: Props) {
  const { state, actions } = useUI()
  const searchRef = useRef<ProvidersSearchHandle>(null)
 
  // Solo desktop
  if (state.isMobile) return null

  const open = state.advancedSearchOpen

    //if (!open) return null

  return (
   <>  

      <div
      id="advanced-search"
      className={cn(
        "fixed bottom-0 inset-x-0 max-w-full overflow-x-clip overflow-y-visible pb-[env(safe-area-inset-bottom)] z-60",
        "transition-all duration-500 ease-out",
        "", 
        open
        ? "translate-y-0 opacity-100 via-d"
        : "translate-y-full opacity-0 pointer-events-none",
        className,
      )}
    >
      <div className="relative advanced-search-gradient mt-6.5 py-12 "> 
        <button
          className={cn(
            "flex items-center justify-center absolute w-11 h-13 -top-6.5 end-0 cursor-pointer pointer-events-auto hover:text-sky-500 dark:hover:text-amber-500"
          )}    
          onClick={(e) => {e.stopPropagation();actions.requestMobileSearch('close');searchRef.current?.clear()}}
          aria-label="Close advanced search"
        >
          <div className="btn-close rounded-full w-7.5! h-7.5! overflow-hidden">
            <span className="flex items-center justify-center w-7.5! h-7.5!">
              <FontAwesomeIcon icon={faXmark} className="w-3.75! h-3.75!" />
            </span>
          </div>
        </button>

        <section className='advanced-search relative z-1 grid grid-cols-5 gap-x-20 mx-auto max-w-7xl px-6'>
          <div className="col-span-3 flex flex-col items-start justify-between">
            <SectionTitle title={'Búsqueda de perfiles'} />
            <ProvidersSearch/>
            <ProviderCategories /> 
          </div>

          <div className="col-span-2">
            <FeaturedProviders count={2}/>
          </div>

        </section>
      </div>         
    </div>
      
  </>
  )
}
