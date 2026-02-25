// src/components/ui/MobileSearch.tsx
"use client"

import { cn } from "@/lib/utils"
import ProvidersSearch from "@/components/providers/ProvidersSearch"
import type { ProvidersSearchHandle } from "@/components/providers/ProvidersSearch"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { useUI } from "@/context/UIContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

interface Props {
  className?: string
}

export default function MobileSearch({ className }: Props) {
  const { state, actions } = useUI()
  const peek = state.mobileSearchPeek
  const open = state.mobileSearchOpen

  const searchRef = useRef<ProvidersSearchHandle>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return

    const measure = () => setContentHeight(el.offsetHeight)

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)

    return () => ro.disconnect()
  }, [])


  const translateY = useMemo(() => {
    const vh = state.viewport.height

    if (open) return 0
    if (!peek) return vh

    const peekHeight = contentHeight
    return Math.max(0, vh - peekHeight)
  }, [open, peek, state.viewport.height, contentHeight])

  if (!state.isMobile) return null

  const handleBackgroundClick = () => {
    // Fondo clickeable:
    // - si open -> cerrar takeover
    // - si peek -> ocultar hint momentáneo
    if (open) {
      actions.requestSearch("close")
      searchRef.current?.clear()
      return
    }
    actions.setMobileSearchPeek(false)
  }

  return (
    <div
      id="search"
      onClick={handleBackgroundClick}
      className={cn(
        "fixed bottom-0 inset-x-0 h-dvh max-h-dvh w-full z-60",
        "transition-all duration-500 ease-out",
        "bg-linear-to-t gradient",
        className
      )}
      style={{
        transform: `translateY(${translateY}px)`,
        opacity: open || peek ? 1 : 0,
      }}
    >
      {/* X: SOLO en hint (peek) => suppressed */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          actions.setAutoSearchSuppressed(true)
          actions.setMobileSearchPeek(false)
        }}
        className={cn(
          "flex items-center justify-center absolute w-13 h-13 -top-6.5 end-0",
          open ? "hidden" : ""
        )}
        aria-label="Dismiss hint"
      >
        <span className="flex items-center justify-center w-7.5! h-7.5! bg-(--secondary-l) dark:bg-(--lowlight-d) verflow-hidden rounded-full"><FontAwesomeIcon icon={faXmark} className="w-3.75! h-3.75!" /></span>
      </button>

      {/* ProvidersSearch: cualquier click interno NO debe cerrar */}
      <div ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <ProvidersSearch ref={searchRef} variant="floating" className={cn("z-50 py-4", peek && "pt-6.5", open && "pt-4")} />
      </div>
      
    </div>
  )
}