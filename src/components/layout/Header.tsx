'use client'

import { useState } from 'react'
import Image from 'next/image'
import logoLight from '@/assets/logo/logo-zervired-light.svg'
import logoDark from '@/assets/logo/logo-zervired-dark.svg'
import ThemeSwitch from '@/components/ui/ThemeSwitch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faXTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-amber-500 dark:bg-[#041926] fixed z-20 w-full top-0">
      <div className="mx-auto max-w-7xl px-6 py-2.5 flex items-center justify-between bg-amber-500 dark:bg-[#041926] relative z-2">

        {/* Logo */}
        <div className="h-20 me-51.5">
          <Image
            src={logoLight}
            alt="Logo Zervired"
            height={80}
            className="h-20 w-auto dark:hidden"
            priority
          />
          <Image
            src={logoDark}
            alt="Logo Zervired"
            height={80}
            className="h-20 w-auto hidden dark:block"
            priority
          />
        </div>

        <div className="hidden md:flex justify-center items-center text-sm">
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-64 rounded-l-full bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
          />
          <button className="rounded-r-full bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 text-white cursor-pointer transition">
            Buscar
          </button>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex justify-end items-center gap-6 text-sm w-80">
          

          <a
            href="#"
            className="rounded-full px-4 py-2 text-white bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 hover:dark:bg-amber-500/90"
          >
            Publicar servicio
          </a>

          <ThemeSwitch />
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-xl"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden
          absolute z-1 -top-full left-0 w-full h-[calc(100vh-100px)] pt-12.5 text-center
          bg-amber-500 dark:bg-[#041926]
          transition-all duration-300 ease-out
          ${open ? 'translate-y-50' : '-translate-y-full pointer-events-none'}
        `}
      >
        <nav className="flex flex-col gap-4 px-6 py-6 justify-center items-center">
          <div className="flex justify-center items-center text-sm w-full">
            <input
              type="text"
              placeholder="¿Qué servicio buscas?"
              className="w-full rounded-l-full bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
            />
            <button className="rounded-r-full bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 text-white cursor-pointer transition">
              Buscar
            </button>
          </div>

          <a
            href="#"
            className="w-full md:w-auto rounded-full px-4 py-2 mb-12 text-white bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 hover:dark:bg-amber-500/90"
          >
            Publicar servicio
          </a>

          <ThemeSwitch />

          <div className="mx-auto max-w-7xl px-6 pt-10 pb-2 mt-4 text-sm flex flex-col justify-between items-center dark:opacity-75">
            <p className='text-base'><span className="font-semibold">Zervired</span>, el marketplace de servicios reales, para personas reales.</p>
            <div className='rrss mt-4 mb-8 text-center'>
              <p className='mb-1'>Siguenos en:</p>
              <a className='w-8 h-8 text-2xl mx-3' aria-label="LinkedIn de Zervired">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a className='w-8 h-8 text-2xl mx-3' aria-label="Twitter de Zervired">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a className='w-8 h-8 text-2xl mx-3' aria-label="Instagram de Zervired">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>      
            <small>© {new Date().getFullYear()} Zervired</small>
          </div>

        </nav>
      </div>
    </header>
  )
}
