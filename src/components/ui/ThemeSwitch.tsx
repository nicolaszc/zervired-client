'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { SunIcon } from './LightModeIcon'
import { cn } from '@/lib/utils'


export default function ThemeSwitch({className, ...props}:React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
    dark: <FontAwesomeIcon icon={faMoon} className={cn(dark ? 'text-(--highlight-d)' : '' )}/>,
    light: <SunIcon className={cn(dark ? '' : 'text-(--primary-l)')} />,
  }

  if (!mounted) return null // 🔑 CLAVE ABSOLUTA

  return (
    <>
      <button onClick={toggle} className={cn("flex-col translate-x-full", className)}  {...props} aria-label='dark mode'>    
        <span>
          {ICONS.dark}
        </span>
        <span>
          {ICONS.light}
        </span>
      </button>
    </>
    
  )
}
