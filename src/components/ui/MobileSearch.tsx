// src/components/ui/MobileSearch.tsx
"use client"

import { cn } from "@/lib/utils"
import ProvidersSearch from "@/components/providers/ProvidersSearch"
import type { ProvidersSearchHandle } from "@/components/providers/ProvidersSearch"
import { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react"
import { useUI } from "@/context/UIContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import {useLockBodyScroll} from "@/hooks/useLockBodyScroll"
interface Props {
  className?: string
}

export default function MobileSearch({ className }: Props) {
  const { state, actions } = useUI()
  const peek = state.mobileSearchPeek
  const open = state.mobileSearchOpen


  const searchRef = useRef<ProvidersSearchHandle>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const searchBgRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [needsTapToFocus, setNeedsTapToFocus] = useState(true)

  useEffect(() => {
    if (open) {const tapFocus = () => setNeedsTapToFocus(true); tapFocus()}
  }, [open])
  useLockBodyScroll(open)
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

  /* const handleBackgroundClick = () => {
    // Fondo clickeable:
    // - si open -> cerrar takeover
    // - si peek -> ocultar hint momentáneo
    if (open) {
      actions.requestSearch("close")
      console.trace()
      searchRef.current?.clear()
      return
    }
    actions.setMobileSearchPeek(false)
  } */
  const handleInputFocus = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) return
    if(open && needsTapToFocus){
      setNeedsTapToFocus(false)
      requestAnimationFrame(() => searchRef.current?.focus())
      return 
    }
  }
  
  return (
    <>
    {state.hintToast && (
          <div className="fixed bottom-5 inset-x-3 z-999">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-yellow-100 text-yellow-900">
              <span>⚠️</span>
              <span className="text-sm">{state.hintToast}</span>
            </div>
          </div>
        )}
    <div
      id="search"
      ref={searchBgRef}
      /* onClick={handleBackgroundClick} */
      onTransitionEnd={handleInputFocus}
      className={cn(
        "fixed top-0 bottom-0 h-full max-h-full inset-x-0 z-60",
        "transition-transform-opacity duration-500 delay-0 ease-out",
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
          actions.showHintToast("Hint de búsqueda suprimido temporalmente. Puedes reactivarlo desde la búsqueda.")
        }}
        className={cn(
          "flex items-center justify-center absolute z-60 w-11 h-13 -top-6.5 end-0",
          open ? "hidden" : ""
        )}
        aria-label="Dismiss hint"
      >
        <span className="flex items-center justify-center w-7.5! h-7.5! bg-(--secondary-l) dark:bg-(--lowlight-d) overflow-hidden rounded-full"><FontAwesomeIcon icon={faXmark} className="w-3.75! h-3.75!" /></span>
      </button>
      
      

      {/* ProvidersSearch: cualquier click interno NO debe cerrar */}
      <div ref={contentRef} onClick={(e) => e.stopPropagation()} className="overflow-x-clip min-w-0 w-full max-w-full relative">
        {!open && (
          <button
            className="absolute inset-0 z-50"
            onClick={(e) => {
              e.stopPropagation()
              actions.requestMobileSearch('open')
              //setNeedsTapToFocus(false)
              //requestAnimationFrame(() => searchRef.current?.focus())
            }}
            aria-label="Activar búsqueda"
          />
        )}
        <ProvidersSearch ref={searchRef} variant="mobile" className={cn(peek && "pt-4", open && "pt-4")} />
      </div>
      
    </div>
    </>
  )
}