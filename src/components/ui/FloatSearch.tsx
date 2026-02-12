'use client'

//import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import ProvidersSearch from '@/components/providers/ProvidersSearch'
import { useIntersection } from '@/hooks/useIntersection'
import useIsMobile from '@/hooks/useIsMobile'

interface Rule {
  target: string
  when: 'in' | 'out'
}

interface Props {
  className?: string
  intersect?: Rule[]
}
export default function FloatingSearch({ className, intersect }: Props) {
  const isMobile = useIsMobile()

  const map = useIntersection(
  intersect?.map(r => r.target) ?? [],
    { threshold: .2 }
  )

  //let dataComponent = null;

  const visible = intersect
    ? intersect.some(rule =>
        rule.when === 'in'
          ? map[rule.target]
          : !map[rule.target]
      )
    : true

  return (
    <>
      {isMobile && ( 
        <div
        id="float-search"
        className={cn(
          "fixed bottom-0 inset-x-0 max-w-full overflow-x-clip pb-[env(safe-area-inset-bottom)] py-4 z-60 focus-within:top-0",
          "transition-all duration-500 ease-out",
          "bg-linear-to-t gradient via-none", 
          visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none",
          className
        )}
      >
      
        <ProvidersSearch
          variant="floating"
          dropdownDirection="down"
          className='z-50'       
        />
      
      </div>
    )}
    </>
  )
}
