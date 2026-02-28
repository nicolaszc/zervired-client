// src/context/UIContext.tsx
"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import useIsMobile from "@/hooks/useIsMobile"
import useViewportSize from "@/hooks/useViewportSize"
import { useIntersection } from "@/hooks/useIntersection"

export type IntersectWhen = "in" | "out"

export type IntersectRule = {
  target: string
  when: IntersectWhen
  threshold?: number
  margin?: number | string
}

type Viewport = { width: number; height: number }

type UIState = {
  isMobile: boolean
  viewport: Viewport
  intersectMap: Record<string, boolean>

  dockOpen: boolean
  dockSettled: boolean
  // Mobile search layer
  mobileSearchOpen: boolean
  mobileSearchPeek: boolean

  // Desktop search layer (AdvancedSearch)
  advancedSearchOpen: boolean

  // Hint suppression (solo afecta peek)
  autoSearchSuppressed: boolean

  // Anti-flash / coreografía dock -> search
  dockToSearchPending: boolean
}

type UIActions = {
  registerRules: (rules: IntersectRule[]) => void
  unregisterRules: (rules: IntersectRule[]) => void

  setDockOpen: (v: boolean) => void
  openDock: () => void
  closeDock: () => void
  toggleDock: () => void

  // Generic search open/close (mobile: takeover, desktop: advanced)
  requestSearch: (mode: "open" | "close") => void

  // Back-compat (si algo antiguo lo llama)
  requestMobileSearch: (mode: "open" | "close") => void

  // Mobile hint
  setMobileSearchPeek: (v: boolean) => void

  // Desktop advanced panel
  setAdvancedSearchOpen: React.Dispatch<React.SetStateAction<boolean>>

  // Suppress
  setAutoSearchSuppressed: React.Dispatch<React.SetStateAction<boolean>>

  // Dock -> Search coreografía
  openSearchFromDock: () => void
  notifyDockSettled: () => void
}

type UIContextValue = { state: UIState; actions: UIActions }

const UIContext = createContext<UIContextValue | null>(null)

// Defaults
const DEFAULT_THRESHOLD = 0.99
const DEFAULT_MARGIN_RATIO = 0.5

function normalizeThreshold(t?: number) {
  return typeof t === "number" ? t : DEFAULT_THRESHOLD
}
function normalizeMargin(m?: number | string) {
  return m ?? DEFAULT_MARGIN_RATIO
}
function observerKey(threshold: number, margin: number | string) {
  return `t=${threshold}|m=${String(margin)}`
}
function toRootMarginPx(margin: number | string, viewportHeight: number) {
  if (typeof margin === "string") return margin
  const px = Math.round(viewportHeight * margin)
  return `${px}px 0px 0px 0px`
}

function useIntersectionGroup(
  targets: string[],
  config: { threshold: number; rootMargin: string }
): Record<string, boolean> {
  return useIntersection(targets, {
    threshold: config.threshold,
    rootMargin: config.rootMargin,
  })
}

export function UIProvider({ children }: { children: ReactNode }) {
  // --- sensores globales ---
  const isMobile = useIsMobile()
  const { width, height } = useViewportSize()

  // --- registry global de reglas (con refcount) ---
  const registryRef = useRef<Map<string, Map<string, number>>>(new Map())
  const [groupsState, setGroupsState] = useState<
    Array<{ key: string; threshold: number; margin: number | string; targets: string[] }>
  >([])

  const recomputeGroups = useCallback(() => {
    const next: Array<{ key: string; threshold: number; margin: number | string; targets: string[] }> = []

    for (const [key, targetMap] of registryRef.current.entries()) {
      const targets = Array.from(targetMap.keys())
      if (targets.length === 0) continue

      const [tPart, mPart] = key.split("|")
      const threshold = Number(tPart.replace("t=", ""))
      const marginStr = mPart.replace("m=", "")
      const margin: number | string = Number.isFinite(Number(marginStr)) ? Number(marginStr) : marginStr

      next.push({ key, threshold, margin, targets })
    }

    next.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    setGroupsState(next)
  }, [])

  const registerRules = useCallback(
    (rules: IntersectRule[]) => {
      let changed = false

      for (const r of rules) {
        const t = normalizeThreshold(r.threshold)
        const m = normalizeMargin(r.margin)
        const key = observerKey(t, m)

        let targetMap = registryRef.current.get(key)
        if (!targetMap) {
          targetMap = new Map()
          registryRef.current.set(key, targetMap)
          changed = true
        }

        const cur = targetMap.get(r.target) ?? 0
        targetMap.set(r.target, cur + 1)
        if (cur === 0) changed = true
      }

      if (changed) recomputeGroups()
    },
    [recomputeGroups]
  )

  const unregisterRules = useCallback(
    (rules: IntersectRule[]) => {
      let changed = false

      for (const r of rules) {
        const t = normalizeThreshold(r.threshold)
        const m = normalizeMargin(r.margin)
        const key = observerKey(t, m)

        const targetMap = registryRef.current.get(key)
        if (!targetMap) continue

        const cur = targetMap.get(r.target)
        if (!cur) continue

        if (cur === 1) {
          targetMap.delete(r.target)
          changed = true
        } else {
          targetMap.set(r.target, cur - 1)
        }

        if (targetMap.size === 0) {
          registryRef.current.delete(key)
          changed = true
        }
      }

      if (changed) recomputeGroups()
    },
    [recomputeGroups]
  )

  // Intersection groups (hasta 3)
  const g0 = groupsState[0]
  const g1 = groupsState[1]
  const g2 = groupsState[2]

  const map0 = useIntersectionGroup(
    g0?.targets ?? [],
    g0
      ? { threshold: g0.threshold, rootMargin: toRootMarginPx(g0.margin, height) }
      : { threshold: DEFAULT_THRESHOLD, rootMargin: toRootMarginPx(DEFAULT_MARGIN_RATIO, height) }
  )
  const map1 = useIntersectionGroup(
    g1?.targets ?? [],
    g1
      ? { threshold: g1.threshold, rootMargin: toRootMarginPx(g1.margin, height) }
      : { threshold: DEFAULT_THRESHOLD, rootMargin: toRootMarginPx(DEFAULT_MARGIN_RATIO, height) }
  )
  const map2 = useIntersectionGroup(
    g2?.targets ?? [],
    g2
      ? { threshold: g2.threshold, rootMargin: toRootMarginPx(g2.margin, height) }
      : { threshold: DEFAULT_THRESHOLD, rootMargin: toRootMarginPx(DEFAULT_MARGIN_RATIO, height) }
  )

  const intersectMap = useMemo(() => {
    return { ...(map0 ?? {}), ...(map1 ?? {}), ...(map2 ?? {}) }
  }, [map0, map1, map2])

  // --- Dock (mantener tus useEffect tal cual) ---
  const [dockOpen, setDockOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [dockSettled, setDockSettled] = useState(true)
  useEffect(() => {
    console.log('Hydrated')
    const markHydrated = () => setHydrated(true)
    markHydrated()
  }, [])

  useEffect(() => {
    if (!hydrated) return
    console.log('Hydrate')
     const bindDockToDevice = () => {
      setDockOpen(false)
      setDockSettled(true)   // ✅ estado inicial “en reposo”
    }
    bindDockToDevice()
  }, [hydrated, isMobile])

  // --- Search layers ---
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileSearchPeek, setMobileSearchPeek] = useState(false)
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [autoSearchSuppressed, setAutoSearchSuppressed] = useState(false)

  // Anti-flash gate (dock -> search)
  const [dockToSearchPending, setDockToSearchPending] = useState(false)

  // 👇 ref "live" para evitar stale closure con transitionend
  const dockToSearchPendingRef = useRef(false)

  const pendingSearchModeRef = useRef<null | "open">(null)

  // Dock manda: abrir/toggle esconde hint (peek) momentáneo
 const openDock = useCallback(() => {
  setDockSettled(false)
  setDockOpen(true)
  setMobileSearchPeek(false)
  setAdvancedSearchOpen(false)
}, [])

const closeDock = useCallback(() => {
  setDockSettled(false)
  setDockOpen(false)
  console.log(pendingSearchModeRef.current)
  console.log(dockToSearchPendingRef.current)
}, [])

const toggleDock = useCallback(() => {
  setDockSettled(false)
  setDockOpen(v => {
    const next = !v
    if (next) {
      setMobileSearchPeek(false)
      setAdvancedSearchOpen(false)
    }
    return next
  })
}, [])

  // Scroll close dock (evita side-effects mientras search activo)
  useEffect(() => {
    const onScroll = () => {
      //if (!isMobile) return
      
      if (mobileSearchOpen) return
      if (mobileSearchPeek) return
      console.log('scroll')
      setDockOpen(false)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isMobile, mobileSearchOpen, mobileSearchPeek])

  // Body class (solo mobile takeover)
  useEffect(() => {
    if (mobileSearchOpen) {
      document.body.classList.add("open-search")
    } else {
      document.body.classList.remove("open-search")
    }
    return () => document.body.classList.remove("open-search")
  }, [mobileSearchOpen])

  // Generic open/close search (mobile takeover vs desktop advanced)
  const requestSearch = useCallback(
    (mode: "open" | "close") => {
      if (mode === "close") {
        setMobileSearchOpen(false)
        setMobileSearchPeek(false)
        setAdvancedSearchOpen(false)

        dockToSearchPendingRef.current = false
        setDockToSearchPending(false)
        pendingSearchModeRef.current = null

        return
      }

      // mode === "open"
      setMobileSearchPeek(false)

      if (isMobile) {
        if (dockOpen) return
        setMobileSearchOpen(true)
      } else {
        if (dockOpen) return
        setAdvancedSearchOpen(true)
      }
    },
    [isMobile, dockOpen]
  )

  // Back-compat
  const requestMobileSearch = useCallback(
    (mode: "open" | "close") => requestSearch(mode),
    [requestSearch]
  )

  // Dock -> Search (lupa) en ambos devices:
  // - Desktop: abre advanced al tiro
  // - Mobile: cierra dock, espera notifyDockSettled y abre takeover
  const openSearchFromDock = useCallback(() => {
  setMobileSearchPeek(false)

  // Si dock no está abierto, abre directo
  if (!dockOpen) {
    pendingSearchModeRef.current = null
    dockToSearchPendingRef.current = false
    setDockToSearchPending(false)

    if (isMobile) setMobileSearchOpen(true)
    else setAdvancedSearchOpen(true)

    return
  }

  // Coreografía real
  pendingSearchModeRef.current = "open"
  dockToSearchPendingRef.current = true
  setDockToSearchPending(true)
  console.log(pendingSearchModeRef.current)
  console.log(dockToSearchPendingRef.current)
  closeDock()
}, [isMobile, closeDock, dockOpen])


const notifyDockSettled = useCallback(() => {
  setDockSettled(true)
  console.log(pendingSearchModeRef.current)
  console.log(dockToSearchPendingRef.current)
  // ✅ gate live
  if (!dockToSearchPendingRef.current) return

  // consume
  dockToSearchPendingRef.current = false
  setDockToSearchPending(false)

  pendingSearchModeRef.current = null

  setMobileSearchPeek(false)
  if (isMobile) setMobileSearchOpen(true)
  else setAdvancedSearchOpen(true)
}, [isMobile])

  const state = useMemo<UIState>(
    () => ({
      isMobile,
      viewport: { width, height },
      intersectMap,
      dockOpen,
      dockSettled,
      mobileSearchOpen,
      mobileSearchPeek,
      advancedSearchOpen,
      autoSearchSuppressed,
      dockToSearchPending,
    }),
    [
      isMobile,
      width,
      height,
      intersectMap,
      dockOpen,
      dockSettled,
      mobileSearchOpen,
      mobileSearchPeek,
      advancedSearchOpen,
      autoSearchSuppressed,
      dockToSearchPending,
    ]
  )

  const actions = useMemo<UIActions>(
    () => ({
      registerRules,
      unregisterRules,

      setDockOpen,
      openDock,
      closeDock,
      toggleDock,

      requestSearch,
      requestMobileSearch,

      setMobileSearchPeek,
      setAdvancedSearchOpen,

      setAutoSearchSuppressed,

      openSearchFromDock,
      notifyDockSettled,
    }),
    [
      registerRules,
      unregisterRules,
      openDock,
      closeDock,
      toggleDock,
      requestSearch,
      requestMobileSearch,
      setMobileSearchPeek,
      setAdvancedSearchOpen,
      setAutoSearchSuppressed,
      openSearchFromDock,
      notifyDockSettled,
    ]
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error("useUI must be used within <UIProvider />")
  return ctx
}

export function useUIVisible(rules?: IntersectRule[]) {
  const { state, actions } = useUI()

  const stableRules = useMemo(() => rules ?? [], [rules])

  useEffect(() => {
    if (!stableRules.length) return
    actions.registerRules(stableRules)
    return () => actions.unregisterRules(stableRules)
  }, [actions, stableRules])

  const visible = useMemo(() => {
    if (!stableRules.length) return true

    return stableRules.some((rule) => {
      const inView = !!state.intersectMap[rule.target]
      return rule.when === "in" ? inView : !inView
    })
  }, [stableRules, state.intersectMap])

  return {
    visible,
    map: state.intersectMap,
    isMobile: state.isMobile,
    viewport: state.viewport,
  }
}