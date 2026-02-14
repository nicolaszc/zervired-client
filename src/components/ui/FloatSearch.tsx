'use client'

//import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import ProvidersSearch from '@/components/providers/ProvidersSearch'
import type { ProvidersSearchHandle } from '@/components/providers/ProvidersSearch'
import { useIntersection } from '@/hooks/useIntersection'
import useViewportSize from '@/hooks/useViewportSize'
import useIsMobile from '@/hooks/useIsMobile'
import { useState, useEffect, useRef} from 'react'

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
  const { height } = useViewportSize()
  const rootMargin = `${Math.round(height * 0.5)}px 0px 0px 0px`
  const [open, setOpen] = useState(false)
  const searchRef = useRef<ProvidersSearchHandle>(null)
  const map = useIntersection(
  intersect?.map(r => r.target) ?? [],
    {
    threshold: 0.99,
    rootMargin: rootMargin
    }
  )

  const toggleClass = () => {
    searchRef.current?.clear();   // limpia siempre
    setOpen(prev => !prev);       // cambio robusto de estado
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('open-search');
    } else {
      document.body.classList.remove('open-search');
    }
  },[open])

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
        onClick={toggleClass}
        id="search"
        className={cn(
          "fixed bottom-0 inset-x-0 max-w-full overflow-x-clip pb-[env(safe-area-inset-bottom)] py-4 z-60",
          "transition-all duration-500 ease-out",
          "bg-linear-to-t gradient via-none", 
          visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none",
          open 
          ? "via-d top-0":"",
          className,
        )}
      >
      
        <ProvidersSearch
          ref={searchRef}
          variant="floating"
          className="z-50"
        />
      
      </div>
      
    )}
    </>
  )
}
