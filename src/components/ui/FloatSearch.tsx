'use client'

//import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import ProvidersSearch from '@/components/providers/ProvidersSearch'
import { useIntersection } from '@/hooks/useIntersection'

interface Rule {
  target: string
  when: 'in' | 'out'
}

interface Props {
  className?: string
  intersect?: Rule[]
}
export default function FloatingSearch({ className, intersect }: Props) {

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
    <div className='search-overlay'>
      <div
        id="float-search"
        className={cn(
          "fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] md:hidden max-w-4xl py-4",
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
          dropdownDirection="up"
          className='z-50'       
        />
        
      </div>
    </div>
  )
}
