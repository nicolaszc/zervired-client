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

  if (!mounted) return null // 🔑 CLAVE ABSOLUTA

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-sky-950/40 text-sky-950/80 dark:border-white/20 dark:text-white/80 px-4 py-2 text-sm backdrop-blur hover:bg-sky-950/10 dark:hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
    >
      
      <span className="hidden sm:inline text-sky-950/80 dark:text-white/80">
        {dark ? (
  <FontAwesomeIcon icon={faMoon} />
) : (
  <SunIcon className="w-5 h-5 text-sky-950 dark:text-white flex-inline" />
)}
{dark ? 'Dark': 'Light'}
      </span>
    </button>
  )
}
