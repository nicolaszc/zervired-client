import { useEffect } from "react"

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const scrollY = window.scrollY

    const body = document.body
    const html = document.documentElement

    const prevBodyOverflow = body.style.overflow
    const prevHtmlOverflow = html.style.overflow

    body.style.overflow = "hidden"
    html.style.overflow = "hidden"

    return () => {
      body.style.overflow = prevBodyOverflow
      html.style.overflow = prevHtmlOverflow

      window.scrollTo(0, scrollY)
    }
  }, [locked])
}