// src/components/ui/MobileSearch.tsx
"use client"

import { cn } from "@/lib/utils"
import ProvidersSearch from "@/components/providers/ProvidersSearch"
import type { ProvidersSearchHandle } from "@/components/providers/ProvidersSearch"
import { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react"
import { useUI } from "@/context/UIContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
// import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface Props {
  className?: string
}

export default function MobileSearch({ className }: Props) {
  const { state, actions } = useUI()
  const peek = state.mobileSearchPeek
  const open = state.mobileSearchOpen
  const vh = state.vvh ?? state.viewport.height
  const searchRef = useRef<ProvidersSearchHandle>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const searchBgRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [needsTapToFocus, setNeedsTapToFocus] = useState(true)
 

  useEffect(() => {
    if (open) {
      const tapFocus = () => setNeedsTapToFocus(true)
      tapFocus()
    }
  }, [open])

  // useLockBodyScroll(open)

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

    // Mantengo tu comportamiento para probar tal cual:
    // - open => 50 (ajusta luego si quieres 0)
    // - peek => vh - peekHeight
    if (open) return 50
    if (!peek) return vh

    const peekHeight = contentHeight
    return Math.max(0, vh - peekHeight)
  }, [open, peek, state.viewport.height, contentHeight])

  const handleInputFocus = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) return
    if (open && needsTapToFocus) {
      setNeedsTapToFocus(false)
      requestAnimationFrame(() => searchRef.current?.focus())
    }
   
  }

  

  const handleBgPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as Node
    if (contentRef.current?.contains(target)) return // tap dentro => no cerrar
    actions.requestMobileSearch("close")
    searchRef.current?.clear?.() // opcional
  }


  if (!state.isMobile) return null

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

      {/* ProvidersSearch REAL (fixed arriba) */}
      <ProvidersSearch
        ref={searchRef}
        variant="mobile"
        className={cn(
          "px-6 py-4 fixed top-0 z-70 w-full transition-opacity",
          open ? "opacity-100 delay-200 duration-300" : "opacity-0 pointer-events-none delay-0 duration-300"
        )}
      />

      {/* OVERLAY FULLSCREEN (no translate aquí) */}
      <div
        id="search-overlay"
        ref={searchBgRef}
        onPointerDown={(e) => {
          e.stopPropagation()
          handleBgPointerDown(e)
        }}
        className={cn(
          "fixed inset-0 h-full max-h-full min-h-full z-60",
          className
        )}
        style={{
          //opacity: open || peek ? 1 : 0,
          // Si quieres evitar que “se pueda clickear” cuando está invisible:
          pointerEvents: open || peek ? "auto" : "none",
          height: vh ? `${vh}px` : undefined,
        }}
      >
        {/* Backdrop FULL (siempre parte en 0 visual) */}
        <div className={cn(
          "absolute inset-0 bg-linear-to-t gradient transition-opacity duration-500",
          open || !peek ? "opacity-100 pointer-events-none" : "opacity-0")} />

        {/* SHEET (solo esto se traslada) */}
        <div
          className={cn(
            "relative h-full",
            "transition-transform",
             peek ? "opacity-100 delay-100 duration-400" : "opacity-0 delay-100 duration-400 pointer-events-none"
          )}
          style={{
            translate: `0 ${translateY}px`,
          }}
          onTransitionEnd={handleInputFocus}
        >
          {/* X: SOLO en hint (peek) => suppressed */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              actions.setAutoSearchSuppressed(true)
              actions.setMobileSearchPeek(false)
              actions.showHintToast(
                "Hint de búsqueda suprimido temporalmente. Puedes reactivarlo desde la búsqueda."
              )
            }}
            className={cn(
              "flex items-center justify-center absolute z-60 w-11 h-13 -top-6.5 end-0",
              //open || !peek ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            aria-label="Dismiss hint"
          >
            <span className="flex items-center justify-center w-7.5! h-7.5! bg-(--secondary-l) dark:bg-(--lowlight-d) overflow-hidden rounded-full">
              <FontAwesomeIcon icon={faXmark} className="w-3.75! h-3.75!" />
            </span>
          </button>

          {/* ProvidersSearch HINT / “input falso” */}
          <div
            ref={contentRef}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}          
          >
            {!open && (
              <button
                className="absolute inset-0 z-50"
                onClick={(e) => {
                  e.stopPropagation()
                  actions.requestMobileSearch("open")
                }}
                aria-label="Activar búsqueda"
              />
            )}

            <div className={cn(
              "flex relative w-full max-w-full min-w-0 px-6 py-4 bg-(--secondary-l) dark:bg-(--lowlight-d) transition-opacity duration-400",
              //open ? "opacity-0 pointer-events-none" : "opacity-100 delay-100"
            )}
            >
              <div className={cn("input rounded-r-none search-input basis-2/3 text-sm pt-2 pb-1.75")}>
                <span>¿Qué servicio buscass?</span>
              </div>

              <div className={cn("px-6 py-2 cta-bg rounded-r-full rounded-l-none basis-1/3")}>
                Buscar
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}