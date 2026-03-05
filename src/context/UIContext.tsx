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
  hintToast: string | null
  // Anti-flash / coreografía dock -> search
  dockToSearchPending: boolean

  vvh: number | null
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
  showHintToast: (msg:string) => void

  // Dock -> Search coreografía
  openSearchFromDock: () => void
  notifyDockSettled: () => void

  //setVisualViewportHeight(h: number | null)
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

// Targets estables (evita [] nuevo cada render)
const EMPTY_TARGETS = useMemo<string[]>(() => [], [])

const t0 = g0?.targets ?? EMPTY_TARGETS
const t1 = g1?.targets ?? EMPTY_TARGETS
const t2 = g2?.targets ?? EMPTY_TARGETS

const g0Threshold = g0?.threshold
const g0Margin = g0?.margin

const g1Threshold = g1?.threshold
const g1Margin = g1?.margin

const g2Threshold = g2?.threshold
const g2Margin = g2?.margin

// Config estable por grupo (deps primitivas)
const cfg0 = useMemo(() => {
  const threshold = typeof g0Threshold === "number" ? g0Threshold : DEFAULT_THRESHOLD
  const rootMargin = toRootMarginPx(g0Margin ?? DEFAULT_MARGIN_RATIO, height)
  return { threshold, rootMargin }
}, [g0Threshold, g0Margin, height])

const cfg1 = useMemo(() => {
  const threshold = typeof g1Threshold === "number" ? g1Threshold : DEFAULT_THRESHOLD
  const rootMargin = toRootMarginPx(g1Margin ?? DEFAULT_MARGIN_RATIO, height)
  return { threshold, rootMargin }
}, [g1Threshold, g1Margin, height])

const cfg2 = useMemo(() => {
  const threshold = typeof g2Threshold === "number" ? g2Threshold : DEFAULT_THRESHOLD
  const rootMargin = toRootMarginPx(g2Margin ?? DEFAULT_MARGIN_RATIO, height)
  return { threshold, rootMargin }
}, [g2Threshold, g2Margin, height])

const map0 = useIntersectionGroup(t0, cfg0)
const map1 = useIntersectionGroup(t1, cfg1)
const map2 = useIntersectionGroup(t2, cfg2)

const intersectMap = useMemo(() => {
  return { ...(map0 ?? {}), ...(map1 ?? {}), ...(map2 ?? {}) }
}, [map0, map1, map2])

  // --- Dock (mantener tus useEffect tal cual) ---
  const [dockOpen, setDockOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [dockSettled, setDockSettled] = useState(true)
 
  useEffect(() => {
    const markHydrated = () => setHydrated(true)
    markHydrated()
  }, [])

  useEffect(() => {
    if (!hydrated) return
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
/*   useEffect(() => {
    if (!dockOpen) return // 👈 si está cerrado, no escuches nada

    const onScroll = () => {
      if (mobileSearchOpen) return
      if (mobileSearchPeek) return
      setDockOpen(false)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [dockOpen, isMobile, mobileSearchOpen, mobileSearchPeek]) */

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

       /* dockToSearchPendingRef.current = false
        setDockToSearchPending(false)
        pendingSearchModeRef.current = null */

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
    
    (mode: "open" | "close") => {
      requestSearch(mode)
      /* if (mode === 'open') {
      console.log('[requestMobileSearch OPEN]', { origin })
      console.trace()
      } */
    },[requestSearch]

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

  closeDock()
}, [isMobile, closeDock, dockOpen])


const notifyDockSettled = useCallback(() => {
  setDockSettled(true)

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

  const [hintToast, setHintToast] = useState<string | null>(null)
  const showHintToast = useCallback((msg: string) => {
    setHintToast(msg)
    window.setTimeout(() => setHintToast(null), 5000)
  }, [])

  const [vvh, setVvh] = useState<number | null>(null)

  useEffect(() => {
    if (!isMobile) return
    const vv = window.visualViewport
    if (!vv) return

    const onResize = () => {
    const h = Math.round(vv.height)
      setVvh((prev) => (prev === h ? prev : h))
    }
    onResize()

    vv.addEventListener("resize", onResize)
    vv.addEventListener("scroll", onResize)
    return () => {
      vv.removeEventListener("resize", onResize)
      vv.removeEventListener("scroll", onResize)
    }
  }, [isMobile])

  type Snap = { 
  isMobile: boolean 
  intersectMap: Record<string, boolean> 
  dockOpen: boolean 
  dockSettled: boolean // Mobile search layer 
  mobileSearchOpen: boolean 
  mobileSearchPeek: boolean // Desktop search layer (AdvancedSearch) 
  advancedSearchOpen: boolean // Hint suppression (solo afecta peek) 
  autoSearchSuppressed: boolean 
  hintToast: string | null // Anti-flash / coreografía dock -> search 
  dockToSearchPending: boolean // agrega aquí los otros flags/values que tengas en UIContext 
  } 
  const prevSnap = useRef<Snap | null>(null) 
  useEffect(() => { const snap: Snap = { 
  isMobile, 
  dockSettled, 
  intersectMap, 
  advancedSearchOpen, 
  hintToast, 
  dockToSearchPending, 
  dockOpen, 
  mobileSearchOpen, 
  mobileSearchPeek, 
  autoSearchSuppressed, 
  } 
  if (prevSnap.current) { 
    (Object.keys(snap) as (keyof Snap)[]).forEach((k) => { if (prevSnap.current![k] !== snap[k]) { console.log('[UI STATE CHANGE]', k, prevSnap.current![k], '=>', snap[k]) } }) 
  } else { 
    console.log('[UI SNAP INIT]', snap) 
  } prevSnap.current = snap })
  
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
      hintToast,
      vvh,
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
      hintToast,
      vvh,
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
      showHintToast,
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
      showHintToast,
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