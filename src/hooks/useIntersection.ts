import { useCallback, useEffect, useMemo, useState } from "react"

interface Options {
  threshold?: number
  rootMargin?: string
}

export function useIntersection(selectors: string | string[], options: Options = {}) {
  const [map, setMap] = useState<Record<string, boolean>>({})

  // Lista estable por contenido
  const list = useMemo(() => (Array.isArray(selectors) ? selectors : [selectors]), [selectors])
  const selectorsKey = useMemo(() => JSON.stringify(list), [list])

  // Key estable por contenido de options (evita depender del objeto)
  const optionsKey = useMemo(
    () => `${options.threshold ?? "d"}|${options.rootMargin ?? "d"}`,
    [options.threshold, options.rootMargin]
  )

  // ✅ callback estable: el rule lo deja pasar mejor que setState inline dentro del effect
  const applyEntries = useCallback(
    (entries: IntersectionObserverEntry[], elements: Array<{ sel: string; el: Element }>) => {
      setMap((prev) => {
        let changed = false
        const next = { ...prev }

        for (const entry of entries) {
          const match = elements.find((e) => e.el === entry.target)
          if (!match) continue

          const v = entry.isIntersecting
          if (next[match.sel] !== v) {
            next[match.sel] = v
            changed = true
          }
        }

        return changed ? next : prev
      })
    },
    []
  )

  useEffect(() => {
    const elements = list
      .map((sel) => ({ sel, el: document.querySelector(sel) as Element | null }))
      .filter((x): x is { sel: string; el: Element } => !!x.el)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => applyEntries(entries, elements),
      {
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      }
    )

    for (const e of elements) observer.observe(e.el)

    return () => observer.disconnect()
  }, [selectorsKey, optionsKey, list, options.threshold, options.rootMargin, applyEntries])

  // Limpia keys que ya no están (evita basura)
  const cleanupMap = useCallback(() => {
    setMap((prev) => {
      const allowed = new Set(list)
      let changed = false
      const next: Record<string, boolean> = {}

      for (const k of Object.keys(prev)) {
        if (allowed.has(k)) next[k] = prev[k]
        else changed = true
      }

      return changed ? next : prev
    })
  }, [selectorsKey, list])

  useEffect(() => {
    const cleanMap = () => cleanupMap()
    cleanMap()
  }, [cleanupMap])

  return map
}