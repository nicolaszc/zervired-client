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
    <section className="relative overflow-hidden bg-amber-500 dark:bg-sky-500 z-1">
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
            className="object-cover mix-blend-multiply opacity-[.4]"
          />
        </motion.div>
      </AnimatePresence>

        <div className="absolute w-[100%] top-0 h-[50%] md:left-0 md:w-[50%] md:h-[100%] bg-amber-950/40 dark:bg-sky-950/70 z-1"></div>
        <div className="absolute w-[100%] top-[50%] h-[50%] md:top-0 md:left-[50%] md:w-[50%] md:h-[100%] bg-amber-500/20 dark:bg-sky-500/40 z-1"></div>
        {/* Content */}
        <div className='relative z-10 grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-12 mx-auto max-w-7xl px-6 py-10'>

          <div className='flex flex-col row-span-1 md:flex-row h-full min-h-full items-center justify-center'>
            <h1 className="text-center md:text-start md:w-[50%] md:me-5 text-4xl font-semibold tracking-normal text-shadow-lg text-shadow-amber-950/50 dark:text-shadow-sky-950/50 mt-3 mb-4 text-white">3 simples pasos y encuentra tu servicio</h1>
            <ol className='list-decimal list-inside text-white text-shadow-lg text-shadow-amber-950/50 dark:text-shadow-sky-950/50 p-0 m-0 text-lg font-semibold leading-none'>
              <li className='flex items-center mb-6'>
                <span className='bg-amber-500/90 dark:bg-sky-950/90 rounded-full w-8 h-8 text-white text-shadow-none shadow-lg shadow-grey-500/30 dark:shadow-sky-500/70 me-3 flex justify-center items-center text-xl'>1</span>
                <span className='font-thin'>Busca un servicio</span>
              </li>
              <li className='flex items-center mb-6'>
                <span className='bg-amber-500/90 dark:bg-sky-950/90 rounded-full w-8 h-8 text-white text-shadow-none shadow-lg shadow-grey-500/30 dark:shadow-sky-500/70 me-3 flex justify-center items-center text-xl'>2</span>
                <span className='font-thin'>Elige un provider verificado</span> 
              </li>
              <li className='flex items-center mb-6'>
                <span className='bg-amber-500/90 dark:bg-sky-950/90 rounded-full w-8 h-8 text-white text-shadow-none shadow-lg shadow-grey-500/30 dark:shadow-sky-500/70 me-3 flex justify-center items-center text-xl'>3</span>  
                <span className='font-thin'>Agenda y contrata fácil y seguro</span> 
              </li>
            </ol>
          </div>

          <div className="flex flex-col row-span-1 h-full justify-center items-center">
            <h1 className="text-center text-4xl font-semibold tracking-normal text-shadow-lg text-shadow-amber-950/50 dark:text-shadow-sky-950/50 mt-3 text-white">
              Inscríbete como proveedor
            </h1>

            <p className="mt-1 text-center text-white font-light uppercase text-xs text-shadow-lg text-shadow-amber-950/50 dark:text-shadow-sky-950/50 tracking-[.415rem]">
              Personas reales ofreciendo servicios reales
            </p>

            <div className="w-64 text-sm mt-5 text-center">
              <input
                type="mail"
                placeholder="mail@mail.com"
                className="w-full block mb-3 rounded-full bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
              />
              <input
                type="password"
                placeholder="********"
                className="w-full block mb-3 rounded-full bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
              />
              <button className="rounded-full bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 text-white cursor-pointer transition">
                Enviar
              </button>
              <button type="button" className="mt-8 text-sky-950 bg-white hover:bg-white/80 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-extralight rounded-full text-sm px-6 py-1.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                <Image className="w-6 h-6" width={24} height={24} src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />Sign up with Google
              </button>
            </div>

          </div>

        </div>
      
    </section>
  )
}
