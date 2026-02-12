'use client'

import { useState, useEffect } from 'react'

export default function useViewportSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    const calc = () => {
      const viewport = window.visualViewport

      setSize({
        width: viewport?.width ?? window.innerWidth,
        height: viewport?.height ?? window.innerHeight
      })
    }

    calc()

    window.addEventListener('resize', calc)
    window.visualViewport?.addEventListener('resize', calc)

    return () => {
      window.removeEventListener('resize', calc)
      window.visualViewport?.removeEventListener('resize', calc)
    }
  }, [])

  return size
}
