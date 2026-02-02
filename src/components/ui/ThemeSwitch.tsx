'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { SunIcon } from './SunIcon'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true)

  const stored = localStorage.getItem('theme')
  if (stored === 'dark') {
    document.documentElement.classList.add('dark')
    setDark(true)
  }
}, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const ICONS = {
    dark: <FontAwesomeIcon icon={faMoon} />,
    light: <SunIcon className="w-5 h-5" />,
  }

  if (!mounted) return null // 🔑 CLAVE ABSOLUTA

  return (
    <>
      <button onClick={toggle} className="w-6 h-19 flex flex-col items-center justify-center gap-2 border-b border-sky-950/30 dark:border-white/20">    
        <span className={`${dark ? 'opacity-100' : 'opacity-40 hover:opacity-100 hover:text-sky-500 cursor-pointer'}`}>
          {ICONS.dark}
        </span>
        <span className={`${!dark ? 'opacity-100' : 'opacity-40 hover:opacity-100 hover:text-amber-500 cursor-pointer'}`}>
          {ICONS.light}
        </span>
      </button>
    </>
    
  )
}
