'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'header' | 'mobile' | 'floating'
  className?: string
}

export default function ProvidersSearch({
  variant = 'header',
  className,
}: Props) {

  const router = useRouter()
  const [term, setTerm] = useState('')

  const handleSearch = () => {
    if (!term.trim()) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  const containerStyles = {
    header: 'hidden md:flex justify-center items-center text-sm',
    mobile: 'flex flex-col w-full',
    floating: 'flex w-full items-center',
  }

  return (
    <div className={cn(containerStyles[variant], className)}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="¿Qué servicio buscas?"
        className="
          w-64
          rounded-l-lg
          bg-white/90
          px-4
          py-2
          placeholder-gray-700
          focus:outline-none
          text-sky-950
        "
      />

      <button
        onClick={handleSearch}
        className="
          rounded-r-full
          bg-sky-950
          hover:bg-sky-950/90
          dark:bg-amber-500
          dark:hover:bg-amber-600
          px-6
          py-2
          text-white
          cursor-pointer
          transition
        "
      >
        Buscar
      </button>
    </div>
  )
}
