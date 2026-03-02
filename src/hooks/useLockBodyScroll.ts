import { useEffect } from "react"

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const scrollY = window.scrollY || document.documentElement.scrollTop

    const body = document.body
    const html = document.documentElement

    // Guardar estilos previos para restaurar limpio
    const prevBodyStyle = body.getAttribute("style") ?? ""
    const prevHtmlStyle = html.getAttribute("style") ?? ""

    // Congelar scroll (iOS-safe)
    html.style.height = "100%"
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    body.style.overflow = "hidden"
    console.log('locked')
    return () => {
      // Restaurar
      body.setAttribute("style", prevBodyStyle)
      html.setAttribute("style", prevHtmlStyle)

      window.scrollTo(0, scrollY)
      console.log('locked')
    }
  }, [locked])
}