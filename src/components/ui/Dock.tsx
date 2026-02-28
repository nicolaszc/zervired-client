// src/components/ui/Dock.tsx
'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import ThemeSwitch from '@/components/ui/ThemeSwitch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faAngleUp, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useUIVisible, useUI } from '@/context/UIContext'

interface Rule {
  target: string
  when: 'in' | 'out'
  threshold: number
  margin: number
}
interface Props {
  intersect?: Rule[]
}

export default function Dock({ intersect }: Props) {
  const { state, actions } = useUI()
  const { visible, isMobile } = useUIVisible(intersect)

  const open = state.dockOpen
  //const searchOpen = state.advancedSearchOpen
  // Sentinel: SOLO controla hint (peek) en mobile, con gates anti-flash
  useEffect(() => {
    if (!isMobile) return

    if (visible) {
      if (
        !state.autoSearchSuppressed &&
        !state.mobileSearchOpen &&
        !state.dockOpen &&
        !state.dockToSearchPending && // ✅ evita flash durante coreografía
        state.dockSettled
      ) {
        actions.setMobileSearchPeek(true)
      }
    } else {
      actions.setMobileSearchPeek(false)
    }
    
  }, [
    isMobile,
    visible,
    state.autoSearchSuppressed,
    state.mobileSearchOpen,
    state.dockOpen,
    state.dockToSearchPending,
    state.dockSettled,
    actions,
  ])

  const dockRef = useRef<HTMLDivElement>(null)

  const handleDockTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
  if (e.currentTarget !== e.target) return

  // Tailwind v4 translate-* => propiedad "translate"
  if (e.propertyName !== "translate" && e.propertyName !== "transform" && e.propertyName !== "-webkit-transform")
    return

  // ✅ solo al cerrar
  if (state.dockOpen) return
  console.log('notify')

  actions.notifyDockSettled()
}

  const transition_duration = 200

  return (
    <div
      id="dock"
      className={cn(
        'flex flex-col fixed bottom-[15%] end-0 z-30',
        'transition-transform ease-out',
        open && 'translate-y-[20%]',

      )}
      style={{
        transitionDuration: transition_duration * 2.5 + 'ms',
        transitionDelay: open ? transition_duration * 0 + 'ms' : transition_duration * 4 + 'ms',
      }}
      ref={dockRef}
      onTransitionEnd={handleDockTransitionEnd}
    >
      <div suppressHydrationWarning className={cn('flex flex-col text-(--primary-d)/80 dark:text-white/80')}>
        {/* SUBMENU */}
        <div className={cn('grid', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
          <div
            className="flex flex-col items-center gap-y-2"
            style={{
              transitionDuration: transition_duration * 1 + 'ms',
              transitionDelay: !open ? transition_duration * 4 + 'ms' : transition_duration * 1 + 'ms',
            }}
          >
            <button
              className={cn('trigger', open ? 'translate-x-0' : 'translate-x-full cerrando')}
              style={{
                transitionDuration: transition_duration * 1 + 'ms',
                transitionDelay: !open ? transition_duration * 0 + 'ms' : transition_duration * 4 + 'ms',
              }}
              aria-label="Scroll to top"
              data-is-leaving={!open ? 'true' : 'false'}
            >
              <FontAwesomeIcon icon={faAngleUp} />
            </button>

            <ThemeSwitch
              className={cn(open ? 'translate-x-0' : 'translate-x-full')}
              style={{
                transitionDuration: transition_duration * 1 + 'ms',
                transitionDelay: !open ? transition_duration * 1 + 'ms' : transition_duration * 3 + 'ms',
              }}
              aria-label="Dark Mode Switch"
            />

            <button
              className={cn('text-[1.15rem]', open ? 'translate-x-0 abrio' : 'translate-x-full cerro')}
              style={{
                transitionDuration: transition_duration * 1 + 'ms',
                transitionDelay: transition_duration * 2 + 'ms',
              }}
              aria-label="Contact"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </button>

            <button
              className={cn(open ? 'translate-x-0' : 'translate-x-full')}
              style={{
                transitionDuration: transition_duration * 1 + 'ms',
                transitionDelay: !open ? transition_duration * 3 + 'ms' : transition_duration * 1 + 'ms',
              }}
              aria-label="Whatsapp"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </button>
          </div>
        </div>

        {/* TOGGLE */}
        <button onClick={() => actions.toggleDock()} aria-label="Toggle Dock">
          <FontAwesomeIcon icon={faEllipsisV} className={cn(!open && 'heartbeat')} />
        </button>
      </div>

      {/* SEARCH BUTTON (mobile + desktop) */}
      <button
        className={cn('duration-200 text-[1rem] translate-x-0 opacity-100')}
        onClick={() => actions.openSearchFromDock()}
        aria-label="Open Search"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  )
}