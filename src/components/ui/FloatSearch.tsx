'use client'

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
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden",
        "transition-all duration-500 ease-out",
        visible
        ? "translate-y-0 opacity-100"
        : "translate-y-full opacity-0 pointer-events-none",
        className
      )}
    >
      <div
        className="
        mx-auto
        max-w-4xl
        bg-linear-to-b
        from-[#ffa900] to-amber-500 
        dark:from-[#062031] dark:to-[#041926] 
        py-4
        "
      >
        <ProvidersSearch
          variant="floating"
          dropdownDirection="up"
        />
      </div>
    </div>
  )
}
