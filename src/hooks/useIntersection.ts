import { useEffect, useState } from 'react'

interface Options {
  threshold?: number
  rootMargin?: string
}

export function useIntersection(
  selectors: string | string[],
  options: Options = {}
) {
const [map, setMap] = useState<Record<string, boolean>>({})
const selectorsKey = JSON.stringify(selectors)

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const list = Array.isArray(selectors)
      ? selectors
      : [selectors]

    const elements = list
      .map(sel => ({
        sel,
        el: document.querySelector(sel)
      }))
      .filter(x => x.el)

    if (!elements.length) return

    const observer = new IntersectionObserver((entries) => {
      setMap(prev => {
        const next = { ...prev }

        entries.forEach(entry => {
          const match = elements.find(e => e.el === entry.target)
          if (match) {
            next[match.sel] = entry.isIntersecting
          }
        })

        return next
      })
    }, options)

    elements.forEach(e => observer.observe(e.el!))

    return () => observer.disconnect()

  }, [selectorsKey, options])

  return map
}
