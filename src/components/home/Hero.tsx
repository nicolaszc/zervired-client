'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const backgrounds = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-amber-500 dark:bg-sky-500 relative z-1">
      {/* Background slideshow */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={backgrounds[index]}
            alt="Hero background"
            fill
            priority
            className="object-cover mix-blend-multiply opacity-50"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-sky-900/40 z-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-normal text-shadow-lg/20 mt-3 text-white">
          Encuentra servicios cerca de ti
        </h1>

        <p className="mt-1 text-white/80 font-light uppercase text-xs text-shadow-lg/50 tracking-[.415rem]">
          Personas reales ofreciendo servicios reales
        </p>

        <div className="mt-8 flex justify-center">
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-64 rounded-l-full bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
          />
          <button className="rounded-r-full bg-sky-500 hover:bg-sky-600 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 text-white cursor-pointer transition">
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
